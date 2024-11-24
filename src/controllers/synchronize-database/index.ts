import { NextFunction, Request, Response } from "express";
import { application } from "../../index.js";
import { Degree, Files, Status } from "../../database/entities/Files.js";
import { DataSource, In, MoreThan, MoreThanOrEqual, Or } from "typeorm";

export class Synchronize {

    public static async sync(request: Request, response: Response, next: NextFunction) {
        const databaseConn = application.getDatabaseConn()
        const database = request.app.get("database")
        const { last_synced_at, entities } = request.body
        const { user_id }:any = request.headers
        const last_synced_at_server = new Date()

        const result = await databaseConn.getRepository(Files).createQueryBuilder('files')
            .where('files.created_at > :startTime AND files.created_at < :endTime OR files.updated_at > :startTime AND files.updated_at < :endTime')
            .andWhere('files.bucket_id = :user_id OR files.bucket_id = :global')
            .andWhere('files.last_updated_by is not :user_id')
            .setParameters({
                startTime: last_synced_at,
                endTime: last_synced_at_server,
                user_id: user_id,
                global: 'global'
            })
            .getMany();

        await Synchronize.insertFilesFromClient(entities,user_id, databaseConn)

        response.status(201).json({
            entities: result,
            last_synced_at: last_synced_at_server
        })
    }

    private static async insertFilesFromClient(data: any[], user_id, databaseConn: DataSource) {

        const filesToInsert: Files[] = data.map((fileData) => {
            const file = new Files();
            file.key = fileData.key;
            file.metadata = fileData.metadata || null;
            file.degree = fileData.degree || Degree.LAZYLOAD;
            file.bucket_id = fileData.bucket_id || 'global';
            file.synced = Status.SERVER_ONLY;
            file.created_at = fileData.created_at;
            file.updated_at = fileData.updated_at;
            file.last_updated_by = user_id;

            return file;
        });

        // Insert the files into the database
        const fileRepository = databaseConn.getRepository(Files);
        await fileRepository.insert(filesToInsert); // Save all files at once

        console.log('Files inserted:', filesToInsert);
    }
}


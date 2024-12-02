import { PutObjectCommand, CreateMultipartUploadCommand, UploadPartCommand, S3Client, CompleteMultipartUploadCommand, GetObjectCommand } from "@aws-sdk/client-s3";

import {
    getSignedUrl,
    S3RequestPresigner,
  } from "@aws-sdk/s3-request-presigner";
import { createReadStream } from "fs";


export class PresignedUrl { 

    private static getClient() { 
        return new S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,   
            },
            logger: console
        })
    }

    public static async getPut({ bucket, key }) { 
        const default_bucket = process.env.AWS_BUCKET_NAME;
        const command = new PutObjectCommand({
            Bucket: bucket || default_bucket,
            Key: key,
        });
        const url = await getSignedUrl(this.getClient(),command, { expiresIn:900 });
        return url;
    }
    public static async getGET({ bucket, key }) { 
        const default_bucket = process.env.AWS_BUCKET_NAME;
        const command = new GetObjectCommand({
            Bucket: bucket || default_bucket,
            Key: key,
        });
        const url = await getSignedUrl(this.getClient(),command, { expiresIn:900 });
        return url;
    }

    public static async getMultipartUpload({bucket, key}) { 
        const default_bucket = process.env.AWS_BUCKET_NAME;
        const command = new CreateMultipartUploadCommand({
            ACL: "authenticated-read",
            Bucket: bucket || default_bucket,
            Key: key
        });
        return getSignedUrl(this.getClient(), command, { expiresIn: 3600 });
    }

    public static async getUploadPart({bucket, key, upload_id, part_number}) { 
        const default_bucket = process.env.AWS_BUCKET_NAME;
        const command = new UploadPartCommand({
            PartNumber: part_number,
            UploadId: upload_id, 
            Bucket: bucket || default_bucket,
            Key: key
        });
        return getSignedUrl(this.getClient(), command, { expiresIn: 3600 });
    }

    public static async getCompleteMultipartUpload({bucket, key, upload_id}) { 
        const default_bucket = process.env.AWS_BUCKET_NAME;
        const command = new CompleteMultipartUploadCommand({
            Bucket: bucket || default_bucket,
            UploadId: upload_id,
            Key:key
        });
        return getSignedUrl(this.getClient(), command, { expiresIn: 3600 });
    }
}
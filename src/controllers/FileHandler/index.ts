import busboy from "busboy"
import { NextFunction, Request, Response } from "express";
import { createWriteStream, access, fstat, unlink, createReadStream } from "fs";
import { getExtensions } from "../../utils/media.js";
import { error } from "console";

interface File{
    fieldName: string,
    path: string,
    filename: string,
    mimeType: string
}
type Files = File[]


export class FileHandler {
    public static download(request: Request, response: Response) { 
        const { key } = request.params

        /*
            get buffer from somewhere
            pipe to response
        */
        response.status(200)
        createReadStream("./eagle.jpeg").pipe(response)
    }

    public static upload(files:Files) {
        
    }

    /* 
        adds key "files" to the request body 
        which contains information on the files
        found in the request stream

    */
    public static streamProcessor(request: Request, response: Response, next: NextFunction) { 
        console.log("request.headers",JSON.stringify(request.headers, null, 5))
        const bb = busboy({ headers: request.headers });

        const processed_files = [];
        bb.on('file', (name, file, info) => {

            const { filename, encoding, mimeType } = info;
            console.log("info",JSON.stringify(info, null, 5))
            const hasExtension = filename.split(".").length > 1;
            const [extension_1] = getExtensions(mimeType)
            const extension = hasExtension?'':`.${extension_1}`
           
            console.log(`File [${name}]: filename: %j, encoding: %j, mimeType: %j`, filename, encoding, mimeType);
           
            const path = `./var/${filename}${extension}`
            const wStream = createWriteStream(path)
            
            wStream.on("error", (error) => {
                console.log("wStream",error)
            })

            file.on('data', (data) => {
                wStream.write(data, (error) => {
                    if (error) {
                        unlink(path, (err) => {
                            if (err) { 
                                console.log("ERROR IN DELETING FILE")
                            } else {
                                console.log("file deleted!", path)
                            }
                        });
                    } else {
                     
                    }
                })
            }).on('close', () => {
                const file:File = { fieldName:name,filename, mimeType, path }
                processed_files.push(file);

                wStream.end();
                console.log(`File [${name}] done`,wStream.writableEnded);
            });
        });
        
        bb.on('field', (name, val, info) => {
            console.log(`Field [${name}]: value: %j`, val);
        });

        bb.on('close', () => {
            request.body.files = processed_files
            console.log('Done parsing form!');
            next()
        });

        request.pipe(bb);
    }
}
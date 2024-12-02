import { NextFunction, Request, Response } from "express";
import { PresignedUrl } from "../../controllers/S3/PresignedURL.js";


export class PresignedURL {
    public static async handler(request: Request, response: Response, next:NextFunction) { 
        const { key, bucket, command, part_number, upload_id  } = request.body
        
        let signedURL: string;
        let notFound = false
        switch (command) { 
            case "GET":
                signedURL = await PresignedUrl.getGET({ key, bucket })
                break;
            case "PUT":
                signedURL = await PresignedUrl.getPut({ key, bucket })
                break;
            case "MULTI-PART-UPLOAD":
                signedURL = await PresignedUrl.getMultipartUpload({ key, bucket })
                break;
            case "UPLOAD-PART":
                signedURL = await PresignedUrl.getUploadPart({ key, bucket, part_number, upload_id })
                break;
            case "COMPLETE-MULTI-PART-UPLOAD":
                signedURL = await PresignedUrl.getCompleteMultipartUpload({ key, bucket, upload_id })
                break;
            default:
                notFound=true
        }

        if (notFound) {
            response.status(404).json({
                message: "Unknown command"
            })
        } else {
            response.status(201).json({
                signedURL
            })
        }
        
    }
}
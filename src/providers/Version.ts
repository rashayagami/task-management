import { NextFunction, Request,Response } from "express";
import { valid } from "semver"
import status from "http-status";

export class Version { 
    public static is(semver: string) { 
        return function versionIs(request: Request, response: Response, next: NextFunction) { 
            const version = request.headers['x-api-version']
            if (version && valid(version)) { 
                if (version.toString() === semver) {
                    response.header("x-api-version",semver)
                    next()
                } else {
                    response.status(status.NOT_ACCEPTABLE).json({ message: "The specified API version is not supported" }).end()
                }
            } else {
                response.status(status.BAD_REQUEST).json({ message: "The specified API version \"" + version + "\" is invalid" }).end()
            }
        }
    }
}
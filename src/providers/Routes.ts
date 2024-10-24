import { Application } from "express"
import  { routes } from "../routes/index.js"

export class Routes{

    public loadApisV1(application:Application) { 
        const apiV1Prefix = '/' + process.env.apiV1Prefix
        application.use(apiV1Prefix, routes.v1)
    }

    public loadApisV2(application:Application) { 
        const apiV2Prefix = '/' + process.env.apiV2Prefix
        application.use(apiV2Prefix, routes.v2)
    }
}
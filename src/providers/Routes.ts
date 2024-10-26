import { Application } from "express"
import  {  v1Router, v2Router } from "../routes/index.js"

export class Routes{

    public loadApisV1(application:Application) { 
        application.use(v1Router)
    }

    public loadApisV2(application:Application) { 
        application.use(v2Router)
    }
}
import { Router } from 'express';
import status from "http-status";


export const v2Router = Router();
v2Router.use('/v2', mock);
function mock(err, req, res, next) { 
    console.log("/v2",req)
 }
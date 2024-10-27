/**
 * @swagger
 * components:
 *   schemas:
 *     Test:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - finished
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the Test
 *         title:
 *           type: string
 *           description: The title of your Test
 *         author:
 *           type: string
 *           description: The Test author
 *         finished:
 *           type: boolean
 *           description: Whether you have finished testing
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the Test was done
 *       example:
 *         id: #34IBS23
 *         title: Nothing Here
 *         author: Krushal
 *         finished: false
 */
import e from "express"
import { Version } from "../providers/Version.js"
export const testApi = e.Router()


testApi.get("/hello", Version.is('1.0.0'), (request, response, next) => {
    response.json({message:"api is functioning"})
})
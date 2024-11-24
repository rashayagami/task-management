/**
 @swagger
swagger: "2.0"
info:
  title: Sample API
  description: API description in Markdown.
  version: 1.0.0

host: api.example.com
basePath: /api
schemes:
  https

paths:
  /users:
    get:
      summary: Returns a list of users.
      description: Optional extended description in Markdown.
      produces:
        - application/json
      responses:
        200:
          description: OK
 */
import e, { Request, Response } from "express"
import { Version } from "../providers/Version.js"
import { FileHandler } from "../controllers/FileHandler/index.js"
import { Synchronize } from "../controllers/synchronize-database/index.js"
export const testApi = e.Router()


testApi.get("/hello",  (request, response, next) => {
  response.json({ message: "api is functioning" })
})

testApi.get("/file", (req, res) => {
  res.writeHead(200, { Connection: 'close' });
  res.end(`
      <html>
        <head></head>
        <body>
          <form method="POST" enctype="multipart/form-data" action="http://localhost:3001/api/file">
            <input entity="animal" type="file" name="file-field-1"><br />
            <input entity="inanimate-object"  type="file" name="file-field-2"><br />
            <input type="text" name="message-field"><br />
            <input type="submit">
          </form>
        </body>
      </html>
    `);
})
testApi.get("/file/:key", FileHandler.download)
testApi.post("/file", FileHandler.streamProcessor, (req, res) => { 
  console.log("after processing stream", JSON.stringify(req.body, null, 5))
  res.status(200).send({
    message: "processed"
  })
})
testApi.post("/sync", Synchronize.sync);
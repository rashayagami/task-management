import { Application } from "express";
import { realpathSync } from "fs";
import path from "path";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "Task management system",
      version: "0.0.1",
      description:
        "has to be described.",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Krushal",
        url: "www.krushal.in",
        email: "hello@krushal.in",
      },
    },
    servers: [
      {
        url: "http://localhost:3001",
      },
    ],
  },
    apis: [path.join(path.resolve(),"dist", "routes", "index.js")],
};

export class Documentation { 
    public static load(app:Application) { 
        const specs = swaggerJsdoc(options);
        app.use("/api-documentation", swaggerUi.serve, swaggerUi.setup(specs));
    }
}

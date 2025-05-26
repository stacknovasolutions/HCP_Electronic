import express from "express";
import { Server } from "@overnightjs/core";
import dotenv from "dotenv";
import { Server as httpServer } from "http";
import * as bodyParser from "body-parser";
import * as controllers from "./controllers";
import path from "path";
import cors from "cors";
import { morganErrorHandler, morganSuccessHandler } from "./config/morgan";
import logger from "./config/logger";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

dotenv.config();

const port = process.env.PORT ?? 8000;
const NODE_ENV = process.env.NODE_ENV;

export class ExpressServer extends Server {
  constructor() {
    super();
    this.setupExpress();
    this.setupControllers();
    // FOR Handling client side routing i.e browser hard refresh
    this.app.get('*', (req, res) => {
      res.sendFile(path.resolve('public', 'index.html'));
    });
  }

  private setupExpress(): void {
    this.app.use(express.static('public'));
    this.app.use(bodyParser.json({ limit: "900mb" }));
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(morganErrorHandler);
    this.app.use(morganSuccessHandler);
    this.app.use(cors());

    const swaggerDefinition = {
      openapi: "3.0.0",
      info: {
        title: "Your API Title",
        version: "1.0.0",
        description: "Your API Description",
      },
    };

    const extension = NODE_ENV === "PRODUCTION" ? ".js" : ".ts";
    const options = {
      swaggerDefinition,
      // Path to the OvernightJS controllers
      apis: [path.resolve(__dirname + `/controllers/*${extension}`)],
    };

    const specs = swaggerJsdoc(options);

    this.app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

  }

  private setupControllers(): void {
    const controllerInstances = [];
    for (const name of Object.keys(controllers)) {
      const controller = (controllers as any)[name];
      if (typeof controller === "function") {
        controllerInstances.push(new controller());
      }
    }
    super.addControllers(controllerInstances);
  }

  public start(): httpServer {
    return this.app.listen(port, () => {
      logger.debug("Server listening on port:" + port);
    });
  }
}

const server = new ExpressServer();
server.start();

export default ExpressServer;

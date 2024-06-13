import fs from "fs"
import path from "path";
import cors from "cors";
import https from "https";
import http from "http";
import log4js from "log4js";
import helmet from "helmet";
import bodyParser from "body-parser";
import compression from "compression";
import express, { Application } from "express";

import apiRoutes from "@routes/api";
import webRoutes from "@routes/web";
import mobileRoutes from "@routes/mobile";
import os from "os";

import db from "@config/database";
import license from "@utils/sippp";
import getConfig from "@config/dotenv";
import { initSocketIO } from "@config/socket";
import limiter from "@middleware/rate-limit";
import logger, { errorLogger } from "@config/logger";
import authorization from "@middleware/authorization";
import { notFound } from "@middleware/error-notfound";
import { errorhandler } from "@middleware/error-handler";

import cluster from "cluster";

log4js.configure(logger);

if (cluster.isPrimary) {
  const numCPUs = os.cpus().length
  console.log(`Primary ${process.pid} is running`);

  console.log("cpu", numCPUs);

  for(let i = 0 ; i < numCPUs ; i++) {
    cluster.fork()
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
  })
}
else {
  const app: Application = express();
  
  
  /**
   * certificate keys
   */
  var key = fs.readFileSync("src/certificate/ut.key", "utf-8");
  var cert = fs.readFileSync("src/certificate/full-bundle.crt", "utf-8");
  
  var options = { key: key, cert: cert };
  
  /**
   * body parser
   */
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  
  /**
   * helmet
   */
  app.use(helmet());
  
  /**
   * cors
   */
  app.use(cors());
  
  /**
   * compression
   */
  app.use(compression());
  
  /**
   * limiter
   */
  app.use(limiter);
  
  //###############CLSUTER##########
  
  // if (cluster.isPrimary) {
  //   console.log(`Master ${process.pid} is running`);
  
  //   app.use(
  //     "/user-management/public/image/",
  //     express.static(path.join(__dirname, "../public/aplikasi"))
  //   );
    
  //   app.use(
  //     "/user-management/public/image/profil/",
  //     express.static(path.join(`D:/Dev SIPPP/PMO/public/images/userphoto`))
  //   )
  
  //   app.use("/user-management/api", apiRoutes)
  
  //   /**
  //  * not found
  //  */
  // app.use(notFound);
  
  
  // /**
  //  * error handler
  //  */
  // app.use(errorhandler);
  // /**
  //  * sync database
  //  */
    
  //   // Fork workers
  //   const numCPUs = require('os').cpus().length;
  //   for (let i = 0; i < numCPUs; i++) {
  //     cluster.fork();
  //   }
  
  //   cluster.on('exit', (worker, code, signal) => {
  //     console.log(`Worker ${worker.process.pid} died`);
  //   });
  
  // try {
  //   const server = http.createServer(app);
  //   server.listen(getConfig("PORT_SERVER"), () => {
  //     console.log(license);
  //     console.log(
  //       `${String.fromCodePoint(
  //         0x1f525
  //       )} SERVER USMAN ON PORT : ${getConfig(
  //         "PORT_SERVER"
  //       )} ${String.fromCodePoint(0x1f525)}`
  //     );
  //     initSocketIO(server);
  //   });
  // } catch (error) {
  //     errorLogger.error(`SERVER ERROR: ${error}`);
  //   }
  // }
  
  // else {
  //   console.log(`Worker ${process.pid} started`);
  // }
  
  /**
   * dokumen path
   */
  
  
  //TES CLUSTER
  //###############################################################
  app.use(
    "/user-management/public/image/",
    express.static(path.join(__dirname, "../public/aplikasi"))
  );
  
  app.use(
    "/user-management/public/image/profil/",
    express.static(path.join(`D:/Dev SIPPP/PMO/public/images/userphoto`))
  )
  
  
  
  /**
   * routes
   */
  app.use("/user-management/api", apiRoutes)
  // app.use("/expenditure/web", authorization, webRoutes);
  // app.use("/expenditure/mobile", authorization, mobileRoutes);
  
  /**
   * not found
   */
  app.use(notFound);
  
  
  /**
   * error handler
   */
  app.use(errorhandler);
  /**
   * sync database
   */
  // db.sync()
  //   .then(() => {
  //     const server = http.createServer(app);
  //     server.listen(getConfig("PORT_SERVER"), () => {
  //       console.log(license);
  //       console.log(
  //         `${String.fromCodePoint(
  //           0x1f525
  //         )} SERVER USMAN ON PORT : ${getConfig(
  //           "PORT_SERVER"
  //         )} ${String.fromCodePoint(0x1f525)}`
  //       );
  //       console.log("TES")
  //       initSocketIO(server);
  //     });
  //   })
  //   .catch((error) => {
  //     errorLogger.error(`SERVER ERROR: ${error}`);
  //   });
  // aziz ganteng, ivo ganteng, rendy pangeran
  
  
  
    try {
      const server = https.createServer(app,options);
      server.listen(getConfig("PORT_SERVER"), () => {
        console.log(license);
        console.log(
          `${String.fromCodePoint(
            0x1f525
          )} SERVER USMAN ON PORT : ${getConfig(
            "PORT_SERVER"
          )} ${String.fromCodePoint(0x1f525)}`
        );
        initSocketIO(server);
      });
    } catch (error) {
        errorLogger.error(`SERVER ERROR: ${error}`);
    }
}



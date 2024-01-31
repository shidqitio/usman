import express from "express";
const routes = express.Router();
import example from "@routes/api/example-route";

routes.use("/v1", example);

export default routes;

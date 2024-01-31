import express from "express";
import apiController from "@controllers/api/api-controller";
const routes = express.Router();

routes.get("/example", apiController.lists);

export default routes;

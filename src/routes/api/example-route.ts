import express from "express";
import validate from "@schema/validate";
import apiController from "@controllers/api/api-controller";
import {
  getExampleSchema,
  payloadExampleSchema,
  searchExampleSchema,
  updatedExampleSchema,
} from "@schema/api/example-schema";
const routes = express.Router();

routes.get("/example", validate(searchExampleSchema), apiController.lists);
routes.get("/example/:id", validate(getExampleSchema), apiController.detail);
routes.post("/example", validate(payloadExampleSchema), apiController.store);
routes.put("/example", validate(updatedExampleSchema), apiController.updated);
routes.delete(
  "/example/:id",
  validate(getExampleSchema),
  apiController.destroy
);

export default routes;

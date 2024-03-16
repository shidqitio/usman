import  express  from "express";
import validate from "@schema/validate";
import refGroupController from "@controllers/api/refGroup-controller";
import {
    payloadRefGroupSchema
} from "@schema/api/refGroup-schema"

const routes = express.Router()

routes.get("/", refGroupController.index);

routes.post("/", 
            validate(payloadRefGroupSchema), 
            refGroupController.store);

export default routes
import  express  from "express";
import validate from "@schema/validate";
import refGroupController from "@controllers/api/refGroup-controller";
import {
    payloadRefGroupSchema,
    paramRefGroupSchema, 
    updatedRefGroupSchema,
    deletedRefGroupSchema
} from "@schema/api/refGroup-schema"

const routes = express.Router()

routes.get("/", refGroupController.index);

routes.get("/:id", validate(paramRefGroupSchema), refGroupController.show )

routes.post("/", 
            validate(payloadRefGroupSchema), 
            refGroupController.store);

routes.put("/:id", 
            validate(updatedRefGroupSchema), 
            refGroupController.update);

routes.delete("/:id", validate(deletedRefGroupSchema), refGroupController.destroy)

export default routes
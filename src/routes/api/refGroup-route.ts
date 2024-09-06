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

routes.get("/aplikasi-role/:id", validate(paramRefGroupSchema), refGroupController.getRoleByAplikasi)

routes.get("/group-level/:id", validate(paramRefGroupSchema), refGroupController.GroupByLevel)

routes.post("/", 
            validate(payloadRefGroupSchema), 
            refGroupController.store);

routes.put("/:id", 
            validate(updatedRefGroupSchema), 
            refGroupController.update);

routes.delete("/:id", validate(deletedRefGroupSchema), refGroupController.destroy)

routes.get("/group-level-aplikasi/:id/:id2",validate(paramRefGroupSchema), refGroupController.GroupByLevelAplikasi)

export default routes
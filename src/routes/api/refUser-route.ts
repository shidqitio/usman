import express from "express"
import validate from "@schema/validate"
import refUserController from "@controllers/api/refUser-controller"
import {
    payloadUpdateSchema, 
    searchRefUserSchema,
    searchParamsSchema
} from "@schema/api/refUser-schema"
import { uploadImage } from "@middleware/upload";

const routes = express.Router()

routes.put("/:id", uploadImage.single("file"), refUserController.updatePhoto)

routes.get("/", validate(searchRefUserSchema), refUserController.refUser)

routes.get("/:email", validate(searchParamsSchema), refUserController.searchParams)

routes.post("/search-email", refUserController.searchGroupByEmail)



export default routes
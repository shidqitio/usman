import express from "express"
import validate from "@schema/validate"
import refUserController from "@controllers/api/refUser-controller"
import {
    payloadUpdateSchema
} from "@schema/api/refUser-schema"
import { uploadImage } from "@middleware/upload";

const routes = express.Router()

routes.put("/:id", uploadImage.single("file"), refUserController.updatePhoto)

export default routes
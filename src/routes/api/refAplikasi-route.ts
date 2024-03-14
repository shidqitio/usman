import express from "express";
import validate from "@schema/validate";
import refAplikasiController from "@controllers/api/refAplikasi-controller";
import {
    postRefAplikasiSchema, 
    updatedRefAplikasiSchema
} from "@schema/api/refAplikasi-schema"
import { uploadImage } from "@middleware/upload";
const routes = express.Router()

routes.post(
    "/post-aplikasi",
    uploadImage.single("file"),
    validate(postRefAplikasiSchema), 
     refAplikasiController.store
     );

export default routes
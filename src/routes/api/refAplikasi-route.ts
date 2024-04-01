import express from "express";
import validate from "@schema/validate";
import refAplikasiController from "@controllers/api/refAplikasi-controller";
import {
    postRefAplikasiSchema, 
    updatedRefAplikasiSchema,
    getRefAplikasiSchema
} from "@schema/api/refAplikasi-schema"
import { uploadImage } from "@middleware/upload";
const routes = express.Router()

routes.get("/", refAplikasiController.index)

routes.get("/:id", validate(getRefAplikasiSchema) ,refAplikasiController.getByKodeAplikasi)

routes.post(
    "/post-aplikasi",
    
    uploadImage.single("file"),
    validate(postRefAplikasiSchema), 
     refAplikasiController.store
     );

routes.put("/:id", uploadImage.single("file"), validate(updatedRefAplikasiSchema), refAplikasiController.updateAplikasi)

routes.delete("/:id", validate(getRefAplikasiSchema), refAplikasiController.deleteAplikasi)

export default routes
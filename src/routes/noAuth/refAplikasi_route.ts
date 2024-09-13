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


export default routes
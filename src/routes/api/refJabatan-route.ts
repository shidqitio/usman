import express from "express";
import validate from "@schema/validate";
import refJabatanController from "@controllers/api/refJabatan-controller";
import {
    payloadJabatanSchema,
    // parameterSchema
} from "@schema/api/refJabatan-schema"

const routes = express.Router()

routes.get("/get-ppk", refJabatanController.getJabatanPpk)

routes.get("/get-pp-pk/:id", refJabatanController.getPPPK)


export default routes
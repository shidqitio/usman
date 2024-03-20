import express from "express";
import validate from "@schema/validate";
import trxGroupMenuController from "@controllers/api/trxGroupMenu-controller"
import {
    payloadTrxGroupMenuSchema, 
    updatedTrxGroupMenuSchema,
    destroyTrxGroupMenuSchema,
    searchTrxGroupMenuSchema,
    getTrxGroupMenuSchema
} from "@schema/api/trxGroupMenu-schema"
const routes = express.Router()

routes.get("/", validate(searchTrxGroupMenuSchema), trxGroupMenuController.index)
routes.get("/show/:id", validate(getTrxGroupMenuSchema), trxGroupMenuController.show)

routes.post("/", validate(payloadTrxGroupMenuSchema), trxGroupMenuController.store)
routes.put("/:id", validate(updatedTrxGroupMenuSchema), trxGroupMenuController.update)
routes.delete("/:id", validate(destroyTrxGroupMenuSchema), trxGroupMenuController.destroy)

export default routes
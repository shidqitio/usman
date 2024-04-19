import express from "express";
import validate from "@schema/validate";
import trxGroupMenuController from "@controllers/api/trxGroupMenu-controller"
import {
    payloadTrxGroupMenuSchema, 
    updatedTrxGroupMenuSchema,
    destroyTrxGroupMenuSchema,
    searchTrxGroupMenuSchema,
    getTrxGroupMenuSchema,
    getAplikasiByIdSchema,
    aplikasilevelSchema
} from "@schema/api/trxGroupMenu-schema"
const routes = express.Router()

routes.get("/", validate(searchTrxGroupMenuSchema), trxGroupMenuController.index)
routes.get("/show/:id", validate(getTrxGroupMenuSchema), trxGroupMenuController.show)
routes.get("/byaplikasi/:id", validate(getAplikasiByIdSchema), trxGroupMenuController.groupMenuAplikasi)
routes.get("/menu-aplikasilevel/:kode_aplikasi/:kode_level",validate(aplikasilevelSchema), trxGroupMenuController.menuByLevelAplikasi)

routes.post("/", validate(payloadTrxGroupMenuSchema), trxGroupMenuController.store)
routes.put("/:id", validate(updatedTrxGroupMenuSchema), trxGroupMenuController.update)
routes.delete("/:id", trxGroupMenuController.destroy)

export default routes
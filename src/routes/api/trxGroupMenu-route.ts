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
    aplikasilevelSchema,
    urutSchema
} from "@schema/api/trxGroupMenu-schema"
const routes = express.Router()

routes.get("/", validate(searchTrxGroupMenuSchema), trxGroupMenuController.index)
routes.get("/show/:id", validate(getTrxGroupMenuSchema), trxGroupMenuController.show)
routes.get("/byaplikasi/:id", validate(getAplikasiByIdSchema), trxGroupMenuController.groupMenuAplikasi)
routes.get("/menu-aplikasilevel/:kode_aplikasi/:kode_level",validate(aplikasilevelSchema), trxGroupMenuController.menuByLevelAplikasi)
routes.get("/menu-group/:kode_group", trxGroupMenuController.viewMenuByGroup)

routes.post("/", validate(payloadTrxGroupMenuSchema), trxGroupMenuController.store)
routes.put("/:id", validate(updatedTrxGroupMenuSchema), trxGroupMenuController.update)
routes.put("/urut/:kode_menu1/:kode_group",validate(urutSchema),  trxGroupMenuController.updateUrut )
routes.delete("/:id", trxGroupMenuController.destroy)

export default routes
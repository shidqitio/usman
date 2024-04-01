import express from 'express'
import validate from '@schema/validate'
import refMenuController from "@controllers/api/refMenu1-controller"
import {
payloadRefMenu1Schema,
updatedRefMenu1Schema,
destroyRefMenu1Schema,
searchRefMenu1Schema,
getRefMenu1Schema,
} from "@schema/api/refMenu1-schema"
const routes = express.Router()


routes.get("/", validate(searchRefMenu1Schema), refMenuController.index)
routes.get("/show/:id", validate(getRefMenu1Schema), refMenuController.show)

routes.get("/kode-aplikasi/:id", validate(getRefMenu1Schema), refMenuController.getByKodeAPlikasi)

routes.post("/", validate(payloadRefMenu1Schema), refMenuController.store)


routes.put("/:id", validate(updatedRefMenu1Schema), refMenuController.update)

routes.delete("/:id", validate(destroyRefMenu1Schema), refMenuController.destroy)

export default routes
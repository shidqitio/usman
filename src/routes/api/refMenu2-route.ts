import express from 'express'
import validate from '@schema/validate'
import refMenu2Controller from "@controllers/api/refMenu2-controller"
import {
payloadRefMenu2Schema,
updatedRefMenu2Schema,
destroyRefMenu2Schema,
searchRefMenu2Schema,
getRefMenu2Schema,
paramsLevelSchema
} from "@schema/api/refMenu2-schema"
const routes = express.Router()


routes.get("/", validate(searchRefMenu2Schema), refMenu2Controller.index)
routes.get("/show/:id", validate(getRefMenu2Schema), refMenu2Controller.show)

routes.post("/", validate(payloadRefMenu2Schema), refMenu2Controller.store)

routes.get("/get-menu1/:id", validate(getRefMenu2Schema), refMenu2Controller.getByKodeMenu1)

routes.put("/:id", validate(updatedRefMenu2Schema), refMenu2Controller.update)

routes.get("/menu-level2/:id1/:id2", validate(paramsLevelSchema), refMenu2Controller.menuByLevel2)

routes.delete("/:id", validate(destroyRefMenu2Schema), refMenu2Controller.destroy)

export default routes
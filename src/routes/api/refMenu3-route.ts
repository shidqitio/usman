import express from 'express'
import validate from '@schema/validate'
import refMenu3Controller from "@controllers/api/refMenu3-controller"
import {
payloadRefMenu3Schema,
updatedRefMenu3Schema,
destroyRefMenu3Schema,
searchRefMenu3Schema,
getRefMenu3Schema,
paramsLevelSchema
} from "@schema/api/refMenu3-schema"
const routes = express.Router()


routes.get("/", validate(searchRefMenu3Schema), refMenu3Controller.index)
routes.get("/show/:id", validate(getRefMenu3Schema), refMenu3Controller.show)

routes.post("/", validate(payloadRefMenu3Schema), refMenu3Controller.store)

routes.get("/get-menu2/:id", validate(getRefMenu3Schema), refMenu3Controller.getByMenu2);

routes.put("/:id", validate(updatedRefMenu3Schema), refMenu3Controller.update)

routes.delete("/:id", validate(destroyRefMenu3Schema), refMenu3Controller.destroy)

routes.get("/menu-level3/:id1/:id2", validate(paramsLevelSchema), refMenu3Controller.menuByLevel3)

export default routes
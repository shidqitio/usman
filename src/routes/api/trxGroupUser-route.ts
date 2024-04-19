import express from "express"
import validate from "@schema/validate"
import trxGroupUserController from "@controllers/api/trxGroupUser-controller"
import {
    payloadTrxGroupUserSchema,
    updatedTrxGroupUserSchema,
    storesTrxGroupUserSchema,
    destroyTrxGroupUserSchema,
    getTrxGroupUserSchema,
    searchTrxGroupUserSchema, 
    payloadUserRoleSchema

} from "@schema/api/trxGroupUser-schema"

import auth from "@middleware/auth"

const routes = express.Router()

routes.get("/", validate(searchTrxGroupUserSchema), trxGroupUserController.index)
routes.get("/show/:id", validate(getTrxGroupUserSchema), trxGroupUserController.show)

routes.post("/", auth, validate(payloadTrxGroupUserSchema), trxGroupUserController.store)
routes.post("/post-groups", validate(storesTrxGroupUserSchema), trxGroupUserController.storeGroups)
routes.post("/post-role", validate(payloadUserRoleSchema), trxGroupUserController.storePegawaiRole)

routes.get("/user-group/:id", validate(getTrxGroupUserSchema), trxGroupUserController.userByGroup)

routes.delete("/:id", validate(destroyTrxGroupUserSchema), trxGroupUserController.destroy)

export default routes
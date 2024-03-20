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

} from "@schema/api/trxGroupUser-schema"

const routes = express.Router()

routes.get("/", validate(searchTrxGroupUserSchema), trxGroupUserController.index)
routes.get("/show/:id", validate(getTrxGroupUserSchema), trxGroupUserController.show)

routes.post("/", validate(payloadTrxGroupUserSchema), trxGroupUserController.store)
routes.post("/post-groups", validate(storesTrxGroupUserSchema), trxGroupUserController.storeGroups)

routes.get("/user-group/:id", validate(getTrxGroupUserSchema), trxGroupUserController.userByGroup)

export default routes
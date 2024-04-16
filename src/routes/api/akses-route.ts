import express from "express"
import validate from "@schema/validate"
import aksesController from "@controllers/api/akses-controller"
import {
    payloadAksesSchema, 
    payloadCheckTokenAksesSchema,
    payloadUserGroupAksesSchema,
    payloadEmailAksesSchema,
    payloadChangePasswordSchema,
    payloadLogoutSchema
} from "@schema/api/akses-schema"

import auth from "@middleware/auth"

const routes = express.Router()

routes.post("/register", validate(payloadAksesSchema), aksesController.register)
routes.post("/login", validate(payloadAksesSchema), aksesController.login)
routes.post("/aplikasi", validate(payloadEmailAksesSchema), aksesController.getAplikasiByEmail)
routes.post("/post-token", auth, validate(payloadUserGroupAksesSchema), aksesController.postToken)
routes.post("/get-menu", auth, validate(payloadUserGroupAksesSchema), aksesController.getMenuApp)
routes.post("/check-token", auth, validate(payloadUserGroupAksesSchema), aksesController.checkToken)
routes.post("/logout", validate(payloadLogoutSchema), aksesController.logout)
routes.post("/change-password",validate(payloadChangePasswordSchema), aksesController.changePassword)
routes.post("/forget-password", validate(payloadEmailAksesSchema), aksesController.forgetPassword)

export default routes
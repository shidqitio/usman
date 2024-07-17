import express from "express"
import validate from "@schema/validate"
import aksesController from "@controllers/api/akses-controller"
import {
    payloadAksesSchema, 
    payloadCheckTokenAksesSchema,
    payloadUserGroupAksesSchema,
    payloadEmailAksesSchema,
    payloadChangePasswordSchema,
    payloadLogoutSchema, 
    payloadRefreshTokenSchema,
    refreshTokenLandingSchema,
    payloadLoginSchema,
    payloadEmailAplikasiSchema,
    payloadRegisterExternalSchema
} from "@schema/api/akses-schema"

import auth from "@middleware/auth"

import rateLimit from "express-rate-limit"

//Konfigurasi express-rate-limit untuk membatasi percobaan login
const loginLimiter = rateLimit({
  windowMs: 5 * 60 *  1000, // 5 menit
  max: 3, // maksimal 3 percobaan
  message: 'Terlalu banyak percobaan login coba lagi setelah 5 menit'
});

const routes = express.Router()



routes.get("/get-role/:email/:kode_aplikasi", validate(payloadEmailAplikasiSchema), aksesController.roleByAplikasiEmail)

routes.post("/register", validate(payloadAksesSchema), aksesController.register)
routes.post("/register-external", validate(payloadRegisterExternalSchema), aksesController.registerExternal)
routes.post("/login", loginLimiter, validate(payloadLoginSchema), aksesController.login)

routes.post("/aplikasi", validate(payloadEmailAksesSchema), aksesController.getAplikasiByEmail)
routes.post("/post-token", auth, validate(payloadUserGroupAksesSchema), aksesController.postToken)
routes.post("/get-menu", auth, validate(payloadUserGroupAksesSchema), aksesController.getMenuApp)
routes.post("/check-token", auth, validate(payloadUserGroupAksesSchema), aksesController.checkToken)
routes.post("/logout", validate(payloadLogoutSchema), aksesController.logout)
routes.post("/change-password",validate(payloadChangePasswordSchema), aksesController.changePassword)
routes.post("/forget-password", validate(payloadEmailAksesSchema), aksesController.forgetPassword)
routes.post("/refresh-token", validate(payloadRefreshTokenSchema), aksesController.refreshToken)
routes.post("/refresh-token-landing", validate(refreshTokenLandingSchema), aksesController.refreshTokenLanding)

export default routes
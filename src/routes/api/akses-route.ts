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
    payloadRegisterExternalSchema,
    payloadCheckOtpSchema,
    payloadResetPasswordSchema
} from "@schema/api/akses-schema"

import auth from "@middleware/auth"

import rateLimit from "express-rate-limit"

import { httpCode } from "@utils/prefix"

import CustomError from "@middleware/error-handler"

import authCaptcha from "@middleware/auth-captcha"

// const error = new CustomError(httpCode.tooManyRequests, "Anda Melakukan Kesalahan Lebih 3 kali silahkan coba lagi dalam 10 menit")

const error = {
  code : httpCode.tooManyRequests, 
  status : "failed",
  message : "Terlalu Banyak Percobaan Silahkan Coba Lagi 10 Menit"
}

//Konfigurasi express-rate-limit untuk membatasi percobaan login
export const loginLimiter = rateLimit({
  windowMs: 10 * 60 *  1000, // 10 menit
  max: 3, // maksimal 3 percobaan
  message: error,
  keyGenerator : (req) => req.body.email
});

const routes = express.Router()



routes.get("/get-role/:email/:kode_aplikasi", validate(payloadEmailAplikasiSchema), aksesController.roleByAplikasiEmail)

routes.post("/register", validate(payloadAksesSchema), aksesController.register)
routes.post("/register-eksternal", validate(payloadRegisterExternalSchema), aksesController.registerExternal)
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

//CHECK OTP
routes.post("/check-otp", validate(payloadCheckOtpSchema), aksesController.checkOtp)
routes.post("/reset-password", validate(payloadResetPasswordSchema), aksesController.resetPassword)

export default routes
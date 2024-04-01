import { httpCode } from "@utils/prefix";
import { Request, Response, NextFunction } from "express";
import { responseSuccess } from "@utils/response-success";
import { debugLogger, errorLogger } from "@config/logger";
import {
    PayloadAksesSchema,
    PayloadCheckToken,
    PayloadUserGroupSchema,
    PayloadEmailAksesSchema
} from "@schema/api/akses-schema"

import aksesService from "@services/api/v1/aksesSippp-api"

const register = async (
    req:Request, 
    res:Response, 
    next:NextFunction) : Promise<void> => {
    try {
        const require : PayloadAksesSchema["body"] = req.body
        
        const response = await aksesService.register(require)

        responseSuccess(res, httpCode.ok, response)


    } catch (error) {
        errorLogger.error(`testing error register ${error}`);
        next(error);
    }
}

const login = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const require : PayloadAksesSchema["body"] = req.body

        const response = await aksesService.login(require)

        responseSuccess(res, httpCode.ok, response)
    } catch (error) {
        errorLogger.error(`testing error login ${error}`);
        next(error);
    }
}

const getAplikasiByEmail = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const email : PayloadEmailAksesSchema["body"] = req.body

        const response = await aksesService.getAplikasiByEmail(email)

        responseSuccess(res, httpCode.ok, response)
    } catch (error : any) {
        next(error)
    }
}

const postToken = async (
    req:Request, 
    res:Response,
    next:NextFunction
) : Promise<void> => {
    try {
        const require : PayloadUserGroupSchema["body"] = req.body
        const token = String(req.user.token)

        console.log("REQ USER TOKEN : ", token)

        const response = await aksesService.postToken(require, token)

        responseSuccess(res, httpCode.ok, response)
    } catch (error) {
        errorLogger.error(`testing error PostToken ${error}`);
        next(error);
    }
}

const getMenuApp = async (
    req:Request,
    res:Response, 
    next:NextFunction) : Promise<void> => {
        try {
            const require : PayloadUserGroupSchema["body"] = req.body
            const token_old : string = req.user.token
        
            const response = await aksesService.getMenuApp(require, token_old)
            
            responseSuccess(res, httpCode.ok, response)
        } catch (error) {
            errorLogger.error(`testing error PostToken ${error}`);
            next(error);
        }
}

const checkToken = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const require : PayloadCheckToken["body"] = req.body

        const response = await aksesService.checkToken(require)

        responseSuccess(res, httpCode.ok, response)
    } catch (error) {
        errorLogger.error(`testing error CheckTOken ${error}`);
        next(error);
    }
}

const logout = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const require : PayloadCheckToken["body"] = req.body

        const response = await aksesService.logout(require)

        responseSuccess(res, httpCode.ok, response)
    } catch (error) {
        errorLogger.error(`testing error Logout ${error}`);
        next(error);
    }
}

export default {
    register,
    login,
    postToken,
    getMenuApp,
    getAplikasiByEmail,
    checkToken,
    logout,
}
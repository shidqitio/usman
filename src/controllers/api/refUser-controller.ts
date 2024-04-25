import { Request, Response, NextFunction } from "express";
import refUserService from "@services/api/v1/refUser-api"
import { errorLogger, debugLogger } from "@config/logger";
import { RefUserOutput } from "@models/refUser-model";
import {
    PayloadUpdateSchema,
    SearchRefUserSchema,
    SearchParamsSchema
} from "@schema/api/refUser-schema"
import { responseSuccess, responseSuccessCount } from "@utils/response-success";
import { httpCode } from "@utils/prefix";

const updatePhoto = async (
    req:Request, 
    res:Response, 
    next:NextFunction) => {
    try {
        const id_user : PayloadUpdateSchema["parameter"]["id"] = parseInt(req.params.id)

        const response : RefUserOutput | null = await refUserService.updateUserPhoto(id_user, req.file) 

        responseSuccess(res, httpCode.ok, response)
    } catch (error : any) {
        next(error)
    }
}

const refUser = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const page: SearchRefUserSchema["query"]["page"] = req.query.page as string
        const limit : SearchRefUserSchema["query"]["limit"] = req.query.limit as string

        const response : RefUserOutput[] = await refUserService.refUser(page, limit)
        const count : number = await refUserService.countRefUser()

        responseSuccessCount(res, httpCode.ok, count, response)
    } catch (error) {
        next(error)
    }
}

const searchParams = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void>=> {
    try {
        const email : SearchParamsSchema["params"]["email"] = req.params.email

        const response : RefUserOutput = await refUserService.searchParams(email)

        responseSuccess(res, httpCode.ok, response)
    } catch (error) {
        next(error)
    }
}

const searchGroupByEmail = async (
    req : Request,
    res : Response, 
    next : NextFunction) : Promise<void> => {
    try {
        const email  = req.body.email

        const response = await refUserService.searchGroupByEmail(email)

        responseSuccess(res, httpCode.ok, response)
    } catch (error) {
        errorLogger.error(`testing error Search By Email ${error}`);
        next(error)
    }
}
export default {
    updatePhoto,
    refUser,
    searchParams,
    searchGroupByEmail
}
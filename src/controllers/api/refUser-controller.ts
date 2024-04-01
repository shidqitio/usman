import { Request, Response, NextFunction } from "express";
import refUserService from "@services/api/v1/refUser-api"
import { errorLogger, debugLogger } from "@config/logger";
import { RefUserOutput } from "@models/refUser-model";
import {
    PayloadUpdateSchema
} from "@schema/api/refUser-schema"
import { responseSuccess } from "@utils/response-success";
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

export default {
    updatePhoto
}
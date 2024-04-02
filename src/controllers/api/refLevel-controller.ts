import { httpCode } from "@utils/prefix";
import { RefLevelInput } from "@models/refLevel-model";
import refLevelService from "@services/api/v1/refLevel-api"
import { Request, Response, NextFunction } from "express";
import { responseSuccess } from "@utils/response-success";
import { debugLogger, errorLogger } from "@config/logger";
import { getSocketIO } from "@config/socket";

const index = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
        try {
            
            const response : RefLevelInput[] = await refLevelService.index()
    
            responseSuccess(res, httpCode.ok, response)
        } catch (error) {
            next(error)
        }
}

export default {
    index
}
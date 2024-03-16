import { httpCode } from "@utils/prefix";
import { RefGroupInput, RefGroupOutput } from "@models/refGroup-model";
import refGroupService from "@services/api/v1/refGroup-api"
import { Request, Response, NextFunction } from "express";
import { responseSuccess } from "@utils/response-success";
import {
    PayloadRefGroupSchema
} from "@schema/api/refGroup-schema"
import { errorLogger } from "@config/logger";
import { getSocketIO } from "@config/socket";

const index = async (
    req : Request, 
    res : Response, 
    next : NextFunction
) : Promise<void> => {
    try {
        const ioInstance = getSocketIO()

        const response : RefGroupOutput[] = await refGroupService.index()

        if(ioInstance) {
            ioInstance.emit("group", response)
            responseSuccess(res, httpCode.ok, response)
        }
        else {
            res.status(500).send("Socket.IO not initialized");
          }
        // responseSuccess(res, httpCode.ok, response)
    } catch (error : any) {
        errorLogger.error(`testing error debugger ${error}`);
        console.log(error)
        next(error);
    }
}

const store = async (
    req:Request,
    res:Response, 
    next:NextFunction) : Promise<void> => {
    try {
        const request : PayloadRefGroupSchema["body"] = req.body

        const response : RefGroupOutput = await refGroupService.store(request)

        responseSuccess(res, httpCode.ok, response)
    } catch (error : any) {
        errorLogger.error(`testing error store ${error}`)
        next(error)
    }
}

export default {
    index, 
    store
}
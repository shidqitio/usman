import { httpCode } from "@utils/prefix";
import { RefGroupInput, RefGroupOutput } from "@models/refGroup-model";
import refGroupService from "@services/api/v1/refGroup-api"
import { Request, Response, NextFunction } from "express";
import { responseSuccess } from "@utils/response-success";
import {
    PayloadRefGroupSchema,
    UpdatedRefGroupSchema, 
    ParamRefGroupSchema,
    DeletedRefGroupSchema
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

const show = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_group : ParamRefGroupSchema["params"]["id"] = req.params.id

        const response : RefGroupOutput = await refGroupService.show(kode_group)

        responseSuccess(res, httpCode.ok, response)
    } catch (error) {
        errorLogger.error(`testing error Show ${error}`)
        next(error)
    }
}

const getRoleByAplikasi = async (
    req:Request,
    res:Response, 
    next:NextFunction) : Promise<void> => {
    try {
        const kode_aplikasi : ParamRefGroupSchema["params"]["id"] = req.params.id

        const refGroup : RefGroupOutput[] = await refGroupService.getRoleByAplikasi(kode_aplikasi)

        responseSuccess(res, httpCode.ok, refGroup)
    } catch (error) {
        errorLogger.error(`testing error RoleByAplikasi ${error}`)
        next(error)
    }
}

const update = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const request : UpdatedRefGroupSchema["body"] = req.body
        const kode_group : UpdatedRefGroupSchema["params"]["id"] = req.params.id


        const response : RefGroupOutput = await refGroupService.update(kode_group, request)

        responseSuccess(res, httpCode.ok, response)
    } catch (error) {
        errorLogger.error(`testing error update ${error}`)
        next(error)
    }
}



const destroy = async (
    req:Request, 
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_group : DeletedRefGroupSchema["params"]["id"] = req.params.id

        const response = await refGroupService.destroy(kode_group)

        responseSuccess(res, httpCode.ok, response)
    } catch (error : any) {
        errorLogger.error(`testing error destroy ${error}`)
        next(error)
    }
}

const GroupByLevel = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_level : ParamRefGroupSchema["params"]["id"] = req.params.id
        
        const response : RefGroupOutput[] = await refGroupService.GroupByLevel(kode_level)

        responseSuccess(res, httpCode.ok, response)
    } catch (error) {
        errorLogger.error(`testing error GroupByLevel ${error}`)
        next(error)
    }
}

export default {
    index, 
    store,
    show,
    update,
    destroy,
    getRoleByAplikasi,
    GroupByLevel
}
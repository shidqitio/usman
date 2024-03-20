import { httpCode } from "@utils/prefix";
import { RefMenu1Output } from "@models/refMenu1-model";
import refMenu1Service from "@services/api/v1/refMenu1-api"
import { Request, Response, NextFunction } from "express";
import {
    PayloadRefMenu1Schema, 
    UpdatedRefMenu1Schema, 
    SearchRefMenu1Schema,
    GetRefMenu1Schema,
    DestroyRefMenu1Schema
} from "@schema/api/refMenu1-schema"
import { getSocketIO } from "@config/socket";
import { responseSuccess } from "@utils/response-success";
import { debugLogger, errorLogger } from "@config/logger";

const index = async (
    req:Request, 
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const ioInstance = getSocketIO()

        const page: SearchRefMenu1Schema["query"]["page"] = req.query.page as string
        const limit : SearchRefMenu1Schema["query"]["limit"] = req.query.limit as string

        const response: RefMenu1Output[] = await refMenu1Service.index(page, limit)
        // console.log("TESS");
        // responseSuccess(res, httpCode.ok, response)
        if(ioInstance) {
            ioInstance.emit("refMenu1", response)
            responseSuccess(res, httpCode.ok, response)
        } else {
            res.status(500).send("Socket.IO not initialized");
        }
    } catch (error) {
        errorLogger.error(`testing error index ${error}`);
        next(error);
    }
}

const store = async (
    req:Request, 
    res:Response,
    next:NextFunction) : Promise<void> => {
        try {
            const request : PayloadRefMenu1Schema["body"] = await req.body

            const response : RefMenu1Output = await refMenu1Service.store(request)

            responseSuccess(res, httpCode.ok, response)
        } catch (error) {
            errorLogger.error(`testing error store ${error}`);
            next(error);
        }
}

const show = async (
    req:Request, 
    res:Response,
    next:NextFunction) : Promise<void> => {
        try {
            const kode_menu1 : GetRefMenu1Schema["params"]["id"] = req.params.id 

            const response = await refMenu1Service.show(kode_menu1)

            responseSuccess(res, httpCode.ok, response)
        } catch (error) {
            errorLogger.error(`testing error show ${error}`);
            next(error);
        }
}

const update = async (
    req:Request, 
    res:Response,
    next:NextFunction) : Promise<void> => {
        try {
            const kode_menu1 : UpdatedRefMenu1Schema["params"]["id"] = req.params.id
            const request : UpdatedRefMenu1Schema["body"] = req.body

            const response : RefMenu1Output = await refMenu1Service.update(request, kode_menu1)
            
            responseSuccess(res, httpCode.ok, response)

        } catch (error) {
            errorLogger.error(`testing error update ${error}`);
            next(error);
        }
}

const destroy = async (
    req:Request, 
    res:Response,
    next:NextFunction) : Promise<void> => {
        try {
            const kode_menu1 : DestroyRefMenu1Schema["params"]["id"] = req.params.id

            const destroyMenu = await refMenu1Service.destroy(kode_menu1)

            responseSuccess(res, httpCode.ok, destroyMenu)
        } catch (error) {
            errorLogger.error(`testing error destroy ${error}`);
            next(error);
        }        
}

export default {
    index,
    store,
    show,
    update,
    destroy
}
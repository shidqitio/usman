import { httpCode } from "@utils/prefix";
import { RefMenu2Output } from "@models/refMenu2-model";
import refMenu2Service from "@services/api/v1/refMenu2-api"

import { Request, Response, NextFunction } from "express";

import {
    PayloadRefMenu2Schema, 
    UpdatedRefMenu2Schema, 
    SearchRefMenu2Schema,
    GetRefMenu2Schema,
    DestroyRefMenu2Schema
} from "@schema/api/refMenu2-schema"

import { getSocketIO } from "@config/socket";
import { responseSuccess, responseSuccessCount } from "@utils/response-success";
import { debugLogger, errorLogger } from "@config/logger";

const index = async (
    req : Request,
    res : Response, 
    next : NextFunction) => {
    try {
        const ioInstance = getSocketIO()

        const page: SearchRefMenu2Schema["query"]["page"] = req.query.page as string
        const limit : SearchRefMenu2Schema["query"]["limit"] = req.query.limit as string

        const response: RefMenu2Output[] = await refMenu2Service.index(page, limit)
        const count : number = await refMenu2Service.countMenu2()

        if(ioInstance) {
            ioInstance.emit("refMenu2", response)
            responseSuccessCount(res, httpCode.ok,count, response)
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
            const request : PayloadRefMenu2Schema["body"] = await req.body

            const response : RefMenu2Output = await refMenu2Service.store(request, req.user ? req.user.username : "unknown")

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
            const kode_menu2 : GetRefMenu2Schema["params"]["id"] = req.params.id 

            const response = await refMenu2Service.show(kode_menu2)

            responseSuccess(res, httpCode.ok, response)
        } catch (error) {
            errorLogger.error(`testing error show ${error}`);
            next(error);
        }
}

const getByKodeMenu1 = async (
    req:Request,
    res:Response,
    next:NextFunction) => {
    try {
        const id : GetRefMenu2Schema["params"]["id"] = req.params.id

        const response = await refMenu2Service.getByKodeMenu1(id)

        responseSuccess(res, httpCode.ok, response)
    } catch (error) {
        errorLogger.error(`testing error Get Kode Menu ${error}`);
        next(error);
    }
}

const update = async (
    req:Request, 
    res:Response,
    next:NextFunction) : Promise<void> => {
        try {
            const kode_menu2 : UpdatedRefMenu2Schema["params"]["id"] = req.params.id
            const request : UpdatedRefMenu2Schema["body"] = req.body

            const response : RefMenu2Output = await refMenu2Service.update(request, kode_menu2, req.user ? req.user.username : "unknown")
            
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
            const kode_menu2 : DestroyRefMenu2Schema["params"]["id"] = req.params.id

            const destroyMenu = await refMenu2Service.destroy(kode_menu2)

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
    getByKodeMenu1,
    destroy
}
import { httpCode } from "@utils/prefix";
import { RefMenu3Output } from "@models/refMenu3-model";
import refMenu3Service from "@services/api/v1/refMenu3-api"

import { Request, Response, NextFunction } from "express";

import {
    PayloadRefMenu3Schema, 
    UpdatedRefMenu3Schema, 
    SearchRefMenu3Schema,
    GetRefMenu3Schema,
    DestroyRefMenu3Schema,
    ParamsLevelSchema
} from "@schema/api/refMenu3-schema"

import { getSocketIO } from "@config/socket";
import { responseSuccess, responseSuccessCount } from "@utils/response-success";
import { debugLogger, errorLogger } from "@config/logger";

const index = async (
    req : Request,
    res : Response, 
    next : NextFunction) : Promise<void> => {
    try {
        const ioInstance = getSocketIO()

        const page: SearchRefMenu3Schema["query"]["page"] = req.query.page as string
        const limit : SearchRefMenu3Schema["query"]["limit"] = req.query.limit as string

        const response: RefMenu3Output[] = await refMenu3Service.index(page, limit)
        const count : number = await refMenu3Service.countMenu3()

        const metadata = {
            page : parseInt(page),
            limit : parseInt(limit),
            count : count
        }


        if(ioInstance) {
            ioInstance.emit("refMenu2", response)
            responseSuccessCount(res, httpCode.ok,response, metadata)
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
            const request : PayloadRefMenu3Schema["body"] = await req.body

            const response : RefMenu3Output = await refMenu3Service.store(request, req.user ? req.user.username : "unknown")

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
            const kode_menu3 : GetRefMenu3Schema["params"]["id"] = req.params.id 

            const response = await refMenu3Service.show(kode_menu3)

            responseSuccess(res, httpCode.ok, response)
        } catch (error) {
            errorLogger.error(`testing error show ${error}`);
            next(error);
        }
}

const getByMenu2 = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_menu3 : GetRefMenu3Schema["params"]["id"] = req.params.id
        
        const response = await refMenu3Service.getByMenu2(kode_menu3)

        responseSuccess(res, httpCode.ok, response)
    } catch (error) {
        errorLogger.error(`testing error GetByMenu2 ${error}`);
        next(error);
    }
}

const update = async (
    req:Request, 
    res:Response,
    next:NextFunction) : Promise<void> => {
        try {
            const kode_menu3 : UpdatedRefMenu3Schema["params"]["id"] = req.params.id
            const request : UpdatedRefMenu3Schema["body"] = req.body

            const response : RefMenu3Output = await refMenu3Service.update(request, kode_menu3, req.user ? req.user.username : "unknown")
            
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
            const kode_menu3 : DestroyRefMenu3Schema["params"]["id"] = req.params.id

            const destroyMenu = await refMenu3Service.destroy(kode_menu3)

            responseSuccess(res, httpCode.ok, destroyMenu)
        } catch (error) {
            errorLogger.error(`testing error destroy ${error}`);
            next(error);
        }        
}

const menuByLevel3 = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const level : ParamsLevelSchema["params"]["id1"] = req.params.id1

        const menu3 : ParamsLevelSchema["params"]["id2"] = req.params.id2

        const response = await refMenu3Service.menuByLevel3(level, menu3)

        responseSuccess(res, httpCode.ok, response)
    } catch (error) {
        errorLogger.error(`testing error Menu By Level ${error}`);
        next(error);
    }
}

export default {
    index,
    store,
    show,
    update,
    getByMenu2,
    destroy,
    menuByLevel3
}
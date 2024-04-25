import { httpCode } from "@utils/prefix";
import TrxGroupMenu, { TrxGroupMenuOutput } from "@models/trxGroupMenu-model";
import trxGroupMenuService from "@services/api/v1/trxGroupMenu-api"

import { Request, Response, NextFunction } from "express";

import {
    PayloadTrxGroupMenuSchema,
    UpdatedTrxGroupMenuSchema,
    SearchTrxGroupMenuSchema,
    GetTrxGroupMenuSchema,
    DestroyTrxGroupMenuSchema,
    GetAplikasiByIdSchema,
    AplikasiLevelSchema
} from "@schema/api/trxGroupMenu-schema"

import { getSocketIO } from "@config/socket";
import { responseSuccess, responseSuccessCount } from "@utils/response-success";
import { debugLogger, errorLogger } from "@config/logger";

const index = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const ioInstance = getSocketIO()

        const page: SearchTrxGroupMenuSchema["query"]["page"] = req.query.page as string
        const limit : SearchTrxGroupMenuSchema["query"]["limit"] = req.query.limit as string

        const response : TrxGroupMenuOutput[] = await trxGroupMenuService.index(page, limit)
        const count : number = await trxGroupMenuService.countTrxGroupMenu()
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
        const request : PayloadTrxGroupMenuSchema["body"] = req.body

        const response : TrxGroupMenuOutput = await trxGroupMenuService.store(request)
        responseSuccess(res, httpCode.ok, response)
    } catch (error) {
        errorLogger.error(`testing error store ${error}`);
        next(error);
    }
}

const show = async (
    req:Request, 
    res:Response, 
    next : NextFunction) : Promise<void> => {
    try {
        const kode_group_menu : GetTrxGroupMenuSchema["params"]["id"] = parseInt(req.params.id) 
        const response : TrxGroupMenuOutput = await trxGroupMenuService.show(kode_group_menu)
        
        responseSuccess(res, httpCode.ok, response)
    } catch (error) {
        errorLogger.error(`testing error show ${error}`);
        next(error);
    }
}


const update = async (
    req : Request, 
    res : Response, 
    next : NextFunction
) : Promise <void> => {
    try {
        const kode_group_menu : UpdatedTrxGroupMenuSchema["params"]["id"] = parseInt(req.params.id)
        const request : UpdatedTrxGroupMenuSchema["body"] = req.body

        const response : TrxGroupMenuOutput = await trxGroupMenuService.update(request, kode_group_menu)

        responseSuccess(res, httpCode.ok, response)
    } catch (error) {
        errorLogger.error(`testing error show ${error}`);
        next(error);
    }
}

const groupMenuAplikasi = async (
    req : Request, 
    res : Response, 
    next : NextFunction) : Promise <void> => {
    try {
        const kode_aplikasi : GetAplikasiByIdSchema["params"]["id"] = req.params.id

        const response = await trxGroupMenuService.groupMenuAplikasi(kode_aplikasi)

        responseSuccess(res, httpCode.ok, response)
    } catch (error) {
        errorLogger.error(`testing error show Aplikasi ${error}`);
        next(error);
    }
}

const menuByLevelAplikasi = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        
        const kode_aplikasi : AplikasiLevelSchema["params"]["kode_aplikasi"] = req.params.kode_aplikasi
        const kode_level : AplikasiLevelSchema["params"]["kode_level"] = req.params.kode_level

        
        const response = await trxGroupMenuService.menuByLevelAplikasi(kode_aplikasi, kode_level)

        responseSuccess(res, httpCode.ok, response)
    } catch (error) {
        errorLogger.error(`testing error show Menu By Aplikasi Level ${error}`);
        next(error);
    }
}


const destroy = async (
    req:Request, 
    res:Response,
    next:NextFunction) : Promise<void> => {
        try {
            const kode_group_menu : DestroyTrxGroupMenuSchema["params"]["id"] = parseInt(req.params.id)

            console.log(kode_group_menu);
            

            const destroyMenu = await trxGroupMenuService.destroy(kode_group_menu)

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
    destroy,
    groupMenuAplikasi,
    menuByLevelAplikasi
}
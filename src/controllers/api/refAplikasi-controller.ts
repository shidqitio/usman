import { httpCode } from "@utils/prefix";
import { RefAplikasiInput, RefAplikasiOutput } from "@models/refAplikasi-model";
import refAplikasiService from "@services/api/v1/refAplikasi-api"
import { Request, Response, NextFunction } from "express";
import { responseSuccess } from "@utils/response-success";
import { debugLogger, errorLogger } from "@config/logger";
import {
    PostRefAplikasiSchema, 
    UpdatedRefAplikasiSchema, 
    GetRefAplikasiSchema
} from "@schema/api/refAplikasi-schema"
import { getSocketIO } from "@config/socket";

const index = async (
    req : Request, 
    res :  Response,
    next : NextFunction
) : Promise<void>  => {
    try {
        const ioInstance = getSocketIO()
        
        const response : RefAplikasiOutput[] = await refAplikasiService.index()

        if(ioInstance) {
            ioInstance.emit("aplikasi", response)
            responseSuccess(res, httpCode.ok, response)
        }
        else { 
            res.status(500).send("Socket.IO not Initialized")
        }
    } catch (error) {
        next(error)
    }
}

const store = async (
    req:Request, 
    res:Response, 
    next:NextFunction) => {
    try {
        const request : PostRefAplikasiSchema["body"] = req.body
        // const tes : string = req.body.nama_aplikasi

        // console.log("TES REQUEST  ",request)
        
        // console.log("TES REQ.FILE :", req.file)
        const response : RefAplikasiOutput = await refAplikasiService.store(
            request,
            req.file
        )

        // console.log(response)

        responseSuccess(res, httpCode.ok, response)

    } catch (error) {
        errorLogger.error(`testing error store ${error}`)
        next(error)
    }
}

const getByKodeAplikasi = async (
    req:Request,
    res:Response, 
    next:NextFunction) : Promise<void> => {
    try {
        const kode_aplikasi : GetRefAplikasiSchema["params"]["id"]= req.params.id

        const response : RefAplikasiOutput = await refAplikasiService.getByKodeAPlikasi(kode_aplikasi)

        responseSuccess(res, httpCode.ok, response)

    } catch (error) {
        next(error)
    }
} 

const updateAplikasi = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const request : UpdatedRefAplikasiSchema["body"] = req.body

        const kode_aplikasi : UpdatedRefAplikasiSchema["params"]["id"] = req.params.id

        const response : RefAplikasiOutput = await refAplikasiService.updateAplikasi(kode_aplikasi, request, req.file)

        responseSuccess(res, httpCode.ok, response)
    } catch (error) {
        next(error)
    }
}


export default {
    store,
    index,
    getByKodeAplikasi,
    updateAplikasi
}
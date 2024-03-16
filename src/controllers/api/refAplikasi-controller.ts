import { httpCode } from "@utils/prefix";
import { RefAplikasiInput, RefAplikasiOutput } from "@models/refAplikasi-model";
import refAplikasiService from "@services/api/v1/refAplikasi-api"
import { Request, Response, NextFunction } from "express";
import { responseSuccess } from "@utils/response-success";
import { debugLogger, errorLogger } from "@config/logger";
import {
    PostRefAplikasiSchema, 
    UpdatedRefAplikasiSchema
} from "@schema/api/refAplikasi-schema"



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

export default {
    store
}
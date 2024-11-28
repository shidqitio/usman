import { httpCode } from "@utils/prefix";
import { RefAplikasiInput, RefAplikasiOutput } from "@models/refAplikasi-model";
import refAplikasiService from "@services/api/v1/refAplikasi-api"
import { Request, Response, NextFunction } from "express";
import { responseSuccess, responseSuccessCount } from "@utils/response-success";
import { debugLogger, errorLogger } from "@config/logger";
import {
    PostRefAplikasiSchema,
    UpdatedRefAplikasiSchema,
    GetRefAplikasiSchema
} from "@schema/api/refAplikasi-schema"
import { getSocketIO } from "@config/socket";

const index = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const ioInstance = getSocketIO()

        const response: RefAplikasiOutput[] = await refAplikasiService.index()
        const count: number = await refAplikasiService.countRefAplikasi()

        const metadata = {
            page: "",
            limit: "",
            count: count
        }

        if (ioInstance) {
            ioInstance.emit("aplikasi", response)
            responseSuccessCount(res, httpCode.ok, response, metadata)
        }
        else {
            res.status(500).send("Socket.IO not Initialized")
        }
    } catch (error) {
        next(error)
    }
}

const getAplikasiByNamaAplikasi = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const response = await refAplikasiService.getAplikasiByNamaAplikasi(req.params.nama_aplikasi)

        const metadata = {
            page: 1,
            limit: 1,
            count: response.count
        }

        responseSuccessCount(res, httpCode.ok, response.rows, metadata)
    } catch (error) {
        next(error)
    }
}

const store = async (
    req: Request,
    res: Response,
    next: NextFunction) => {
    try {
        const request: PostRefAplikasiSchema["body"] = req.body
        // const tes : string = req.body.nama_aplikasi

        // console.log("TES REQUEST  ",request)

        // console.log("TES REQ.FILE :", req.file)
        const response: RefAplikasiOutput = await refAplikasiService.store(
            request,
            req.file,
            req.user ? req.user.username : "unknown"
        )

        // console.log(response)

        responseSuccess(res, httpCode.ok, response)

    } catch (error) {
        errorLogger.error(`testing error store ${error}`)
        next(error)
    }
}

const getByKodeAplikasi = async (
    req: Request,
    res: Response,
    next: NextFunction): Promise<void> => {
    try {
        const kode_aplikasi: GetRefAplikasiSchema["params"]["id"] = req.params.id

        const response: RefAplikasiOutput = await refAplikasiService.getByKodeAPlikasi(kode_aplikasi)

        responseSuccess(res, httpCode.ok, response)

    } catch (error) {
        next(error)
    }
}

const updateAplikasi = async (
    req: Request,
    res: Response,
    next: NextFunction): Promise<void> => {
    try {
        const request: UpdatedRefAplikasiSchema["body"] = req.body

        const kode_aplikasi: UpdatedRefAplikasiSchema["params"]["id"] = req.params.id



        const response: RefAplikasiOutput = await refAplikasiService.updateAplikasi(kode_aplikasi, request, req.file, req.user ? req.user.username : "unknown")

        responseSuccess(res, httpCode.ok, response)
    } catch (error) {
        next(error)
    }
}

const deleteAplikasi = async (
    req: Request,
    res: Response,
    next: NextFunction): Promise<void> => {
    try {
        const kode_aplikasi: GetRefAplikasiSchema["params"]["id"] = req.params.id

        const response: RefAplikasiOutput = await refAplikasiService.deleteAplikasi(kode_aplikasi)

        responseSuccess(res, httpCode.ok, response)
    } catch (error: any) {
        next(error)
    }
}

const updateMetodePengadaan = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id = req.params.id

        const kode_metode_pengadaan = req.body.kode_metode_pengadaan

        const response = await refAplikasiService.updateMetodePengadaan(id, kode_metode_pengadaan)

        responseSuccess(res, httpCode.ok, "Berhasil Update Metode Pengadaan")
    } catch (error) {
        next(error)
    }
}

export default {
    store,
    index,
    getByKodeAplikasi,
    updateAplikasi,
    deleteAplikasi,
    getAplikasiByNamaAplikasi,
    updateMetodePengadaan
}
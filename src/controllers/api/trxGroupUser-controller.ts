import { Request, Response, NextFunction } from "express";
import { httpCode } from "@utils/prefix";
import TrxGroupUser, { TrxGroupUserOutput } from "@models/trxGroupUser-model";
import trxGroupUserService from "@services/api/v1/trxGroupUser-api"
import {
    GetTrxGroupUserSchema,
    StoresTrxGroupsUserSchema,
    SearchTrxGroupUserSchema,
    PayloadTrxGroupUserSchema,
    DestroyTrxGroupUserSchema,
    PayloadUserRoleSchema

} from "@schema/api/trxGroupUser-schema"

import { getSocketIO } from "@config/socket";
import { responseSuccess } from "@utils/response-success";
import { debugLogger, errorLogger } from "@config/logger";

const index = async (
    req:Request, 
    res:Response, 
    next:NextFunction) : Promise <void> => {
    try {
        const ioInstance = getSocketIO()

        const page : SearchTrxGroupUserSchema["query"]["page"] = req.query.page as string
        const limit : SearchTrxGroupUserSchema["query"]["limit"] = req.query.limit as string

        const response : TrxGroupUserOutput[] = await trxGroupUserService.index(limit, page)

        if(ioInstance) {
            ioInstance.emit("refMenu2", response)
            responseSuccess(res, httpCode.ok, response)
        } else {
            res.status(500).send("Socket.IO not initialized");
        }
        
    } catch (error : any) {
        errorLogger.error(`testing error index ${error}`);
        next(error);
    }
}

const store = async (
    req:Request, 
    res:Response, 
    next:NextFunction) : Promise<void> => {
    try {
        const request : PayloadTrxGroupUserSchema["body"] = req.body
        const token : string = String(req.user.token)

        const response : TrxGroupUserOutput = await trxGroupUserService.store(request, token)

        responseSuccess(res, httpCode.ok, response)
    } catch (error : any) {
        errorLogger.error(`testing error store ${error}`);
        next(error);
    }
}

const storePegawaiRole = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const request : PayloadUserRoleSchema["body"] = req.body

        const response : TrxGroupUserOutput = await trxGroupUserService.storePegawaiRole(request)

        responseSuccess(res, httpCode.ok, response)
    } catch (error) {
        errorLogger.error(`testing error User Role ${error}`);
        next(error);
    }
}

const show = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_group_user : GetTrxGroupUserSchema["params"]["id"] = req.params.id

        const response : TrxGroupUserOutput = await trxGroupUserService.show(kode_group_user)

        responseSuccess(res, httpCode.ok, response)
    } catch (error) {
        errorLogger.error(`testing error show ${error}`);
        next(error);
    }
}

const storeGroups  = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const request : StoresTrxGroupsUserSchema["body"] = req.body

        const response : any = await trxGroupUserService.storeGroups(request)

        responseSuccess(res, httpCode.ok, response)
    } catch (error) {
        errorLogger.error(`testing error StoreGroups ${error}`);
        next(error);
    }
}

const userByGroup = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const kode_group : GetTrxGroupUserSchema["params"]["id"] = req.params.id

        const response : any = await trxGroupUserService.userByGroup(kode_group)

        responseSuccess(res, httpCode.ok, response)
    } catch (error) {
        errorLogger.error(`testing error userByGroup ${error}`);
        next(error);
    }
}

const destroy = async (
    req:Request,
    res:Response,
    next:NextFunction) : Promise<void> => {
    try {
        const id_user : DestroyTrxGroupUserSchema["params"]["id"] = req.params.id

        console.log(id_user)

        const response = await trxGroupUserService.destroy(id_user)

        responseSuccess(res, httpCode.ok, response)
    } catch (error) {
        next(error)
    }
}

export default {
    index,
    store,
    show,
    storeGroups,
    userByGroup,
    destroy,
    storePegawaiRole
}
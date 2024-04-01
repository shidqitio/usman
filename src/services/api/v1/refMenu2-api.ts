import RefMenu1 from "@models/refMenu1-model";
import RefMenu2, {RefMenu2Input, RefMenu2Output} from "@models/refMenu2-model";
import CustomError from "@middleware/error-handler";
import { httpCode } from "@utils/prefix";
import {
    PayloadRefMenu2Schema,
    UpdatedRefMenu2Schema,
    SearchRefMenu2Schema,
    GetRefMenu2Schema,
    DestroyRefMenu2Schema
} from "@schema/api/refMenu2-schema"

const index = async (
    page:SearchRefMenu2Schema["query"]["page"],
    limit:SearchRefMenu2Schema["query"]["limit"]) : Promise<RefMenu2Output[]> => {
    try {
        let pages: number = parseInt(page);
        let limits: number = parseInt(limit);
        let offset = 0;
    
        if (pages > 1) {
          offset = (pages - 1) * limits;
        }
    
        const refMenu2 : RefMenu2[] = await RefMenu2.findAll({
            attributes : {exclude : ["ucr", "udcr", "uch", "udch"]},
            limit : limits, 
            offset : offset
        })

        return refMenu2
    } catch (error : any) {
        if(error instanceof CustomError) {
            throw new CustomError(error.code, error.message)
        } 
        else {
            throw new CustomError(500, "Internal server error.")
        }
    }
}

const store = async (
    require:PayloadRefMenu2Schema["body"]) : Promise<RefMenu2Output> => { 
    try {
        const kode_aplikasi : string = require.kode_aplikasi
        const kodeMenu1 : string = require.kode_menu1
        
        const cekMenu1 : RefMenu1 | null = await RefMenu1.findOne({
            where : {
                kode_aplikasi : kode_aplikasi,
                kode_menu1 : kodeMenu1
            }
        })

        if(!cekMenu1) throw new CustomError(httpCode.unprocessableEntity, "Menu 1 Tidak Ada")

        const kodeMenu2Count : number = await RefMenu2.count({
            where : {
                kode_aplikasi : kode_aplikasi,
                kode_menu1 : kodeMenu1
            }
        })

        const kode_menu1 = kodeMenu1

        const init = "M";
        const app = kode_aplikasi;
        const m2 = "02";
        const urutMenu = kode_menu1.substring(7, 9);
        let urut = String(kodeMenu2Count + 1);
        if (urut.length === 1) {
          urut = "0" + String(kodeMenu2Count + 1);
        }
        const kode_menu2 = init + app + "." + m2 + "." + urutMenu + "." + urut;

        const inputRefMenu2 : RefMenu2Input = {
            kode_aplikasi : app,
            kode_menu1 : require.kode_menu1,
            kode_menu2 : kode_menu2,
            nama_menu2 : require.nama_menu2,
            keterangan_menu : require.keterangan_menu,
            icon : require.icon,
            link : require.link,
            status : require.status,
            on_update : require.on_update,
            on_create : require.on_create,
            on_delete : require.on_delete,
            on_view : require.on_view,
            ucr : require.ucr,
        }

        const insertRefMenu2 : RefMenu2Output = await RefMenu2.create(inputRefMenu2)

        if(!insertRefMenu2) throw new CustomError(httpCode.unprocessableEntity, "Gagal Memasukkan Data")

        return insertRefMenu2
    }  
    catch (error : any) {
        if(error instanceof CustomError) {
            throw new CustomError(error.code, error.message)
        } 
        else {
            throw new CustomError(500, "Internal server error.")
        }
    }
}

const show = async (
    id:GetRefMenu2Schema["params"]["id"]) : Promise<RefMenu2Output> => {
    try {
        const refMenu2 : RefMenu2 | null = await RefMenu2.findByPk(id)
        if(!refMenu2) throw new CustomError(httpCode.unprocessableEntity, "Data Tidak Ada")

        return refMenu2
    } catch (error : any) {
        if(error instanceof CustomError) {
            throw new CustomError(error.code, error.message)
        } 
        else {
            throw new CustomError(500, "Internal server error.")
        }
    }
}

const getByKodeMenu1 = async (
    id:GetRefMenu2Schema["params"]["id"]) : Promise<RefMenu2Output[]> => {
    try {
        const refMenu1 : RefMenu1 | null = await RefMenu1.findOne({
            where : {
                kode_menu1 : id
            }
        })

        if(!refMenu1) throw new CustomError(httpCode.unprocessableEntity, "Data Menu1 Tidak Ada")

        const refMenu2 : RefMenu2[] = await RefMenu2.findAll({
            where : {
                kode_menu1 : id
            }, 
            attributes : {exclude : ["ucr","uch","udcr","udch"]}
        })

        return refMenu2
    } catch (error : any) {
        if(error instanceof CustomError) {
            throw new CustomError(error.code, error.message)
        } 
        else {
            throw new CustomError(500, "Internal server error.")
        }
    }
}

const update = async (
    require:UpdatedRefMenu2Schema["body"],
    id:GetRefMenu2Schema["params"]["id"]) : Promise<RefMenu2Output> => {
        try {
            const refMenu2 = await RefMenu2.findByPk(id)

            if (!refMenu2) throw new CustomError(httpCode.unprocessableEntity, "RefMenu1 Tidak Ditemukan")

            refMenu2.nama_menu2 = require.nama_menu2
            refMenu2.keterangan_menu = require.keterangan_menu
            refMenu2.icon = require.icon
            refMenu2.link = require.link
            refMenu2.status = require.status
            refMenu2.on_update = require.on_update
            refMenu2.on_create = require.on_create
            refMenu2.on_delete = require.on_delete
            refMenu2.on_view = require.on_view

            const response = await refMenu2.save()

            if(!response) throw new CustomError(httpCode.unprocessableEntity, "Gagal Update Data")

            return response

        } catch (error : any) {
            if(error instanceof CustomError) {
                throw new CustomError(error.code, error.message)
            } 
            else {
                throw new CustomError(500, "Internal server error.")
            }
        }
}

const destroy = async (
    id:DestroyRefMenu2Schema["params"]["id"]) : Promise<RefMenu2Output> => {
        try {
            const refMenu2  = await RefMenu2.findByPk(id)

             if (!refMenu2) throw new CustomError(httpCode.unprocessableEntity, "RefMenu2 Tidak Ditemukan")

             const hapusData = await RefMenu2.destroy({
                 where : {
                     kode_menu2 : id
                 }
             })

             if(hapusData === 0) {
                throw new CustomError(httpCode.unprocessableEntity, "Data GagalHapus")
             }

             return refMenu2
        } catch (error : any) {
            if(error instanceof CustomError) {
                throw new CustomError(error.code, error.message)
            } 
            else {
                throw new CustomError(500, "Internal server error.")
            }
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
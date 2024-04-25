import RefMenu1, {statusOn, RefMenu1Input, RefMenu1Output} from "@models/refMenu1-model";
import RefMenu2 from "@models/refMenu2-model"
import RefMenu3 from "@models/refMenu3-model";
import TrxGroupMenu from "@models/trxGroupMenu-model";
import TrxGroupUser from "@models/trxGroupUser-model";
import RefAplikasi from "@models/refAplikasi-model";
import CustomError from "@middleware/error-handler";
import generate_auto_code from "@utils/generate_auto_code";
import { httpCode } from "@utils/prefix";
import {
    PayloadRefMenu1Schema,
    SearchRefMenu1Schema,
    UpdatedRefMenu1Schema,
    GetRefMenu1Schema,
    DestroyRefMenu1Schema
} from "@schema/api/refMenu1-schema"

const index = async (
    page:SearchRefMenu1Schema["query"]["page"],
    limit:SearchRefMenu1Schema["query"]["limit"]) : Promise<RefMenu1Output[]> => {
    try {
        let pages: number = parseInt(page);
        let limits: number = parseInt(limit);
        let offset = 0;
    
        if (pages > 1) {
          offset = (pages - 1) * limits;
        }

        // console.log(limits)
    
        const refMenu1 : RefMenu1[] = await RefMenu1.findAll({
            attributes : {exclude : ["ucr", "udcr", "uch", "udch"]},
            limit : limits, 
            offset : offset
        })

        // console.log(refMenu1)

        return refMenu1
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
    require:PayloadRefMenu1Schema["body"]) : Promise<RefMenu1Output> => { 
    try {
        const refAplikasi : RefAplikasi | null = await RefAplikasi.findByPk(require.kode_aplikasi)
        if(!refAplikasi) throw new CustomError(httpCode.unprocessableEntity, "Aplikasi Tidak Ada")

        const kode : number = await RefMenu1.count({
            where : {
                kode_aplikasi : require.kode_aplikasi
            }
        })
        
        const kodeMenu1 = await generate_auto_code.generateMenu1(kode, require.kode_aplikasi)

        const inputRefMenu1 : RefMenu1Input = {
            kode_aplikasi : require.kode_aplikasi,
            kode_menu1 : kodeMenu1,
            kode_level : require.kode_level,
            nama_menu1 : require.nama_menu1,
            keterangan_menu : require.keterangan_menu,
            icon : require.icon,
            link : require.link,
            status : require.status,
            on_update : require.on_update,
            on_create : require.on_create,
            on_delete : require.on_delete,
            on_view : require.on_view,
            ucr : require.ucr,
            uch : require.uch
        }

        const insertRefMenu1 = await RefMenu1.create(inputRefMenu1)

        if(!insertRefMenu1) throw new CustomError(httpCode.unprocessableEntity, "Gagal Memasukkan Data")

        return insertRefMenu1
    } catch (error : any) {
        console.log(error)
        if(error instanceof CustomError) {
            throw new CustomError(error.code, error.message)
        } 
        else {
            throw new CustomError(500, "Internal server error.")
        }
    }
}

const show = async (
    id:GetRefMenu1Schema["params"]["id"]) : Promise<RefMenu1Output> => {
    try {
        const refMenu1 : RefMenu1 | null = await RefMenu1.findByPk(id)
        if(!refMenu1) throw new CustomError(httpCode.unprocessableEntity, "Data Tidak Ada")

        return refMenu1
    } catch (error : any) {
        if(error instanceof CustomError) {
            throw new CustomError(error.code, error.message)
        } 
        else {
            throw new CustomError(500, "Internal server error.")
        }
    }
}

const dataByAplikasi = async (id:GetRefMenu1Schema["params"]["id"]) : Promise<RefMenu1Output[]> => {
    try {
        const exAplikasi : RefAplikasi | null = await RefAplikasi.findOne({
            where : {
                kode_aplikasi : id
            }
        })

        if(!exAplikasi) throw new CustomError(httpCode.unprocessableEntity, "Data Aplikasi Tidak Ada")
        
        const refMenu : RefMenu1[] = await RefMenu1.findAll({
            where : {
                kode_aplikasi : id
            }, 
            attributes : {exclude : ["udcr", "udch", "ucr", "uch"]},
            include : [
                {
                    model : RefMenu2, 
                    as : "Menu2",
                    attributes : {exclude : ["ucr","uch","udcr","udch"]}
                }
            ]
        })

        return refMenu
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
    require:UpdatedRefMenu1Schema["body"],
    id:GetRefMenu1Schema["params"]["id"]) : Promise<RefMenu1Output> => {
        try {
            const refMenu1 = await RefMenu1.findByPk(id)

            if (!refMenu1) throw new CustomError(httpCode.unprocessableEntity, "RefMenu1 Tidak Ditemukan")

            refMenu1.kode_aplikasi = require.kode_aplikasi
            refMenu1.kode_level = require.kode_level
            refMenu1.nama_menu1 = require.nama_menu1
            refMenu1.keterangan_menu = require.keterangan_menu
            refMenu1.icon = require.icon
            refMenu1.link = require.link
            refMenu1.status = require.status
            refMenu1.on_update = require.on_update
            refMenu1.on_create = require.on_create
            refMenu1.on_delete = require.on_delete
            refMenu1.on_view = require.on_view

            const response = await refMenu1.save()

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
    id:DestroyRefMenu1Schema["params"]["id"]) : Promise<RefMenu1Output> => {
        try {
            const refMenu1 : RefMenu1 | null = await RefMenu1.findByPk(id)

             if (!refMenu1) throw new CustomError(httpCode.unprocessableEntity, "RefMenu1 Tidak Ditemukan")

            const exGroupMenu : TrxGroupMenu | null = await TrxGroupMenu.findOne({
                where : {
                    kode_menu1 : id
                }
            }) 

            if(exGroupMenu) throw new CustomError(httpCode.unprocessableEntity, "Menu Sudah Terdaftar Oleh User")
             

             const hapusData = await RefMenu1.destroy({
                 where : {
                     kode_menu1 : id
                 }
             })

             console.log(hapusData);
             
             if(hapusData === 0 ) throw new CustomError(httpCode.unprocessableEntity, "Data Gagal Hapus")

             return refMenu1
        } catch (error : any) {
            if(error instanceof CustomError) {
                throw new CustomError(error.code, error.message)
            } 
            else {
                throw new CustomError(500, "Internal server error.")
            }
        }
    }

const countMenu1 = async () : Promise<any | null> => {
    try {
        const count = await RefMenu1.count()

        return count
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
    update,
    show,
    dataByAplikasi,
    destroy,
    countMenu1
}
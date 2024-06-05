import RefMenu2 from "@models/refMenu2-model";
import RefMenu3, {RefMenu3Input, RefMenu3Output} from "@models/refMenu3-model";
import CustomError from "@middleware/error-handler";
import { httpCode } from "@utils/prefix";
import {
    PayloadRefMenu3Schema,
    UpdatedRefMenu3Schema,
    SearchRefMenu3Schema,
    GetRefMenu3Schema,
    DestroyRefMenu3Schema
} from "@schema/api/refMenu3-schema"
import TrxGroupMenu from "@models/trxGroupMenu-model";
import sequelize from "sequelize";

const index = async (
    page:SearchRefMenu3Schema["query"]["page"],
    limit:SearchRefMenu3Schema["query"]["limit"]) : Promise<RefMenu3Output[]> => {
    try {
        let pages: number = parseInt(page);
        let limits: number = parseInt(limit);
        let offset = 0;
    
        if (pages > 1) {
          offset = (pages - 1) * limits;
        }
    
        const refMenu3 : RefMenu3[] = await RefMenu3.findAll({
            attributes : {exclude : ["ucr", "udcr", "uch", "udch"]},
            limit : limits, 
            offset : offset
        })

        return refMenu3

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
    require:PayloadRefMenu3Schema["body"], ucr : string) : Promise<RefMenu3Output> => {
    try {
        const kode_aplikasi = require.kode_aplikasi
        const kodeMenu2 = require.kode_menu2

        const cekMenu2 : RefMenu2 | null = await RefMenu2.findOne({
            where : {
                kode_aplikasi : kode_aplikasi,
                kode_menu2 : kodeMenu2
            }
        })

        if(!cekMenu2) throw new CustomError (httpCode.unprocessableEntity, "Menu 2 Tidak Ada")

            const kode : any = await RefMenu3.findOne({
                where : {
                kode_aplikasi : kode_aplikasi,
                kode_menu2 : kodeMenu2
                },
                attributes: [
                    [sequelize.fn('MAX', sequelize.literal("CAST(SPLIT_PART(kode_menu3, '.', -1) AS INTEGER)")), 'max_code']
                  ],
                  raw : true
            })

        let kodeMenu3Count : number 
            
        if(kode.max_code === null || kode.max_code === 0 ){
            kodeMenu3Count = 0
        } else {
            kodeMenu3Count = kode.max_code
        }

      

        const kode_menu2 = kodeMenu2;

        const init = "M";
        const app = kode_aplikasi;
        const m3 = "03";
        const urutMenu = kodeMenu2.substring(7,12)
        let urut = String(kodeMenu3Count + 1)
        if(urut.length === 1 ) {
            urut = "0" + String(kodeMenu3Count + 1)
        }

        const kode_menu3 = init + app + "." + m3 + "." + urutMenu + "." + urut;

        const inputRefMenu3 : RefMenu3Input = {
            kode_aplikasi : app,
            kode_menu2 : require.kode_menu2,
            kode_menu3 : kode_menu3,
            nama_menu3 : require.nama_menu3,
            keterangan_menu : require.keterangan_menu,
            icon : require.icon,
            link : require.link,
            status : require.status,
            on_create  : require.on_create,
            on_update : require.on_update,
            on_delete : require.on_delete,
            on_view : require.on_view,
            ucr : ucr,
        }

        const insertRefMenu3 : RefMenu3Output = await RefMenu3.create(inputRefMenu3)

        if(!insertRefMenu3) throw new CustomError(httpCode.unprocessableEntity, "Gagal Memasukkan Data")

        return insertRefMenu3

    } catch (error : any) {
        if(error instanceof CustomError) {
            throw new CustomError(error.code, error.message)
        } 
        else {
            throw new CustomError(500, "Internal server error.")
        }
    }
}

const show = async (
    id:GetRefMenu3Schema["params"]["id"]) : Promise<RefMenu3Output> => {
    try {
        const refMenu3 : RefMenu3 | null = await RefMenu3.findByPk(id)
        if(!refMenu3) throw new CustomError(httpCode.unprocessableEntity, "Data Tidak Ada")

        return refMenu3
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
    require:UpdatedRefMenu3Schema["body"],
    id:GetRefMenu3Schema["params"]["id"], uch : string) : Promise<RefMenu3Output> => {
        try {
            const refMenu3 = await RefMenu3.findByPk(id)

            if (!refMenu3) throw new CustomError(httpCode.unprocessableEntity, "RefMenu3 Tidak Ditemukan")

            
            refMenu3.nama_menu3 = require.nama_menu3
            refMenu3.keterangan_menu = require.keterangan_menu
            refMenu3.icon = require.icon
            refMenu3.link = require.link
            refMenu3.status = require.status
            refMenu3.on_update = require.on_update
            refMenu3.on_create = require.on_create
            refMenu3.on_delete = require.on_delete
            refMenu3.on_view = require.on_view
            refMenu3.uch = uch

            const response = await refMenu3.save()

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

const getByMenu2 = async (
    id:GetRefMenu3Schema["params"]["id"]) : Promise<RefMenu3Output[]> => {
    try {
        const refMenu2 = await RefMenu2.findOne({
            where : {
                kode_menu2 : id
            }
        })

        if(!refMenu2) throw new CustomError(httpCode.unprocessableEntity, "Data Menu 2 Tidak Ada")
        
        const refMenu3 = await RefMenu3.findAll({
            where : {
                kode_menu2 : id
            }, 
            attributes : {exclude : ["ucr","uch","udcr","udch"]}
        })


        return refMenu3
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

const destroy = async (
    id:DestroyRefMenu3Schema["params"]["id"]) : Promise<RefMenu3Output> => {
        try {
            const refMenu3  = await RefMenu3.findByPk(id)

             if (!refMenu3) throw new CustomError(httpCode.unprocessableEntity, "RefMenu3 Tidak Ditemukan")

             const exTrxGroupMenu : TrxGroupMenu | null = await TrxGroupMenu.findOne({
                where : {
                    kode_menu3 : id
                }
             })

             if(exTrxGroupMenu) throw new CustomError(httpCode.unprocessableEntity, "Menu Sudah Terdaftar Oleh User")

             const hapusData = await RefMenu3.destroy({
                 where : {
                     kode_menu3 : id
                 }
             })

             if(hapusData === 0) {
                throw new CustomError(httpCode.unprocessableEntity, "Data Gagal Hapus")
             }

             return refMenu3
        } catch (error : any) {
            if(error instanceof CustomError) {
                throw new CustomError(error.code, error.message)
            } 
            else {
                throw new CustomError(500, "Internal server error.")
            }
        }
    }

const countMenu3 = async () : Promise<any | null> => {
        try {
            const count = await RefMenu2.count()
    
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
    show,
    update,
    getByMenu2,
    destroy,
    countMenu3
}
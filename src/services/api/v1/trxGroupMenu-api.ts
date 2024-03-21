import TrxGroupMenu, {Akses, TrxGroupMenuInput, TrxGroupMenuOutput} from "@models/trxGroupMenu-model";
import RefGroup from "@models/refGroup-model";
import CustomError from "@middleware/error-handler";
import { httpCode } from "@utils/prefix";
import {
    PayloadTrxGroupMenuSchema,
    UpdatedTrxGroupMenuSchema,
    GetTrxGroupMenuSchema,
    DestroyTrxGroupMenuSchema,
    SearchTrxGroupMenuSchema
} from "@schema/api/trxGroupMenu-schema"

const index = async (
    page:SearchTrxGroupMenuSchema["query"]["page"],
    limit:SearchTrxGroupMenuSchema["query"]["limit"]) : Promise<TrxGroupMenuOutput[]> => {
    try {
        let pages: number = parseInt(page);
        let limits: number = parseInt(limit);
        let offset = 0;
    
        if (pages > 1) {
          offset = (pages - 1) * limits;
        }

        const trxGroupMenu : TrxGroupMenu[] = await TrxGroupMenu.findAll({
            attributes : {exclude : ["ucr", "udcr", "uch", "udch"]},
            limit : limits, 
            offset : offset
        })

        return trxGroupMenu
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
    require:PayloadTrxGroupMenuSchema["body"]) : Promise<TrxGroupMenuOutput> => {
    try {
        const kodeGroup = require.kode_group
        const kodeAplikasi = require.kode_aplikasi
        const kodeMenu1 = require.kode_menu1
        const kodeMenu2 = require.kode_menu2
        const kodeMenu3 = require.kode_menu3

        const cekGroup : RefGroup | null = await RefGroup.findOne({
            where : {
                kode_aplikasi : kodeAplikasi, 
                kode_group : kodeGroup
            }
        })

        if(!cekGroup) throw new CustomError(httpCode.found, "Kode Group Tidak Ada")

        const data_insert : TrxGroupMenuInput = {
            kode_group : kodeGroup, 
            kode_menu1 : kodeMenu1,
            kode_menu2 : kodeMenu2, 
            kode_menu3 : kodeMenu3, 
            akses : Akses.Aktif,
            ucr : require.ucr
        }

        const insert : TrxGroupMenuOutput = await TrxGroupMenu.create(data_insert)

        if(!insert) throw new CustomError(httpCode.found, "Data Gagal Insert")

        return insert
    } catch (error) {
        console.log(error)
        if(error instanceof CustomError) {
            throw new CustomError(error.code, error.message)
        } 
        else {
            throw new CustomError(500, "Internal server error.")
        }
    }
}

const show = async (id : GetTrxGroupMenuSchema["params"]["id"]) : Promise <TrxGroupMenuOutput> => {
    try {
        const trxGroupMenu : TrxGroupMenu | null = await TrxGroupMenu.findOne({
            where : {
                id_group_menu : id
            }, 
            include : [
                {
                    model : RefGroup, 
                    as : "Group"
                }
            ]
        })

        if(!trxGroupMenu) throw new CustomError(httpCode.found, "Data Group Menu Tidak Ada")

        return trxGroupMenu
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
    require:UpdatedTrxGroupMenuSchema["body"],
    id : UpdatedTrxGroupMenuSchema["params"]["id"]) : Promise<TrxGroupMenuOutput> => {
    try {
        const groupMenu : TrxGroupMenu | null = await TrxGroupMenu.findByPk(id)

        if(!groupMenu) throw new CustomError(httpCode.found, "Group Menu Tidak Ada")

        groupMenu.kode_group = require.kode_group
        groupMenu.kode_menu1 = require.kode_menu1
        groupMenu.kode_menu2 = require.kode_menu2
        groupMenu.kode_menu3 = require.kode_menu3
        groupMenu.akses = require.akses
        groupMenu.uch = require.uch

        const response = await groupMenu.save()

        if(!response) throw new CustomError(httpCode.found, "Data Gagal Update")

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

const destroy = async (id:DestroyTrxGroupMenuSchema["params"]["id"]) : Promise<TrxGroupMenuOutput> => {
    try {
        const groupMenu : TrxGroupMenu | null = await TrxGroupMenu.findByPk(id)

        if(!groupMenu) throw new CustomError(httpCode.found, "Data Group Menu Tidak Ada")

        const hapusData = await TrxGroupMenu.destroy({
            where : {
                id_group_menu : id
            }
        })

        if(hapusData === 0) throw new CustomError(httpCode.found, "Data Gagal Hapus")

        return groupMenu
    } catch (error) {
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
    destroy,

}
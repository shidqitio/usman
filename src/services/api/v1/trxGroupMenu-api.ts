import TrxGroupMenu, {Akses, TrxGroupMenuInput, TrxGroupMenuOutput} from "@models/trxGroupMenu-model";
import RefGroup from "@models/refGroup-model";
import CustomError from "@middleware/error-handler";
import TrxGroupUser from "@models/trxGroupUser-model";
import { httpCode } from "@utils/prefix";
import {
    PayloadTrxGroupMenuSchema,
    UpdatedTrxGroupMenuSchema,
    GetTrxGroupMenuSchema,
    DestroyTrxGroupMenuSchema,
    SearchTrxGroupMenuSchema,
    GetAplikasiByIdSchema,
    AplikasiLevelSchema
} from "@schema/api/trxGroupMenu-schema"
import RefMenu1 from "@models/refMenu1-model";
import RefMenu2 from "@models/refMenu2-model";
import RefMenu3 from "@models/refMenu3-model";

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

        if(!cekGroup) throw new CustomError(httpCode.unprocessableEntity, "Kode Group Tidak Ada")

        console.log(cekGroup.kode_level)

        const cekMenu1 : RefMenu1 | null = await RefMenu1.findOne({
            where : {
                kode_menu1 : kodeMenu1, 
                kode_aplikasi : kodeAplikasi
            }
        })

        console.log(cekMenu1?.kode_level)

        if(!cekMenu1) throw new CustomError(httpCode.unprocessableEntity, "Kode Menu Tidak Ada")

        if (cekGroup.kode_level !== cekMenu1.kode_level) {
            throw new CustomError(422, "Kode Tidak Tepat")
        }

        const exGroupMenu = await TrxGroupMenu.findOne({
            where : {
                kode_group : kodeGroup, 
                kode_menu1 : kodeMenu1
            }
        })


        if(exGroupMenu) throw new CustomError(httpCode.unprocessableEntity, "Data Sudah Pernah Ada")

        const data_insert : TrxGroupMenuInput = {
            kode_group : kodeGroup, 
            kode_menu1 : kodeMenu1,
            kode_menu2 : kodeMenu2, 
            kode_menu3 : kodeMenu3, 
            akses : Akses.Aktif,
            ucr : require.ucr
        }

        const insert : TrxGroupMenuOutput = await TrxGroupMenu.create(data_insert)

        if(!insert) throw new CustomError(httpCode.unprocessableEntity, "Data Gagal Insert")

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

        if(!trxGroupMenu) throw new CustomError(httpCode.unprocessableEntity, "Data Group Menu Tidak Ada")

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

const groupMenuAplikasi = async (
    id:GetAplikasiByIdSchema["params"]["id"]) : Promise <TrxGroupMenuOutput[]> => {
    try {
        const groupMenu : TrxGroupMenu[] = await TrxGroupMenu.findAll({
            attributes : {exclude : ["ucr","uch","udcr","udch"]},
            include : [
                {
                    model : RefMenu1, 
                    as : "Menu1",
                    attributes : [],
                    where : {
                        kode_aplikasi : id
                    },
                },
                {
                    model : RefGroup, 
                    as : "Group",
                    attributes : {exclude : ["ucr","uch","udcr","udch"]},
                }
            ]
        })

        return groupMenu

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

        if(!groupMenu) throw new CustomError(httpCode.unprocessableEntity, "Group Menu Tidak Ada")

        groupMenu.kode_group = require.kode_group
        groupMenu.kode_menu1 = require.kode_menu1
        groupMenu.kode_menu2 = require.kode_menu2
        groupMenu.kode_menu3 = require.kode_menu3
        groupMenu.akses = require.akses
        groupMenu.uch = require.uch

        const response = await groupMenu.save()

        if(!response) throw new CustomError(httpCode.unprocessableEntity, "Data Gagal Update")

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

        if(!groupMenu) throw new CustomError(httpCode.unprocessableEntity, "Data Group Menu Tidak Ada")

        const exTrxGroupUser : TrxGroupUser | null = await TrxGroupUser.findOne({
            where : {
                kode_group : groupMenu.kode_group
            }
        })

        if(exTrxGroupUser) throw new CustomError(httpCode.unprocessableEntity, "Menu Group Sudah Terdaftar Pengguna")

        const hapusData = await TrxGroupMenu.destroy({
            where : {
                id_group_menu : id
            }
        })

        if(hapusData === 0) throw new CustomError(httpCode.unprocessableEntity, "Data Gagal Hapus")

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

const menuByLevelAplikasi = async (
    kode_aplikasi:AplikasiLevelSchema["params"]["kode_aplikasi"], 
    kode_level : AplikasiLevelSchema["params"]["kode_level"]) 
    : Promise <TrxGroupMenuOutput[]> => {
    try {
        
        const trxGroupMenu : TrxGroupMenu[] = await TrxGroupMenu.findAll({
            attributes : {exclude : ["ucr","uch","udcr","udch"]},
            include : [
                {
                    model : RefGroup, 
                    as : "Group", 
                    attributes : [],
                    where : {
                        kode_level : kode_level
                    }
                }, 
                {
                    model : RefMenu1, 
                    as : "Menu1", 
                    attributes : [],
                    where : {
                        kode_aplikasi : kode_aplikasi
                    }
                }
            ]
        })

        if(trxGroupMenu.length === 0) throw new CustomError(httpCode.unprocessableEntity, "Group Menu Tidak Ada")

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





export default {
    index,
    store,
    show,
    update,
    destroy,
    menuByLevelAplikasi,
    groupMenuAplikasi
}
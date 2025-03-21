import RefMenu1 from "@models/refMenu1-model";
import RefMenu2, {RefMenu2Input, RefMenu2Output} from "@models/refMenu2-model";
import TrxGroupMenu from "@models/trxGroupMenu-model";
import CustomError from "@middleware/error-handler";
import { httpCode } from "@utils/prefix";
import {
    PayloadRefMenu2Schema,
    UpdatedRefMenu2Schema,
    SearchRefMenu2Schema,
    GetRefMenu2Schema,
    DestroyRefMenu2Schema,
    ParamsLevelSchema
} from "@schema/api/refMenu2-schema"
import RefMenu3 from "@models/refMenu3-model";
import sequelize from "sequelize";
import RefGroup,{RefGroupOutput} from "@models/refGroup-model";
import { debugLogger } from "@config/logger";



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
            throw new CustomError(error.code, error.status, error.message)
        } 
        else {
            throw new CustomError(500, "error", "Internal server error.")
        }
    }
}

const store = async (
    require:PayloadRefMenu2Schema["body"], ucr : string) : Promise<RefMenu2Output> => { 
    try {
        const kode_aplikasi : string = require.kode_aplikasi
        const kodeMenu1 : string = require.kode_menu1
        
        const cekMenu1 : RefMenu1 | null = await RefMenu1.findOne({
            where : {
                kode_aplikasi : kode_aplikasi,
                kode_menu1 : kodeMenu1
            }
        })

        if(!cekMenu1) throw new CustomError(httpCode.notFound,"success", "Menu 1 Tidak Ada")

            const kode : any = await RefMenu2.findOne({
                where : {
                kode_aplikasi : kode_aplikasi,
                kode_menu1 : kodeMenu1
                },
                attributes: [
                    [sequelize.fn('MAX', sequelize.literal("CAST(SPLIT_PART(kode_menu2, '.', -1) AS INTEGER)")), 'max_code']
                  ],
                  raw : true
            })

        let kodeMenu2Count : number

        if(kode.max_code === null || kode.max_code === 0 ){
            kodeMenu2Count = 0
        } else {
            kodeMenu2Count = kode.max_code
        }

        console.log("TES COUNT DATA : ", kodeMenu2Count);
        

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
            ucr : ucr,
        }

        const insertRefMenu2 : RefMenu2Output = await RefMenu2.create(inputRefMenu2)

        if(!insertRefMenu2) throw new CustomError(httpCode.unprocessableEntity,"error", "Gagal Memasukkan Data")

        return insertRefMenu2
    }  
    catch (error : any) {
        // console.log(error);
        
        if(error instanceof CustomError) {
            throw new CustomError(error.code, error.status, error.message)
        } 
        else {
            throw new CustomError(500, "error", "Internal server error.")
        }
    }
}

const show = async (
    id:GetRefMenu2Schema["params"]["id"]) : Promise<RefMenu2Output> => {
    try {
        const refMenu2 : RefMenu2 | any = await RefMenu2.findByPk(id)

        // if(!refMenu2) throw new CustomError(httpCode.unprocessableEntity, "Data Tidak Ada")

        return refMenu2
    } catch (error : any) {
        if(error instanceof CustomError) {
            throw new CustomError(error.code,error.status, error.message)
        } 
        else {
            throw new CustomError(500, "error", "Internal server error.")
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

        if(!refMenu1) throw new CustomError(httpCode.notFound,"success", "Data Menu1 Tidak Ada")

        const refMenu2 : RefMenu2[] = await RefMenu2.findAll({
            where : {
                kode_menu1 : id
            },
            attributes : {exclude : ["ucr","uch","udcr","udch"]},
            include : [
                {
                    model : RefMenu3, 
                    as : "Menu3", 
                    attributes : {exclude : ["ucr","uch","udcr","udch"]}
                }
            ]
        })

        return refMenu2
    } catch (error : any) {
        if(error instanceof CustomError) {
            throw new CustomError(error.code,error.status, error.message)
        } 
        else {
            throw new CustomError(500, "error", "Internal server error.")
        }
    }
}

const update = async (
    require:UpdatedRefMenu2Schema["body"],
    id:GetRefMenu2Schema["params"]["id"], uch : string) : Promise<RefMenu2Output> => {
        try {
            const refMenu2 = await RefMenu2.findByPk(id)

            if (!refMenu2) throw new CustomError(httpCode.notFound,"success", "RefMenu2 Tidak Ditemukan")

            refMenu2.kode_aplikasi = refMenu2.kode_aplikasi
            refMenu2.kode_menu1 = refMenu2.kode_menu1
            refMenu2.nama_menu2 = require.nama_menu2
            refMenu2.keterangan_menu = require.keterangan_menu
            refMenu2.icon = require.icon
            refMenu2.link = require.link
            refMenu2.status = require.status
            refMenu2.on_update = require.on_update
            refMenu2.on_create = require.on_create
            refMenu2.on_delete = require.on_delete
            refMenu2.on_view = require.on_view
            refMenu2.uch = uch

            const response = await refMenu2.save()

            if(!response) throw new CustomError(httpCode.unprocessableEntity,"error", "Gagal Update Data")

            return response

        } catch (error : any) {
            if(error instanceof CustomError) {
                throw new CustomError(error.code,error.status, error.message)
            } 
            else {
                throw new CustomError(500,  "error","Internal server error.")
            }
        }
}

const destroy = async (
    id:DestroyRefMenu2Schema["params"]["id"]) : Promise<RefMenu2Output> => {
        try {
            const refMenu2  = await RefMenu2.findByPk(id)

             if (!refMenu2) throw new CustomError(httpCode.notFound, "success", "RefMenu2 Tidak Ditemukan")

             const exTrxGroupMenu : TrxGroupMenu | null = await TrxGroupMenu.findOne({
                where : {
                    kode_menu2 : id
                }
             })

             if(exTrxGroupMenu) throw new CustomError(httpCode.conflict, "success", "Menu Sudah Terdaftar Oleh User")


             const hapusData = await RefMenu2.destroy({
                 where : {
                     kode_menu2 : id
                 }
             })



             if(hapusData === 0) {
                throw new CustomError(httpCode.unprocessableEntity, "error" , "Data GagalHapus")
             }

             return refMenu2
        } catch (error : any) {
            if(error instanceof CustomError) {
                throw new CustomError(error.code, error.status, error.message)
            } 
            else {
                throw new CustomError(500, "error", "Internal server error.")
            }
        }
    }

    const menuByLevel2 = async (id1:ParamsLevelSchema["params"]["id1"], id2: ParamsLevelSchema["params"]["id2"]) : Promise<RefGroupOutput[]> => {
        try {

    
            const menuLevel = await RefMenu1.findOne({
                where : {
                    kode_level : id1
                },
                include : [
                    {
                        model : RefMenu2, 
                        as : "Menu2",
                        attributes : [],
                        where : {
                            kode_menu2 : id2
                        }
                    }
                ],
                raw : true
            })
    
            if(!menuLevel) {
                return []
            }
    
            const group = await RefGroup.findAll({
                attributes : ["kode_group", "nama_group", "kode_level"],
                where : {
                    kode_level : id1, 
                    kode_aplikasi : menuLevel?.kode_aplikasi
                }
            })
    
            return group
        } catch (error) {
            debugLogger.error(error)
            if(error instanceof CustomError) {
                throw new CustomError(error.code,error.status, error.message)
            } 
            else {
                throw new CustomError(500, "error","Internal server error.")
            }
        }
    }



const countMenu2 = async () : Promise<any | null> => {
        try {
            const count = await RefMenu2.count()
    
            return count
        } catch (error : any) {
            if(error instanceof CustomError) {
                throw new CustomError(error.code,error.status, error.message)
            } 
            else {
                throw new CustomError(500,  "error","Internal server error.")
            }
        }
    }





export default {
    index,
    store,
    show,
    update,
    getByKodeMenu1,
    destroy,
    countMenu2,
    menuByLevel2
}
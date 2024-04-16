import RefAplikasi from "@models/refAplikasi-model";
import RefGroup, {RefGroupInput, RefGroupOutput} from "@models/refGroup-model";
import RefLevel from "@models/refLevel-model";
import generateAutoCode from "@utils/generate_auto_code"
import TrxGroupMenu from "@models/trxGroupMenu-model";
import TrxGroupUser from "@models/trxGroupUser-model";
import db from "@config/database";
import CustomError from "@middleware/error-handler";
import { httpCode } from "@utils/prefix";
import {
    PayloadRefGroupSchema,
    ParamRefGroupSchema,
    UpdatedRefGroupSchema,
    DeletedRefGroupSchema
} from "@schema/api/refGroup-schema"


const index = async () : Promise<RefGroupOutput[]> => {
    try {
        const refGroup : RefGroup[] = await RefGroup.findAll({
            attributes : {exclude : ["ucr","uch", "udcr", "udch"]},
            include : [
                {
                    model : RefLevel, 
                    as : "Level", 
                    attributes : {exclude : ["udcr", "udch"]}
                }
            ]
        })

        if (refGroup.length === 0 ) throw new CustomError(httpCode.unprocessableEntity, "Data Tidak Ada")

        return refGroup
    } catch (error : any) {
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
          } else {
            throw new CustomError(500, "Internal server error.");
          }
    }
}

const store = async (
    request:PayloadRefGroupSchema["body"])
    : Promise<RefGroupOutput> => {
    try {
        const cekAplikasi : RefAplikasi | null = await RefAplikasi.findOne({
            where : {
                kode_aplikasi : request.kode_aplikasi
            }
        })

        if(!cekAplikasi) throw new CustomError(httpCode.unprocessableEntity, "Aplikasi Tidak Ada")

        const cekGroup : RefGroup[] = await RefGroup.findAll({
            attributes : ["kode_group"],
            where : {
                kode_aplikasi : request.kode_aplikasi
            }
        })

        const kodeGroup : any = await generateAutoCode.generateKodeGroup(cekGroup, request.kode_aplikasi)
        // console.log(kodeGroup)
        const dataGroup : RefGroupInput = {
            kode_group : kodeGroup,
            nama_group : request.nama_group,
            kode_level : request.kode_level,
            kode_aplikasi : request.kode_aplikasi,
            ucr : request.ucr
        }

        const createGroup : RefGroupOutput = await RefGroup.create(dataGroup)

        return createGroup

    } catch (error : any) {
        console.log(error)
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
          } else {
            throw new CustomError(500, "Internal server error.");
          }
    }
}

const show = async (
    id:ParamRefGroupSchema["params"]["id"]) : Promise<RefGroupOutput> => {
    try {
        const refGroup : RefGroup | null = await RefGroup.findOne({
            where : {
                kode_group : id
            }, 
            include : [
                {
                    model : RefLevel, 
                    as : "Level", 
                    attributes : {exclude : ["udcr", "udch"]}
                },
                {
                    model : RefAplikasi, 
                    as : "Aplikasi", 
                    attributes : {exclude : ["kode_aplikasi", "ucr", "uch", "udcr", "udch"]}
                }
            ]
        })

        if (!refGroup) throw new CustomError(httpCode.unprocessableEntity, "Data Tidak Ada")

        return refGroup
    } catch (error : any) {
        if(error instanceof CustomError) {
            throw new CustomError(error.code, error.message)
        } 
        else {
            throw new CustomError(500, "Internal server error.")
        }
    }
}

const getRoleByAplikasi = async (
    id:ParamRefGroupSchema["params"]["id"]) : Promise<RefGroup[]> => {
    try {
        const exRefAplikasi : RefAplikasi | null = await RefAplikasi.findOne({
            where : {
                kode_aplikasi : id
            }
        })

        if(!exRefAplikasi) throw new CustomError(httpCode.unprocessableEntity, "Kode Aplikasi Tidak Ada")


        const refGroup : RefGroup[] = await RefGroup.findAll({
            where : {
                kode_aplikasi : id
            },
            attributes : {exclude : ["udcr","udch","ucr","uch"]},
            include : [
                {
                    model : RefLevel, 
                    as : "Level"
                }
            ]
        })

        return refGroup

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
    id:UpdatedRefGroupSchema["params"]["id"],
    request:UpdatedRefGroupSchema["body"]) : Promise<RefGroupOutput> => {
    try {
        const refGroup : RefGroup | null = await RefGroup.findByPk(id) 

        if (!refGroup) throw new CustomError(httpCode.unprocessableEntity, "Data Tidak Ada")

        refGroup.nama_group = request.nama_group 
        refGroup.kode_level = request.kode_level
        refGroup.ucr = request.uch
        refGroup.kode_aplikasi = request.kode_aplikasi

        const response = await refGroup.save()

        if(!response) throw new CustomError(httpCode.ok, "Data Gagal Update")

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
    id:DeletedRefGroupSchema["params"]["id"]) : Promise<RefGroup> => {
    try {
        const refGroup : RefGroup | null = await RefGroup.findOne({
            where : {
                kode_group : id
            }, 
            attributes : {exclude : ["udcr", "udch", "ucr", "uch"]}
        })

        if(!refGroup) throw new CustomError(httpCode.unprocessableEntity, "Data Group Tidak Ada")

        const deleteGroup = await RefGroup.destroy({
            where : {
                kode_group : id
            }
        })

        
        const extrxGroupUser : TrxGroupUser | null  = await TrxGroupUser.findOne({
            where : {
                kode_group : id 
            }
        })

        if(extrxGroupUser) throw new CustomError(httpCode.unprocessableEntity, "Role Sudah Terpakai")


        const extrxGroupMenu : TrxGroupMenu | null = await TrxGroupMenu.findOne({
            where : {
                kode_group : id
            }
        })

        if(extrxGroupMenu) throw new CustomError(httpCode.unprocessableEntity, "Role Sudah Terintegrasi dengan Menu")

        if(deleteGroup === 0) throw new CustomError(httpCode.unprocessableEntity, "Data Group Gagal Hapus")

        return refGroup
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
    getRoleByAplikasi
}
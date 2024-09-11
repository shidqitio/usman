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
    AplikasiLevelSchema,
    UrutanSchema
} from "@schema/api/trxGroupMenu-schema"
import RefMenu1 from "@models/refMenu1-model";
import RefMenu2 from "@models/refMenu2-model";
import RefMenu3 from "@models/refMenu3-model";
import sequelize from "sequelize";

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
            throw new CustomError(error.code, error.status, error.message)
        } 
        else {
            throw new CustomError(500,"error", "Internal server error.")
        }
    }
}

const store = async (
    require:PayloadTrxGroupMenuSchema["body"], ucr : string | null) : Promise<TrxGroupMenuOutput> => {
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

        if(!cekGroup) throw new CustomError(httpCode.notFound, "succes", "Kode Group Tidak Ada")

        console.log(cekGroup.kode_level)

        const cekMenu1 : RefMenu1 | null = await RefMenu1.findOne({
            where : {
                kode_menu1 : kodeMenu1, 
                kode_aplikasi : kodeAplikasi
            }
        })

        console.log(cekMenu1?.kode_level)

        if(!cekMenu1) throw new CustomError(httpCode.notFound,"succes", "Kode Menu Tidak Ada")

        if (cekGroup.kode_level !== cekMenu1.kode_level) {
            throw new CustomError(422, "succes","Kode Tidak Tepat")
        }

        // const exGroupMenu1 = await TrxGroupMenu.findOne({
        //     where : {
        //         kode_group : kodeGroup, 
        //         kode_menu1 : kodeMenu1
        //     }
        // })

        // let insert

        // if(!exGroupMenu1) {
        //         const data_insert : TrxGroupMenuInput = {
        //         kode_group : kodeGroup, 
        //         kode_menu1 : kodeMenu1,
        //         kode_menu2 : kodeMenu2, 
        //         kode_menu3 : kodeMenu3, 
        //         akses : Akses.Aktif,
        //         ucr : require.ucr
        //         }
        //         insert  = await TrxGroupMenu.create(data_insert)
        // }

        // else if(exGroupMenu1) {
        //     const checkGroupMenu2 = await TrxGroupMenu.findAll({
        //         where : {
        //             kode_group : kodeGroup,
        //             kode_menu1 : kodeMenu1, 
        //             kode_menu2 : kodeMenu2
        //         }
        //     })

        //     if(checkGroupMenu2.length !== 0) {
        //         throw new CustomError(httpCode.unprocessableEntity, "Data Sudah Ada")
        //     }
        // }

        const exGroupMenu = await TrxGroupMenu.findOne({
            where : {
                kode_group : kodeGroup, 
                kode_menu1 : kodeMenu1,
                kode_menu2 : kodeMenu2, 
                kode_menu3 : kodeMenu3
            }
        })


        if(exGroupMenu) throw new CustomError(httpCode.conflict,"succes", "Data Sudah Pernah Ada")

        

        const data_insert : TrxGroupMenuInput = {
            kode_group : kodeGroup, 
            kode_menu1 : kodeMenu1,
            kode_menu2 : kodeMenu2, 
            kode_menu3 : kodeMenu3, 
            akses : Akses.Aktif,
            ucr : ucr
        }



        const insert : TrxGroupMenuOutput = await TrxGroupMenu.create(data_insert)

        if(!insert) throw new CustomError(httpCode.unprocessableEntity,"error", "Data Gagal Insert")

        return insert
    } catch (error) {
        console.log(error)
        if(error instanceof CustomError) {
            throw new CustomError(error.code,error.status, error.message)
        } 
        else {
            throw new CustomError(500, "error", "Internal server error.")
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

        if(!trxGroupMenu) throw new CustomError(httpCode.notFound, "success", "Data Group Menu Tidak Ada")

        return trxGroupMenu
    } catch (error : any) {
        if(error instanceof CustomError) {
            throw new CustomError(error.code, error.status,error.message)
        } 
        else {
            throw new CustomError(500, "error","Internal server error.")
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
            throw new CustomError(error.code,error.status, error.message)
        } 
        else {
            throw new CustomError(500, "error", "Internal server error.")
        }
    }
}

const update = async (
    require:UpdatedTrxGroupMenuSchema["body"],
    id : UpdatedTrxGroupMenuSchema["params"]["id"], uch : string) : Promise<TrxGroupMenuOutput> => {
    try {
        const groupMenu : TrxGroupMenu | null = await TrxGroupMenu.findByPk(id)

        if(!groupMenu) throw new CustomError(httpCode.notFound,"succes", "Group Menu Tidak Ada")

        groupMenu.kode_group = require.kode_group
        groupMenu.kode_menu1 = require.kode_menu1
        groupMenu.kode_menu2 = require.kode_menu2
        groupMenu.kode_menu3 = require.kode_menu3
        groupMenu.akses = require.akses
        groupMenu.uch = uch

        const response = await groupMenu.save()

        if(!response) throw new CustomError(httpCode.unprocessableEntity, "error","Data Gagal Update")

        return response
    } catch (error : any) {
        if(error instanceof CustomError) {
            throw new CustomError(error.code, error.status,error.message)
        } 
        else {
            throw new CustomError(500, "error", "Internal server error.")
        }
    }
}

const destroy = async (id:DestroyTrxGroupMenuSchema["params"]["id"]) : Promise<TrxGroupMenuOutput> => {
    try {
        const groupMenu : TrxGroupMenu | null = await TrxGroupMenu.findByPk(id)

        if(!groupMenu) throw new CustomError(httpCode.notFound,"success", "Data Group Menu Tidak Ada")

        const exTrxGroupUser : TrxGroupUser | null = await TrxGroupUser.findOne({
            where : {
                kode_group : groupMenu.kode_group
            }
        })

        const hapusData = await TrxGroupMenu.destroy({
            where : {
                id_group_menu : id
            }
        })

        if(hapusData === 0) throw new CustomError(httpCode.unprocessableEntity,"error", "Data Gagal Hapus")

        return groupMenu
    } catch (error) {
        if(error instanceof CustomError) {
            throw new CustomError(error.code,error.status, error.message)
        } 
        else {
            throw new CustomError(500,"error", "Internal server error.")
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

        if(trxGroupMenu.length === 0) throw new CustomError(httpCode.notFound, "success", "Group Menu Tidak Ada")

        return trxGroupMenu
        
    } catch (error : any) {
        if(error instanceof CustomError) {
            throw new CustomError(error.code, error.status,error.message)
        } 
        else {
            throw new CustomError(500, "error",  "Internal server error.")
        }
    }
}

const updateUrut = async (require:UrutanSchema["body"], 
    kode_menu1 : UrutanSchema["params"]["kode_menu1"], 
    kode_group : UrutanSchema["params"]["kode_group"], uch : string) : Promise<any | null> => {
    try {
        

    const exGroupMenu : TrxGroupMenu[] = await TrxGroupMenu.findAll({
        where : {
            kode_group : kode_group, 
            kode_menu1 : kode_menu1
        }
    })

    if(exGroupMenu.length === 0 ) throw new CustomError(httpCode.notFound,"succes", "Group Menu Tidak Ada")

    const  [update, [updateGroup]]= await TrxGroupMenu.update({
        urut : require.urut, 
        uch : uch
    }, {
        where : {
            kode_group : kode_group, 
            kode_menu1 : kode_menu1
        }, 
        returning : true
    })

    if(update === 0 ) throw new CustomError(httpCode.unprocessableEntity,"error", "Nomor Urut Gagal Diubah")

    return updateGroup

    } catch (error : any) {
        if(error instanceof CustomError) {
            throw new CustomError(error.code,error.status, error.message)
        } 
        else {
            throw new CustomError(500,"error", "Internal server error.")
        }
    }
}

const viewMenuByGroup = async (kode_group:string) : Promise<RefMenu1[]> => {
    try {     
        const menuView : RefMenu1[] = await RefMenu1.findAll({
            attributes : [
                "kode_aplikasi" ,
                "kode_menu1" ,
                "nama_menu1" ,
                "keterangan_menu" ,
                "icon" ,
                "link" ,
                "status" ,
                "on_update" ,
                "on_create" ,
                "on_delete" ,
                "on_view" ,
                [
                    sequelize.literal('"TrxGroupMenu"."urut"'), // Use Sequelize's literal function to include the attribute
                    'urut'
                ],
            ],
            include : [
                {
                    model : TrxGroupMenu,
                    as : "TrxGroupMenu",
                    attributes :[], 
                    where : {
                        kode_group : kode_group
                    }
                },
                {
                    model : RefMenu2, 
                    as : "Menu2", 
                    attributes : {exclude : ["ucr", "uch", "udcr", "udch"]},
                    include : [
                        {
                            model : RefMenu3,
                            as : "Menu3", 
                            attributes : {exclude : ["ucr", "uch", "udcr", "udch"]},
                        }
                    ]
                }, 
            ],
            order : [[sequelize.literal('"TrxGroupMenu"."urut"'), 'ASC']]
        })
    
        return menuView
    } catch (error : any) {
        console.log(error);
        
        if(error instanceof CustomError) {
            throw new CustomError(error.code,error.status, error.message)
        } 
        else {
            throw new CustomError(500, "error", "Internal server error.")
        }
    }
}

const countTrxGroupMenu = async () : Promise<any> => {
    try {
        const countGroupMenu : number = await TrxGroupMenu.count()

        return countGroupMenu

    } catch (error : any) {
        if(error instanceof CustomError) {
            throw new CustomError(error.code,error.status, error.message)
        } 
        else {
            throw new CustomError(500,"error", "Internal server error.")
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
    groupMenuAplikasi,
    countTrxGroupMenu,
    updateUrut,
    viewMenuByGroup
}
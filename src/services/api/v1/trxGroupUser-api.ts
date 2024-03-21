import RefGroup from "@models/refGroup-model";
import TrxGroupUser, {TrxGroupUserInput, TrxGroupUserOutput, statusGroupUser} from "@models/trxGroupUser-model";
import RefUser from "@models/refUser-model";
import bcrypt from "bcrypt";
import {
    PayloadTrxGroupUserSchema,
    UpdatedTrxGroupUserSchema,
    GetTrxGroupUserSchema,
    SearchTrxGroupUserSchema, 
    DestroyTrxGroupUserSchema,
    StoresTrxGroupsUserSchema
} from "@schema/api/trxGroupUser-schema"
import db from "@config/database";
import CustomError from "@middleware/error-handler";
import { httpCode } from "@utils/prefix";
import getConfig from "@config/dotenv";
import { Op } from "sequelize";
import e from "cors";

const index = async (
    limit:SearchTrxGroupUserSchema["query"]["limit"],
    page : SearchTrxGroupUserSchema["query"]["page"]) : Promise<TrxGroupUserOutput[]>=> {
    try {
        let pages: number = parseInt(page);
        let limits: number = parseInt(limit);
        let offset = 0;
    
        if (pages > 1) {
            offset = (pages - 1) * limits;
          }

        const trxGroupUser : TrxGroupUser[] = await TrxGroupUser.findAll({
            limit : limits, 
            offset : offset, 
            include : [
                {
                    model : RefGroup, 
                    as : "Group", 
                    attributes : {exclude : ["ucr", "uch","udcr", "udch"]}
                }, 
                {
                    model : RefUser, 
                    as : "User",
                    attributes : {exclude : ["ucr", "uch", "udcr", "udch"]}
                }
            ]
        })

        return trxGroupUser
    } catch (error: any) {
        if(error instanceof CustomError) {
            throw new CustomError(error.code, error.message)
        } 
        else {
            throw new CustomError(500, "Internal server error.")
        }
    }
}

const store = async (require:PayloadTrxGroupUserSchema["body"], token : string) : Promise<TrxGroupUserOutput> => {
    try {
        const kodeGroup = require.kode_group
        const email = require.email
        const password = require.password
        const status = require.status

        const exUser : RefUser | null = await RefUser.findOne({
            where : {
                email : email
            }
        })

        if(!exUser) {
            const t = await db.transaction() 
            try {
                let user
    
                const hasPassword : string = await bcrypt.hash(password, 12) 
    
                const newPassword = status === "pegawai" ? hasPassword : password;
    
                const newUser : RefUser = await RefUser.create({
                    email : email,
                    password : newPassword,
                    api_token : token,
                    is_login : "Y"
                }, {
                    transaction : t
                })
    
                if(!newUser) throw new CustomError(httpCode.found, "[1]Create User Gagal")
    
                const fUser : RefUser | null = await RefUser.findOne({
                    where : {
                        email : email,
                    },
                    transaction : t
                })
    
                if(!fUser) throw new CustomError(httpCode.found, "[2]Create User Gagal")
    
                user = fUser
                const idUser = fUser.id
    
                const exGroupUser : TrxGroupUser | null = await TrxGroupUser.findOne({
                    where : {
                        kode_group : kodeGroup, 
                        id_user : idUser
                    },
                    transaction : t
                })
    
                if(exGroupUser) throw new CustomError(httpCode.found, "User Sudah Terdaftar di Group yang Sama")
    
                const newGroupUser : any | null = await TrxGroupUser.create({
                    kode_group : kodeGroup,
                    id_user : idUser, 
                    status : statusGroupUser.Aktif ,      
                })
    
                await t.commit()
    
                return newGroupUser           
            } catch (error) {
                await t.rollback()
                throw error
            }
        }

        else {
            // Kalau User Sudah Ada
            const exGroup = await RefGroup.findOne({
                where : {
                    kode_group : kodeGroup
                }
            })
            if (!exGroup) throw new CustomError(httpCode.found, "Data Group Tidak Ada")

            const idUser = exUser.id

            const exGroupUser = await TrxGroupUser.findOne({
                where : {
                    kode_group : kodeGroup, 
                    id_user : idUser
                }
            })

            const createGroupUser : TrxGroupUserOutput = await TrxGroupUser.create({
                kode_group : kodeGroup, 
                id_user : idUser, 
                status : statusGroupUser.Aktif,
            })

            if(!createGroupUser) throw new CustomError(httpCode.found, "Data Group Gagal Dibuat")

            return createGroupUser
        }

    } catch (error : any) {
        if(error instanceof CustomError) {
            throw new CustomError(error.code, error.message)
        } 
        else {
            throw new CustomError(500, "Internal server error.")
        }
    }
}

const show = async (id:GetTrxGroupUserSchema["params"]["id"]) : Promise<TrxGroupUserOutput> => {
    try {
        const trxGroupUser : TrxGroupUser | null = await TrxGroupUser.findOne({
            where : {
                id_group_user : id
            }, 
            include : [
                {
                    model : RefGroup, 
                    as : "Group",
                    attributes : {exclude : ["udcr","udch","ucr","uch"]}
                }
            ]
        })

        if (!trxGroupUser) throw new CustomError(httpCode.found, "Data Group UserTidak Ada")

        return trxGroupUser
    } catch (error : any) {
        if(error instanceof CustomError) {
            throw new CustomError(error.code, error.message)
        } 
        else {
            throw new CustomError(500, "Internal server error.")
        }
    }
}

const storeGroups = async (
    require:StoresTrxGroupsUserSchema["body"]) : Promise<TrxGroupUserOutput[]> => {
    const t = await db.transaction()
    try {
        const users = require.users
        const kode_group = users[0].kode_group
        const emails = users.map((em : any) => ({email : em.email}))

        const password = await bcrypt.hash(getConfig("PASS_DEFAULT"), 12)

        let ids 

        const existingUsers : RefUser[] = await RefUser.findAll({
            where : {
                [Op.or] : emails
            }
        })
        let createUser
        if (existingUsers.length === 0) {
            const arrEmail = emails.map((r) => r.email);
            const dataUser = arrEmail.map((r) => ({
                email : r, 
                password : password,
                is_login : "N"
            }));
           createUser = await RefUser.bulkCreate(dataUser, {transaction : t})
        } 
        else if(
            existingUsers.length > 0 &&
            existingUsers.length < users.length
        ) {
            const regEmail = existingUsers.map((r) => r.email);
            const arrEmail = emails.map((r) => r.email)
            const unregEmail = arrEmail.filter(
                (email) => !regEmail.includes(email)
            )

            const dataUser = unregEmail.map((r) => ({
                email : r,
                password : password, 
                isLogin : "N"
            }));
            createUser = await RefUser.bulkCreate(dataUser, {transaction : t})
        } else {
             await Promise.resolve()
        }

        const exUsers : RefUser[] = await RefUser.findAll({
            where : {
                [Op.or] : emails
            }, 
            transaction : t
        })

        ids = exUsers.map((user) => user.id)
        
        const exGroupUser : TrxGroupUser[] = await TrxGroupUser.findAll({
            where : {
                [Op.or] : ids.map((id) => ({id_user : id})),
                kode_group : kode_group
            },
            transaction : t
        })
        let createGroupUser
        if (exGroupUser.length === 0 ) {
            const dataGs = ids.map((r) => ({
                id_user : r,
                kode_group : kode_group,
                status : statusGroupUser.Aktif,
                ucr : ""
            }))
            createGroupUser = await TrxGroupUser.bulkCreate(dataGs, {transaction : t})
        } else if (
            exGroupUser.length > 0 &&
            exGroupUser.length < ids.length
        ) {
            const exIdUser = exGroupUser.map((gs) => gs.id_user)
            const unregGs = ids.filter((id) => !exIdUser.includes(id))
            const dataGs = unregGs.map((r) => ({
                id_user : r,
                kode_group : kode_group,
                status : statusGroupUser.Aktif,
                ucr : ""
            }));
            createGroupUser = await TrxGroupUser.bulkCreate(dataGs, {transaction : t})
        }
        else {
            await Promise.resolve()
        }

        await t.commit() 
        return exGroupUser
    } catch (error : any) {
        t.rollback()
        if(error instanceof CustomError) {
            throw new CustomError(error.code, error.message)
        } 
        else {
            throw new CustomError(500, "Internal server error.")
        }
    }
}


const userByGroup = async (
    id:GetTrxGroupUserSchema["params"]["id_group"]) : Promise<any | null> => {
    try {
        const kode_group = id

        const group : RefGroup[] = await RefGroup.findAll({
            where : {
                kode_group : kode_group
            }, 
            attributes :{exclude : ["kode_aplikasi", "ucr", "uch", "udcr", "udch"]},
            include : [
                {
                    model : TrxGroupUser, 
                    as : "TrxGroupUser", 
                    attributes : {exclude : ["kode_group", "id_user", "ucr", "uch", "udcr", "udch"]},
                    include : [
                        {
                            model : RefUser, 
                            as : "User",
                            attributes : {exclude : ["password", "api_token"]}
                        }
                    ]
                }, 
            ]
        })

        return group
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
    storeGroups,
    userByGroup,
}
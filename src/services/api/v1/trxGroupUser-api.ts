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
    StoresTrxGroupsUserSchema,
    PayloadUserRoleSchema
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


const store = async (require:PayloadTrxGroupUserSchema["body"], token : string, ucr : string) : Promise<TrxGroupUserOutput> => {
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
    
                if(!newUser) throw new CustomError(httpCode.unprocessableEntity, "[1]Create User Gagal")
    
                const fUser : RefUser | null = await RefUser.findOne({
                    where : {
                        email : email,
                    },
                    transaction : t
                })
    
                if(!fUser) throw new CustomError(httpCode.unprocessableEntity, "[2]Create User Gagal")
    
                user = fUser
                const idUser = fUser.id
    
                const exGroupUser : TrxGroupUser | null = await TrxGroupUser.findOne({
                    where : {
                        kode_group : kodeGroup, 
                        id_user : idUser
                    },
                    transaction : t
                })
    
                if(exGroupUser) throw new CustomError(httpCode.unprocessableEntity, "User Sudah Terdaftar di Group yang Sama")
    
                const newGroupUser : any | null = await TrxGroupUser.create({
                    kode_group : kodeGroup,
                    id_user : idUser, 
                    status : statusGroupUser.Aktif ,   
                    ucr : ucr   
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
            if (!exGroup) throw new CustomError(httpCode.unprocessableEntity, "User Sudah Terdaftar di Group yang Samas")

            const idUser = exUser.id

            const exGroupUser = await TrxGroupUser.findOne({
                where : {
                    kode_group : kodeGroup, 
                    id_user : idUser
                }
            })

            if(exGroupUser) throw new CustomError(httpCode.unprocessableEntity, "Data Group Gagal Dibuat")

            const createGroupUser : TrxGroupUserOutput = await TrxGroupUser.create({
                kode_group : kodeGroup, 
                id_user : idUser, 
                status : statusGroupUser.Aktif,
                ucr : ucr
            })

            if(!createGroupUser) throw new CustomError(httpCode.unprocessableEntity, "Data Group Gagal Dibuat")

            return createGroupUser
        }

    } catch (error : any) {
        if(error instanceof CustomError) {
            throw new CustomError(error.code, error.message)
        } 
        else {
            console.log(error)
            throw new CustomError(500, "Internal server error.")
        }
    }
}

const storePegawaiRole = async (
    require:PayloadUserRoleSchema["body"], ucr : string) : Promise<TrxGroupUserOutput> => {
    try {
        const exUser : RefUser | null = await RefUser.findOne({
            where : {
                email : require.email
            }
        })

        if(!exUser) throw new CustomError(httpCode.unprocessableEntity, "Data Pegawai Tidak Tersedia")


        const exGroup = await RefGroup.findOne({
            where : {
                kode_group : require.kode_group
            }
        })
             
        if(!exGroup) throw new CustomError(httpCode.unprocessableEntity, "Role Tidak Tersedia")

        const id_user = exUser.id
        
        const exRole : TrxGroupUserOutput | null = await TrxGroupUser.findOne({
            where : {
                kode_group : require.kode_group, 
                id_user : id_user, 
            }
        })

        if(exRole) throw new CustomError(httpCode.unprocessableEntity, "Email Sudah Terdaftar Pada Role yang Sama")

        const createGroupUser : TrxGroupUserOutput = await TrxGroupUser.create({
            kode_group : require.kode_group, 
            id_user : id_user, 
            status : statusGroupUser.Aktif,
        })

        if(!createGroupUser) throw new CustomError(httpCode.unprocessableEntity, "Data Group Gagal Dibuat")

        return createGroupUser

        
    } catch (error : any) {
        if(error instanceof CustomError) {
            throw new CustomError(error.code, error.message)
        } 
        else {
            console.log(error)
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

        if (!trxGroupUser) throw new CustomError(httpCode.unprocessableEntity, "Data Group UserTidak Ada")

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

const postGroups = async (
    require:StoresTrxGroupsUserSchema["body"] , ucr : string) : Promise <TrxGroupUserOutput[]> => {
    try {
        const users = require.users
        const kode_group = users.map((us : any) => ({kode_group : us.kode_group}))
        const emails = users.map((us : any) => ({email : us.email}))

        console.log(users);

        console.log(emails);

        console.log(kode_group);
        
        
        
        const exUsers : RefUser[] = await RefUser.findAll({
            attributes : ["email", "id"],
            where : {
                [Op.or] : emails
            }, 
            raw : true
        })

        if(exUsers.length === 0 ) throw new CustomError(httpCode.unprocessableEntity, "Email Belum Terdaftar")

        const exGroups : RefGroup[] = await RefGroup.findAll({
            where : {
                [Op.or] : kode_group
            }
        })

        if(exGroups.length === 0) throw new CustomError(httpCode.unprocessableEntity, "Kode Group Belum Tercipta")

        let ids = exUsers.map((user) => user)

        let gs = exGroups.map((group) => group.kode_group)

        console.log("IDS", ids);

        console.log("GS", gs);

        let userArray : any = ids.map(itemId => {
            let found = users.find(itemUsers => itemUsers.email === itemId.email)
            if(found) {
                return {
                    id_user : itemId.id, 
                    kode_group : found.kode_group
                }
            }
        })
                

        const exGroupUser : TrxGroupUser[] = await TrxGroupUser.findAll({
            where : {
                [Op.or] : userArray
            },
            logging : console.log,
            raw : true
        })
    
        // console.log(exGroupUser);
        
        // let GroupUser = 
        

        const exGs = exGroupUser.map((gs) => gs.kode_group)
        const exIds = exGroupUser.map((us) => us.id_user)

        console.log(exGs, exIds);
        


        return []
        
    } catch (error) {
        console.log(error);
        
         if(error instanceof CustomError) {
            throw new CustomError(error.code, error.message)
        } 
        else {
            throw new CustomError(500, "Internal server error.")
        }
    }
}

const storeGroups = async (
    require:StoresTrxGroupsUserSchema["body"], ucr : string) : Promise<TrxGroupUserOutput[]> => {
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
    id:GetTrxGroupUserSchema["params"]["id"]) : Promise<any | null> => {
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

const destroy = async (
    id:DestroyTrxGroupUserSchema["params"]["id"]) : Promise<TrxGroupUserOutput> => {
    try {
        const exTrxGroupUser : TrxGroupUser | null = await TrxGroupUser.findOne({
            where : {
                id_group_user : id
            }
        })

        if(!exTrxGroupUser) throw new CustomError(httpCode.unprocessableEntity, "Tidak Ada Data Group User")

        const destroy = await TrxGroupUser.destroy({
            where : {
                id_group_user : id
            }
        })

        if(destroy === 0) throw new CustomError(httpCode.unprocessableEntity, "Data Gagal Hapus")

        return exTrxGroupUser

    } catch (error : any) {
        if(error instanceof CustomError) {
            throw new CustomError(error.code, error.message)
        } 
        else {
            throw new CustomError(500, "Internal server error.")
        }
    }
}


const countGroupUser = async () : Promise<any> => {
    try {
        const countGroupUser : number = await TrxGroupUser.count()

        return countGroupUser
    } catch (error : any) {
        if(error instanceof CustomError) {
            throw new CustomError(error.code, error.message)
        } 
        else {
            throw new CustomError(500, "Internal server error.")
        }
    }
}

const searchGroupByEmail = async (
    email : string) : Promise <RefUser[]> => {
    try {
        const resultUser : RefUser[] = await RefUser.findAll({
            attributes : ["id","email"],
            where : {
                email : {
                    [Op.like] : `%${email}%`
                }
            },
            include : [
                {
                    model : TrxGroupUser,
                    as : "TrxGroupUser", 
                    required : true,
                    attributes : {exclude : ["udcr","udch","ucr","uch"]}
                }
            ]
        })

        if(resultUser.length === 0 ) throw new CustomError(httpCode.unprocessableEntity, "Hasil Pencarian Tidak Ada")

        return resultUser
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
    destroy,
    storePegawaiRole,
    postGroups,
    countGroupUser,
    searchGroupByEmail
}
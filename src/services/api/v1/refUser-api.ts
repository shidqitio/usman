import RefUser, { RefUserOutput } from "@models/refUser-model";
import {
    PayloadUpdateSchema,
    SearchRefUserSchema,
    SearchParamsSchema
} from "@schema/api/refUser-schema"
import CustomError from "@middleware/error-handler";
import { httpCode } from "@utils/prefix";
import getConfig from "@config/dotenv";
import { removeFile } from "@utils/remove-file";

import { removeByLastNameAplikasi } from "@utils/remove-file";

import fs from "fs/promises"
import RefUserInternal from "@models/refUserInternal-model";
import RefUserExternal from "@models/refUserExternal-model";

import db from "@config/database";

import { Op, QueryTypes } from "sequelize";
import { log } from "console";

const updateUserPhoto = async (
    id:PayloadUpdateSchema["parameter"]["id"],
    file : any
    ) => {
    try {
        const refUser : RefUser | null = await RefUser.findByPk(id, {
            attributes : ["id","email","user_photo"]
        })

        if(!refUser) {
            throw new CustomError(httpCode.unprocessableEntity, "Data Tidak Ada")
        }

        let data_photo


        if(file && file.filename) {
            if(refUser.user_photo !== null ) {
                let lastName = await removeByLastNameAplikasi(String(refUser.user_photo)) 
                await fs.unlink(`D:/Dev SIPPP/PMO/public/images/userphoto/${lastName}`)
            }

            const PUBLIC_FILE_GIRO = `${getConfig("USMAN_BASE_URL")}${getConfig("PUBLIC_FILE_IMAGE_PROFIL")}${file.filename}`;
      
            data_photo = PUBLIC_FILE_GIRO;
        }

    

        const [update, [updateUser]] = await RefUser.update({
            user_photo : data_photo
        }, {
            
            where : {
                id : id
            },
            returning : true
        })

        const updatedRefUser : RefUser | null = await RefUser.findByPk(id, {
            attributes : ["id","email","user_photo"]
        })
        
        if(update === 0) throw new CustomError(httpCode.unprocessableEntity, "Data Gagal Update")


        return updatedRefUser
    } catch (error : any) {
        if (error instanceof CustomError) {
            if (file && file.path) {
              await removeFile(file.path);
            }
        throw new CustomError(500, error.message)
    }
        else {
            throw new CustomError(500, error.message)
        }
    }
}

const userProfile = async (id_user : number) : Promise<RefUserOutput> => {
    try {
                
        const userProfile : RefUserOutput[] = await db.query(`
        SELECT a.id, a.email, a.user_photo, a.status_user, COALESCE(b.username, c.username) AS username FROM ref_user a 
        LEFT JOIN ref_user_external b ON a.id = b.id_user 
        LEFT JOIN ref_user_internal c ON a.id = c.id_user
        WHERE a.id = :id_user
        `, {
            type : QueryTypes.SELECT, 
            replacements  : {
                id_user : id_user
            }
        })

    
        

        return userProfile[0]
    } catch (error) {
        if(error instanceof CustomError) {
            throw new CustomError(error.code, error.message)
        } 
        else {
            throw new CustomError(500, "Internal server error.")
        }
    }
}

const refUser = async (
    page:SearchRefUserSchema["query"]["page"],
    limit:SearchRefUserSchema["query"]["limit"], 
) : Promise<any> => {
    try {
        let pages: number = parseInt(page);
        let limits: number = parseInt(limit);
        let offset = 0;
    
        if (pages > 1) {
          offset = (pages - 1) * limits;
        }

        const refUserData : RefUser[] = await db.query(`
        SELECT a.id, a.email, a.is_login, COALESCE(b.username, c.username) AS username FROM ref_user a 
        LEFT JOIN ref_user_external b ON a.id = b.id_user 
        LEFT JOIN ref_user_internal c ON a.id = c.id_user
        limit (:limit)
        offset (:offset)
        `, {
            type : QueryTypes.SELECT, 
            replacements  : {
                limit : limits, 
                offset : offset
            }
        })

              

        // const refUser : RefUser[] = await RefUser.findAll({
        //     attributes : {exclude : ["ucr", "uch", "udcr", "udch", "api_token", "password", "forget_token_pass"]},
        //     include : [
        //         {
        //             model : RefUserInternal,
        //             as : "RefUserInternal", 
        //             attributes : ["username"]
        //         }
        //     ],
        //     limit : limits, 
        //     offset : offset
        // })


        return refUserData
    } catch (error : any) {
        console.log(error);
        
        if(error instanceof CustomError) {
            throw new CustomError(error.code, error.message)
        } 
        else {
            throw new CustomError(500, "Internal server error.")
        }
    }
}

const searchParams = async (
    email:SearchParamsSchema["params"]["email"]) : Promise<RefUserOutput> => {
    try {
        const refUser : RefUser | null= await RefUser.findOne({
            where : {
                email : email
            },
            attributes :   ["id", "email", "user_photo", "status_user"],
            include : [
                {
                    model : RefUserInternal, 
                    as : "RefUserInternal",
                    attributes : {exclude : ["udcr", "udch", "ucr", "uch"]}
                }
            ]
        })

        if(!refUser) throw new CustomError(httpCode.unprocessableEntity, "Email Tidak Ditemukan")

        return refUser
    } catch (error : any) {
        if(error instanceof CustomError) {
            throw new CustomError(error.code, error.message)
        } 
        else {
            throw new CustomError(500, "Internal server error.")
        }
    }
}

const countRefUser = async () : Promise <any> => {
    try {
        const countData : number = await RefUser.count()

        return countData
    } catch (error) {
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
            attributes : ["id","email", "is_login", "user_photo","status_user"],
            where : {
                email : {
                    [Op.like] : `%${email}%`
                }
            },
        })

        if(resultUser.length === 0 ) throw new CustomError(httpCode.unprocessableEntity, "Hasil Pencarian Tidak Ada")

        return resultUser
     } catch (error : any) {
        console.log(error);
        
        if(error instanceof CustomError) {
            throw new CustomError(error.code, error.message)
        } 
        else {
            throw new CustomError(500, "Internal server error.")
        }
    }
}

const searchEmail = async (email : string) : Promise<RefUserOutput[]> => {
    try {
        
        const resultUser : RefUser[] = await RefUser.findAll({
            attributes : ["id","email", "is_login", "user_photo","status_user"],
            where : {
                email : email 
            },
        })

        return resultUser
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
    updateUserPhoto,
    userProfile,
    refUser,
    searchParams,
    countRefUser,
    searchGroupByEmail,
    searchEmail
}
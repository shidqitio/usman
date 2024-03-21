import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import axios from "axios"
import { QueryTypes, Op } from "sequelize"

import db from "@config/database"
import RefAplikasi, {Status} from "@models/refAplikasi-model"
import RefUser, { RefUserOutput } from "@models/refUser-model"
import TrxGroupUser from "@models/trxGroupUser-model"
import RefGroup from "@models/refGroup-model"
import RefTokenApp from "@models/refTokenApp-model"

import CustomError from "@middleware/error-handler"
import getConfig from "@config/dotenv"
import pysha256enc from "@utils/pyencrypt"
import generateHeaderWithSignature from "@utils/signature"
import moment from "moment"

import {
    PayloadAksesSchema,
    PayloadUserGroupSchema,
    PayloadCheckToken
} from "@schema/api/akses-schema"
import { httpCode } from "@utils/prefix"
import RefMenu1 from "@models/refMenu1-model"
import RefMenu2 from "@models/refMenu2-model"
import RefMenu3 from "@models/refMenu3-model"

const register = async (
    require:PayloadAksesSchema["body"]) : Promise<RefUserOutput> => {
    try {
        const email = require.email
        const password = require.password

        const pw = await  bcrypt.hash(password, 12)

        const registUser = await RefUser.create({
            email : email, 
            password : pw
        })

        if(!registUser) throw new CustomError(httpCode.found, "User Gagal Dibuat")

        return registUser
    } catch (error) {
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
          } else {
            throw new CustomError(500, "Internal server error.");
          }
    }
}

const login = async (
    require:PayloadAksesSchema["body"]) : Promise<any | null> => {
    try {
        const email = require.email
        const password = require.password
        

        const existUser : RefUser | null = await RefUser.findOne({
            where : {
                email : email
            }
        })

        if(!existUser) throw new CustomError(httpCode.found, "Email Tidak Ditemukan")

        const passwordExist : any = existUser.password

        const credential = bcrypt.compare(password, passwordExist)

        if(!credential) throw new CustomError(httpCode.notAcceptable, "Password Salah")

        const exist = await db.query(`
        SELECT a.nama_aplikasi, a.kode_aplikasi, a.keterangan, a.status, a.images, a.url, a.url_token
          FROM ref_aplikasi as a
          JOIN ref_group as b ON b.kode_aplikasi = a.kode_aplikasi
          JOIN trx_group_user as c ON c.kode_group = b.kode_group
          WHERE c.id_user = (:id)
          GROUP BY a.kode_aplikasi
        `, {
            replacements : {id : existUser.id},
            type : QueryTypes.SELECT
        })

        if(exist.length === 0) throw new CustomError(httpCode.found, "User Tidak Memiliki Akses Ke Aplikasi")

        const ids = exist.map((i : any) => i.kode_aplikasi)
        const aps = await RefAplikasi.findAll({
            where : {
                kode_aplikasi : {
                    [Op.notIn] : ids,
                }
            }
        })

        const newAps = aps.map((ap) => {
            return {
                kode_aplikas : ap.kode_aplikasi,
                nama_aplikasi : ap.nama_aplikasi,
                keterangan : ap.keterangan,
                status : Status.Tampil,
                images : ap.images
            }
        })

        const aksesApp = [...exist,...newAps]

        const token = jwt.sign(
            {
                id_user : existUser.id
            },
            getConfig("SECRET_KEY"),
            {expiresIn : "24h"}
        )

        await RefUser.update({
            is_login : "Y",
            api_token : token
        }, {
            where : {
                email : email
            }
        })

        const data = {
            token : token,
            user  : {
                id_user : existUser.id,
                email : existUser.email,
                is_login : existUser.is_login
            },
            aplikasi : aksesApp
        }
        
        return data

    } catch (error) {
      console.log(error)
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
          } else {
            throw new CustomError(500, "Internal server error.");
          }
    }
}

const postToken = async (
    require:PayloadUserGroupSchema["body"], token_input : string) : Promise <any | null> => {
    try {
        const id_user = require.id_user
        const kode_group = require.kode_group

        const groupUser : TrxGroupUser | null = await TrxGroupUser.findOne({
            where : {
                id_user : id_user, 
                kode_group : kode_group
            }
        })

        if(!groupUser) throw new CustomError(httpCode.found, "[1]User Tidak Memiliki Group User")

        const app : RefAplikasi[] = await db.query(`
          SELECT c.url_token
          FROM trx_group_user as a
          JOIN ref_group as b ON a.kode_group = b.kode_group
          JOIN ref_aplikasi as c ON b.kode_aplikasi = c.kode_aplikasi
          WHERE a.id_user = (:user)
          AND a.kode_group = (:group)
        `, {
            replacements: { user: groupUser.id_user, group: groupUser.kode_group },
            type: QueryTypes.SELECT,
        })
        if(app.length === 0) throw new CustomError (httpCode.found, "[2]User Tidak Memiliki Group Aplikasi")
        
        const url_token  = app[0].url_token
        const token = token_input
        console.log(token)
        const data = {
            id_user : id_user, 
            kode_group : kode_group, 
            token : token
        }

        const resToken = await postTokenApp(url_token, data)

        if(!resToken) throw new CustomError(httpCode.found, "[1]Gagal Post Token")

        const response = resToken.data
        let result
        if(response.status === "Success") {
            result = {
                id_user : groupUser.id_user,
                kode_group : groupUser.kode_group,
                status : "success"
            }
        } 
        else {
            result = {
                status : "Failed",
                error : "[2]Gagal Post Token"
            }
        }
    } catch (error : any) {
      console.log(error)
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
          } else {
            throw new CustomError(500, "Internal server error.");
          }
    }
}

const getMenuApp = async (
    require : PayloadUserGroupSchema["body"]) : Promise<any | null> => {
    try {
        const id_user = require.id_user
        const kode_group = require.kode_group

        const groupUser = await TrxGroupUser.findOne({
            where : {
                id_user : id_user, 
                kode_group : kode_group
            }
        })

        if(!groupUser) throw new CustomError(httpCode.found, "Group User Tidak Ada")

        const token_app = await bcrypt.hash(String(groupUser.id_user), 12)

        const existUser : RefTokenApp[] = await RefTokenApp.findAll({
            where : {
                id_user : id_user, 
                kode_group : groupUser.kode_group
            }
        })

        if(existUser.length > 0 ) {
            const ids = existUser.map((item) => item.id) 
            await RefTokenApp.destroy({
                where : {
                    id : ids
                }
            })
        }

        const newId = `${id_user}${kode_group}`
        const newToken = await RefTokenApp.create({
            id : newId,
            id_user : groupUser.id_user,
            kode_group : groupUser.kode_group,
            token : token_app
        })

        if(!newToken) throw new CustomError(httpCode.found, "Gagal Membuat Token")

        const app : RefAplikasi[] = await db.query(
            `
            SELECT c.kode_aplikasi, c.nama_aplikasi, c.keterangan
              FROM trx_group_user as a 
              JOIN ref_group as b ON a.kode_group = b.kode_group
              JOIN ref_aplikasi as c ON b.kode_aplikasi = c.kode_aplikasi
              WHERE a.id_user = (:user)
              AND a.kode_group = (:group)
              `,
            {
              replacements: { user: groupUser.id_user, group: groupUser.kode_group },
              type: QueryTypes.SELECT,
            }
          );
      
          const menu1 : RefMenu1[] = await db.query(
            `
            SELECT c.kode_menu1, c.nama_menu1, c.link, c.icon, c.on_update, c.on_create, c.on_delete, c.on_view
              FROM trx_group_user as a 
              JOIN trx_group_menu as b ON a.kode_group = b.kode_group
              JOIN ref_menu1 as c ON b.kode_menu1 = c.kode_menu1
              WHERE a.id_user = (:user)
              AND b.kode_group = (:group)
              GROUP BY c.kode_menu1
            `,
            {
              replacements: { user: groupUser.id_user, group: groupUser.kode_group },
              type: QueryTypes.SELECT,
            }
          );
      
          const menu2 : RefMenu2[] = await db.query(
            `SELECT d.kode_menu1, c.kode_menu2, c.nama_menu2, c.icon, c.link, c.on_update, c.on_create, c.on_delete, c.on_view
              FROM trx_group_user as a 
              JOIN trx_group_menu as b ON a.kode_group = b.kode_group
              JOIN ref_menu1 as d ON b.kode_menu1 = d.kode_menu1
              JOIN ref_menu2 as c ON b.kode_menu2 = c.kode_menu2
              WHERE a.id_user = (:user)
              AND b.kode_group = (:group)
              GROUP BY c.kode_menu2, d.kode_menu1
             `,
            {
              replacements: { user: groupUser.id_user, group: groupUser.kode_group },
              type: QueryTypes.SELECT,
            }
          );
      
          const menu3 : RefMenu3[] = await db.query(
            `SELECT d.kode_menu1, c.kode_menu2, e.kode_menu3, e.nama_menu3, e.icon, e.link, e.on_update, e.on_create, e.on_delete, e.on_view
              FROM trx_group_user as a
              JOIN trx_group_menu as b ON a.kode_group = b.kode_group
              JOIN ref_menu1 as d ON b.kode_menu1 = d.kode_menu1
              JOIN ref_menu2 as c ON b.kode_menu2 = c.kode_menu2
              JOIN ref_menu3 as e ON b.kode_menu3 = e.kode_menu3
              WHERE a.id_user = (:user)
              AND b.kode_group = (:group)
              GROUP BY d.kode_menu1, c.kode_menu2, e.kode_menu3
              `,
            {
              replacements: { user: groupUser.id_user, group: groupUser.kode_group },
              type: QueryTypes.SELECT,
            }
          );

          let data : any = {
            kode_aplikasi : app[0].kode_aplikasi,
            nama_aplikasi : app[0].nama_aplikasi,
            keterangan : app[0].keterangan,
            menu : []
          }

          menu1.map((a) => {
            let m2 : any = [];
            data.menu.push({
                kode_menu1: a.kode_menu1,
                nama_menu1: a.nama_menu1,
                icon: a.icon,
                link: a.link,
                on_update: a.on_update,
                on_create: a.on_create,
                on_delete: a.on_delete,
                on_view: a.on_view,
                menu2: m2,
              });
            
            menu2.map((b) => {
                let m3 : any = []
                if(b.kode_menu1 === a.kode_menu1) {
                    m2.push({
                        kode_menu2: b.kode_menu2,
                        nama_menu2: b.nama_menu2,
                        icon: b.icon,
                        link: b.link,
                        on_update: b.on_update,
                        on_create: b.on_create,
                        on_delete: b.on_delete,
                        on_view: b.on_view,
                        menu3: m3,
                    })
                }

                menu3.map((c) => {
                    if (b.kode_menu2 === c.kode_menu2) {
                        m3.push({
                            kode_menu3: c.kode_menu3,
                            nama_menu3: c.nama_menu3,
                            icon: c.icon,
                            link: c.link,
                            on_update: c.on_update,
                            on_create: c.on_create,
                            on_delete: c.on_delete,
                            on_view: c.on_view,
                          });
                    }
                })
            })      
          })

          const akses : RefAplikasi[] = await db.query(
            `SELECT a.nama_aplikasi, a.kode_aplikasi, a.keterangan, c.status, a.images, a.url
              FROM ref_aplikasi as a
              JOIN ref_group as b ON b.kode_aplikasi = a.kode_aplikasi
              JOIN trx_group_user as c ON c.kode_group = b.kode_group
              WHERE c.id_user = (:id)`,
            {
              replacements: { id: groupUser.id_user },
              type: QueryTypes.SELECT,
            }
          );

          if(akses.length === 0) throw new CustomError(httpCode.found, "User Tidak Memiliki Akses Aplikasi")

          const ids = akses.map((i) => i.kode_aplikasi)
          const aps = await RefAplikasi.findAll({
            where : {
                kode_aplikasi : {
                    [Op.notIn] : ids
                }
            }
          })

          const newAps = aps.map((ap) => {
            return {
              kode_aplikasi: ap.kode_aplikasi,
              nama_aplikasi: ap.nama_aplikasi,
              keterangan: ap.keterangan,
              status: "0",
              images: ap.images,
            };
          });

          const dataUser : RefUser | null = await RefUser.findOne({
            where : {
                id : groupUser.id_user
            }
          })

          const dataGroup  : RefGroup | null = await RefGroup.findOne({
            where : {
                kode_group : kode_group
            }
          })

          const aksesApp = [...akses,...newAps]
          const params = {
            data : data,
            aplikasi : aksesApp, 
            user : {
                id_user : dataUser?.id,
                email : dataUser?.email,
                kode_group : dataGroup?.kode_group,
                nama_groupp : dataGroup?.nama_group
            }, 
            token : token_app
          }

          return params

    } catch (error : any) {
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
          } else {
            throw new CustomError(500, "Internal server error.");
          }
    }
}

const checkToken = async (
  require:PayloadCheckToken["body"]) : Promise<any | null> => {
    try {
      const idUser = require.id_user
      const kodeGroup = require.kode_group
      const token = require.token

      const exTokenApp : RefTokenApp | null = await RefTokenApp.findOne({
        where : {
          id_user : idUser,
          kode_group : kodeGroup,
          token : token
        }
      })

      if(!exTokenApp) throw new CustomError(httpCode.unauthorized, "Token Not Match")

      const exUser : RefUser | null = await RefUser.findOne({
        where : {
          id : idUser
        }, 
        attributes : {
          exclude : ["password"]
        }
      })

      if(!exUser) throw new CustomError(httpCode.found, "User Tidak Terdaftar")

    } catch (error : any) {
      if (error instanceof CustomError) {
        throw new CustomError(error.code, error.message);
      } else {
        throw new CustomError(500, "Internal server error.");
      }
    }
}

const logout = async (
  require:PayloadCheckToken["body"]) : Promise<any | null> => {
  try {
      const id_user = require.id_user
      const kode_group = require.kode_group
      const token = require.token

      const exUser : RefUser | null =  await RefUser.findOne({
        where : {id : id_user}
      })
      if(!exUser) throw new CustomError(httpCode.found, "User Tidak Ada")

      const update = await RefUser.update({
        is_login : "Y"
      }, {
        where : {
          id : id_user
        }
      })

      if(kode_group && token) {
        await RefTokenApp.destroy({
          where : {
            token : token,
            id_user : id_user, 
            kode_group : kode_group
          }
        })
      } else {
        await RefTokenApp.destroy({
          where : {
            id_user : id_user
          }
        })
      }

      if(update[0] === 0) throw new CustomError(httpCode.notFound, "Data Gagal Update")

      return RefUser
  } catch (error) {
    if (error instanceof CustomError) {
      throw new CustomError(error.code, error.message);
    } else {
      throw new CustomError(500, "Internal server error.");
    }
  }
}

const postTokenApp = async (url_token : any, data : any) => {
    const method = "POST";
    const body = {
      id_user: data.id_user,
      kode_group: data.kode_group,
      token: `Bearer ${data.token}`,
    };
    
    const headers : any = await generateHeaderWithSignature.generateHeaderWithSignature(method, url_token, body);
  
    return await axios.post(url_token, body, {
      headers: headers,
    });
  };
  

export default {
  register,
  login,
  postToken,
  getMenuApp,
  checkToken,
  logout
}
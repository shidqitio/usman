import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import axios from "axios"
import { QueryTypes, Op } from "sequelize"

import db from "@config/database"
import RefAplikasi, {RefAplikasiOutput, Status} from "@models/refAplikasi-model"
import RefUser, { RefUserOutput, StatusUser } from "@models/refUser-model"
import TrxGroupUser, { TrxGroupUserInput, statusGroupUser } from "@models/trxGroupUser-model"
import RefGroup from "@models/refGroup-model"
import RefTokenApp from "@models/refTokenApp-model"
import RefUserInternal from "@models/refUserInternal-model"
import RefUserExternal from "@models/refUserExternal-model"

import CustomError from "@middleware/error-handler"
import getConfig from "@config/dotenv"
import pysha256enc from "@utils/pyencrypt"
import generateHeaderWithSignature from "@utils/signature"
import moment from "moment"
import CryptoJS from "crypto-js"
import decryptData from "@middleware/decrypt/token"

import {
    PayloadAksesSchema,
    PayloadUserGroupSchema,
    PayloadCheckToken, 
    PayloadEmailAksesSchema, 
    PayloadChangePasswordSchema,
    PayloadLogoutSchema,
    PayloadRefreshTokenSchema,
    RefreshTokenLandingSchema,
    PayloadEmailAplikasiSchema,
    PayloadRegisterExternalSchema
} from "@schema/api/akses-schema"
import { httpCode } from "@utils/prefix"
import RefMenu1 from "@models/refMenu1-model"
import RefMenu2 from "@models/refMenu2-model"
import RefMenu3 from "@models/refMenu3-model"

import nodemailer from "nodemailer"



const register = async (
    require:PayloadAksesSchema["body"]) : Promise<RefUserOutput> => {
    const t = await db.transaction()
    try {
        const email = require.email
        const password = require.password
        const username = require.username
        const nip = require.nip
        const status_user = StatusUser.internal

        const pw  = await  bcrypt.hash(password, 12)

        const registUser = await RefUser.create({
            email : email, 
            password : pw,
            status_user : status_user
        }, {transaction : t})

        if(!registUser) throw new CustomError(httpCode.unprocessableEntity, "User Gagal Dibuat")

        const registUserInternal = await RefUserInternal.create({
          id_user : registUser.id,
          username : username, 
          nip : nip
        }, {transaction : t})

        if (!registUserInternal) throw new CustomError(httpCode.unprocessableEntity, "User Gagal Didaftarkan")

        const hasil_akhir : RefUser | null = await RefUser.findOne({
          attributes : {exclude : ["udcr", "udch", "ucr", "uch", "password"]},
          include : [
            {
              model : RefUserInternal, 
              as : "RefUserInternal", 
              attributes : ["username", "nip"],
              
            }
          ],
          transaction : t
        })

        console.log(hasil_akhir);
        

        if(!hasil_akhir) throw new CustomError(httpCode.unprocessableEntity, "Hasil Gagal Dikeluarkan")

        await t.commit()

        return hasil_akhir
    } catch (error : any) {
      console.log(error);
      
      await t.rollback()
        if (error instanceof CustomError) {
            throw new CustomError(error.code, error.message);
          } else {
            throw new CustomError(500, "Internal server error.");
          }
    }
}


const HTML_TEMPLATE = (text : any) => {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>NodeMailer Email Template</title>
        <style>
          .container {
            width: 100%;
            height: 100%;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .email {
            width: 80%;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
          }
          .email-header {
            background-color: #333;
            color: #fff;
            padding: 20px;
            text-align: center;
          }
          .email-body {
            padding: 20px;
          }
          .email-footer {
            background-color: #333;
            color: #fff;
            padding: 20px;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="email">
            <div class="email-header">
              <h1>EMAIL HEADER</h1>
            </div>
            <div class="email-body">
              <p>${text}</p>
            </div>
            <div class="email-footer">
              <p>EMAIL FOOTER</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

const registerExternal = async (
  require:PayloadRegisterExternalSchema["body"]) : Promise<RefUser> => {
  const t = await db.transaction()
  try {
      const id = require.id
      const email = require.email
      const password = require.password
      const username = require.username
      const statusPengguna = require.statusPengguna
      const status_user = StatusUser.eksternal

      

      const checkEmailAvail = await RefUser.findOne({
        where : {
          email : email
        }
      })

      if (checkEmailAvail) throw new CustomError(httpCode.unprocessableEntity, "Email Sudah Terdaftar")

      const registUser = await RefUser.create({
          email      : email,
          password   : password,
          status_user: status_user
      }, {transaction : t})

      if(!registUser) throw new CustomError(httpCode.unprocessableEntity, "User Gagal Dibuat")

        const registUserExternal = await RefUserExternal.create({
          id             : id,
          id_user        : registUser.id,
          username       : username,
          status_pengguna: statusPengguna
        }, {transaction : t})

        if(!registUserExternal) throw new CustomError(httpCode.unprocessableEntity, "User External Gagal Didaftarkan")

          const hasil_akhir : RefUser | null = await RefUser.findOne({
            attributes : {exclude : ["udcr", "udch", "ucr", "uch", "password"]},
            include : [
              {
                model : RefUserExternal, 
                as : "RefUserExternal", 
                attributes : ["username", "status_pengguna"],
              }
            ],
            where : {
              id : registUser.id
            },
            transaction : t
          })
          
          if(!hasil_akhir) throw new CustomError(httpCode.unprocessableEntity, "Hasil Gagal Dikeluarkan")
 
          const trxGroupUser : TrxGroupUserInput = await TrxGroupUser.create({
            kode_group: 'G00.4',
            id_user   : registUser.id,
            status    : statusGroupUser.Aktif
          }, {transaction : t})

          if(!trxGroupUser) throw new CustomError(httpCode.unprocessableEntity, "User Gagal Didaftarkan")


          await t.commit()
    
          return hasil_akhir

  } catch (error) {
    console.log(error);
    
    await t.rollback()
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

        if(!existUser) throw new CustomError(httpCode.unprocessableEntity, "Email Tidak Ditemukan")

        const passwordExist : any = existUser.password

        const credential = await bcrypt.compare(password, passwordExist)


        if(!credential) throw new CustomError(httpCode.notAcceptable, "Password Salah")

        const exist = await db.query(`
        SELECT a.nama_aplikasi, a.kode_aplikasi, a.keterangan, a.status,  CONCAT('${getConfig('USMAN_BASE_URL')}', '${getConfig('PUBLIC_FILE_IMAGE')}', a.images) as images,
          a.url, a.url_token
          FROM ref_aplikasi as a
          JOIN ref_group as b ON b.kode_aplikasi = a.kode_aplikasi
          JOIN trx_group_user as c ON c.kode_group = b.kode_group
          WHERE c.id_user = (:id)
          GROUP BY a.kode_aplikasi
        `, {
            replacements : {id : existUser.id},
            type : QueryTypes.SELECT
        })

        if(exist.length === 0) throw new CustomError(httpCode.unprocessableEntity, "User Tidak Memiliki Akses Ke Aplikasi")

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
                images : `${getConfig('USMAN_BASE_URL')}${getConfig('PUBLIC_FILE_IMAGE')}${ap.images}`
            }
        })

        const aksesApp = [...exist,...newAps]

        console.log(exist);
        

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

const getAplikasiByEmail = async (
  require:PayloadEmailAksesSchema["body"]) : Promise<any | null> => {
  try {
    const email = require.email

    const exUser = await RefUser.findOne({
      where : {
        email : email
      }
    })

    if(!exUser) throw new CustomError(httpCode.unprocessableEntity, "User Tidak Ada")

    const akses = await db.query(`
              SELECT a.kode_aplikasi, a.nama_aplikasi, a.kode_aplikasi, a.keterangan, d."status",  
              CONCAT('${getConfig('USMAN_BASE_URL')}', '${getConfig('PUBLIC_FILE_IMAGE')}', a.images) as images,
               a.url
              FROM ref_aplikasi  a
              JOIN ref_group  b ON b.kode_aplikasi = a.kode_aplikasi
              JOIN trx_group_user d ON d.kode_group = b.kode_group
              WHERE d.id_user = (:id)
              AND d."status" = '1'
              GROUP BY a.kode_aplikasi, d."status"
    `, {
      replacements : {id : exUser.id},
      type : QueryTypes.SELECT
    })

    if(akses.length === 0 ) throw new CustomError(httpCode.unprocessableEntity, "User Tidak Memiliki Akses");

    const ids  = akses.map((i : any) => i.kode_aplikasi);
    const aps = await RefAplikasi.findAll({
      where: {
        kode_aplikasi: {
          [Op.notIn]: ids,
        },
      },
    });

    const newAps = aps.map((ap) => {
      return {
        kode_aplikasi : ap.kode_aplikasi,
        nama_aplikasi : ap.nama_aplikasi, 
        keterangan : ap.keterangan, 
        status : "0", 
        images : `${getConfig('USMAN_BASE_URL')}/${getConfig('PUBLIC_FILE_IMAGE')}${ap.images}`
      }
    })

    const aksesApp = [...akses, ...newAps]

    return aksesApp
  } catch (error : any) {
    if (error instanceof CustomError) {
      throw new CustomError(500, error.message)
}
  else {
      throw new CustomError(500, error.message)
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

        if(!groupUser) throw new CustomError(httpCode.unprocessableEntity, "[1]User Tidak Memiliki Group User")

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
        if(app.length === 0) throw new CustomError (httpCode.unprocessableEntity, "[2]User Tidak Memiliki Group Aplikasi")
        
        const url_token  = app[0].url_token
        console.log(url_token);
        
        const token = token_input
        console.log(token)
        const data = {
            id_user : id_user, 
            kode_group : kode_group, 
            token : token
        }

        const resToken = await postTokenApp(url_token, data)

        if(!resToken) throw new CustomError(httpCode.unprocessableEntity, "[1]Gagal Post Token")

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
    require : PayloadUserGroupSchema["body"], token_user : string) : Promise<any | null> => {
    try {
        const id_user = require.id_user
        const kode_group = require.kode_group

        const groupUser : any  = await TrxGroupUser.findOne({
            where : {
                id_user : id_user, 
                kode_group : kode_group
            },
            include : [
              {
                model : RefGroup, 
                as : "Group", 
                attributes : ["kode_group", "kode_level"]
              }
            ],
        }) 




        if(!groupUser) throw new CustomError(httpCode.unprocessableEntity, "Group User Tidak Ada")

        


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

        //CEK USER LEVEL 
        const UserLevel = groupUser.Group?.kode_level

        //CEK LEVEL TO ENCRYPT DATA 
        let sendHash
        let hash : any
        if(UserLevel === 1) {
          hash  = CryptoJS.AES.encrypt(token_app, getConfig("SECRET_KEY_LVL1"))
          sendHash = hash.toString()
          
        }
        if (UserLevel === 2) {
          hash  = CryptoJS.AES.encrypt(token_app, getConfig("SECRET_KEY_LVL2"))
          sendHash = hash.toString()
        }
        if(UserLevel === 3) {
          hash  = CryptoJS.AES.encrypt(token_app, getConfig("SECRET_KEY_LVL3"))
          sendHash = hash.toString()
        }
        if(UserLevel === 4) {
          hash  = CryptoJS.AES.encrypt(token_app, getConfig("SECRET_KEY_LVL4"))
          sendHash = hash.toString()
        }
        if(UserLevel === 5) {
          hash  = CryptoJS.AES.encrypt(token_app, getConfig("SECRET_KEY_LVL5"))
          sendHash = hash.toString()
        }

        // //#################### GENERATED DECRYPT ########################

        // let decrypt : any = CryptoJS.AES.decrypt(hash, getConfig("SECRET_KEY_LVL1"))
        
        // // Convert decrypted ciphertext to a WordArray
        // let decryptedWordArray = CryptoJS.lib.WordArray.create(decrypt.words, decrypt.sigBytes);

        // // Convert WordArray to string
        // let decryptedText = CryptoJS.enc.Utf8.stringify(decryptedWordArray);

        // console.log(decryptedText)

        // //############################################################################
                

        const newId = `${id_user}${kode_group}`
        const newToken = await RefTokenApp.create({
            id : newId,
            id_user : groupUser.id_user,
            kode_group : groupUser.kode_group,
            token : token_app
        })

        if(!newToken) throw new CustomError(httpCode.unprocessableEntity, "Gagal Membuat Token")

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
            SELECT c.kode_menu1, c.nama_menu1, c.link, c.icon, c.on_update, c.on_create, c.on_delete, c.on_view, b.urut
              FROM trx_group_user as a 
              JOIN trx_group_menu as b ON a.kode_group = b.kode_group
              JOIN ref_menu1 as c ON b.kode_menu1 = c.kode_menu1
              WHERE a.id_user = (:user)
              AND b.kode_group = (:group)
              GROUP BY c.kode_menu1, b.urut
              ORDER BY
              b.urut NULLS LAST
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
            `SELECT a.nama_aplikasi, a.kode_aplikasi, a.keterangan, c.status,  CONCAT('${getConfig('USMAN_BASE_URL')}', '${getConfig('PUBLIC_FILE_IMAGE')}', a.images) as images,
              a.url
              FROM ref_aplikasi as a
              JOIN ref_group as b ON b.kode_aplikasi = a.kode_aplikasi
              JOIN trx_group_user as c ON c.kode_group = b.kode_group
              WHERE c.id_user = (:id)`,
            {
              replacements: { id: groupUser.id_user },
              type: QueryTypes.SELECT,
            }
          );

          if(akses.length === 0) throw new CustomError(httpCode.unprocessableEntity, "User Tidak Memiliki Akses Aplikasi")

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
              images: `${getConfig('USMAN_BASE_URL')}/${getConfig('PUBLIC_FILE_IMAGE')}${ap.images}`
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
            token_old : token_user,
            token : sendHash
          }

          return params

    } catch (error : any) {
      console.log(error)
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
      const level = require.level

      const token_final = await decryptData(token, level)
      
      console.log( "TES TOKEN FINAL :", token_final)

      if(!token_final) {
        throw new CustomError(401, "User Not Authenticate")
      }

      const exTokenApp : RefTokenApp | null = await RefTokenApp.findOne({
        where : {
          id_user : idUser,
          kode_group : kodeGroup,
          token : token_final,
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

      if(!exUser) throw new CustomError(httpCode.unprocessableEntity, "User Tidak Terdaftar")

      return exUser

    } catch (error : any) {
      if (error instanceof CustomError) {
        throw new CustomError(error.code, error.message);
      } else {
        throw new CustomError(500, "Internal server error.");
      }
    }
}

const logout = async (
  require:PayloadLogoutSchema["body"]) : Promise<any | null> => {
  try {
      const id_user = require.id_user
      const kode_group = require.kode_group
      const token = require.token

      const exUser : RefUser | null =  await RefUser.findOne({
        where : {id : id_user}
      })
      if(!exUser) throw new CustomError(httpCode.unprocessableEntity, "User Tidak Ada")

      const update = await RefUser.update({
        is_login : "N "
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

      if(update[0] === 0) throw new CustomError(httpCode.unprocessableEntity, "Data Gagal Update")

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

const changePassword = async (
  request:PayloadChangePasswordSchema["body"]) : Promise<RefUser> => {
try {
  const email = request.email
  const password_lama = request.password_lama
  const password_baru = request.password_baru

  const exUser : RefUser | null = await RefUser.findOne({
    where : {
      email : email
    }
  })

  if(!exUser) throw new CustomError(httpCode.unprocessableEntity, "User Tidak Terdaftar")

  const validasi = await bcrypt.compare(password_lama, String(exUser.password))

  if(!validasi) throw new CustomError(httpCode.unprocessableEntity, "Password Tidak Sesuai")

  let newPassword = await bcrypt.hash(password_baru, 12);

  const [updatedRows, [updateResult]] = await RefUser.update({
    password : newPassword
  }, {
    where : {
      email : email
    },
    returning : true
  })

  if(updatedRows === 0 ) throw new CustomError(httpCode.unprocessableEntity, "Password Gagal Update")

  return updateResult
} catch (error) {
    if (error instanceof CustomError) {
      throw new CustomError(error.code, error.message);
    } else {
      throw new CustomError(500, "Internal server error.");
    }
  }
}

const forgetPassword = async (
  request:PayloadEmailAksesSchema["body"]) : Promise<any | null> => {
  try {
    const email = request.email

    const checkEmail : RefUser | null = await RefUser.findOne({
      where : {
        email : email
      }
    })

    if(!checkEmail) throw new CustomError(httpCode.unprocessableEntity, "Email Tidak Terdaftar");

    const token = jwt.sign(
      {
          id_user : checkEmail.id
      },
      getConfig("SECRET_KEY"),
      {expiresIn : "24h"}
     )

      await RefUser.update({
        forget_token_pass : token
      }, {
        where : {
          email : email
        }
      })
    
      const transporter =  nodemailer.createTransport({
        pool: true,
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // use TLS
        auth: {
          user: "williejenkis02@gmail.com",
          pass: "alvaromorata",
        },
      })

      // verify connection configuration
       transporter.verify(function (error, success) {
        if (error) {
          console.log(error);
        } else {
          console.log("Server is ready to take our messages");
        }
      });


    const mailOption = {
      from : `williejenkins02@gmail.com`,
      to : `shidqitio@gmail.com`, 
      subject : `Test Email`,
      text : `SEND DATA WITH TOKEN ${token}`
    }

    transporter.sendMail(mailOption, (error, info) => {
      if(error) {
        console.log(`Error Sending Email`, error)
      } else {
        console.log(`Success`, info)
      }
    })

    const data = {
      token : token, 
      user : {
        email : checkEmail.email
      }
    }

    return data
  } catch (error: any) {
    if (error instanceof CustomError) {
      throw new CustomError(error.code, error.message);
    } else {
      console.log(error);
      throw new CustomError(500, "Internal server error.");
    }
  }
}

const refreshToken = async (
  require:PayloadRefreshTokenSchema["body"]) : Promise<any | null > => {
  const t = await db.transaction()
  try {
    const idUser = require.id_user
    const kodeGroup = require.kode_group
    const token = require.token
    const token_lama = require.token_lama

    const tokenVerify : any = token_lama.split(" ")[1] 

    const level : RefGroup | null = await RefGroup.findOne({
      attributes : ["kode_level"],
      where : {
        kode_group : kodeGroup
      }
    })

    if(!level?.kode_level) throw new CustomError(httpCode.unprocessableEntity, "Kode Level Gagal Didapat")
    

    let decodeToken : any ;

    try {
      decodeToken  = jwt.verify(tokenVerify, getConfig("SECRET_KEY"))
    } catch (error) {
      throw new CustomError(httpCode.unauthorized, "[1] Token Unauthorized")
    }

    const checkTokenAwal : RefUser | null  = await  RefUser.findOne({
      where : {
        id : decodeToken.id_user, 
      }, 
      transaction : t
    })

    if(!checkTokenAwal) throw new CustomError(httpCode.unauthorized, "[2] Token Unauthorized")

    const token_final = await decryptData(token, level.kode_level)

    if(!token_final) {
      throw new CustomError(httpCode.unauthorized, "Unauthorized")
    }

    const exTokenApp : RefTokenApp | null = await RefTokenApp.findOne({
      where : {
        id_user : idUser,
        kode_group : kodeGroup,
        token : token_final,
      },
      transaction : t
    })

    if(!exTokenApp) throw new CustomError(httpCode.unauthorized, "[3] Token Baru Unauthorized")

      const tokenLamaUpdated = jwt.sign(
        {
            id_user : checkTokenAwal.id
        },
        getConfig("SECRET_KEY"),
        {expiresIn : "24h"}
    )

    if(!tokenLamaUpdated) throw new CustomError(httpCode.unprocessableEntity, "Token Lama Gagal Di Generate")

    checkTokenAwal.api_token = tokenLamaUpdated

    await checkTokenAwal.save({
      transaction : t
    })

    const existUserTokenApp : RefTokenApp[] = await RefTokenApp.findAll({
      where : {
        kode_group : kodeGroup,
        id_user : idUser
      }
    })

    if(existUserTokenApp.length > 0) {
      const ids = existUserTokenApp.map((item) => item.id)
      await RefTokenApp.destroy({
        where : {
          id : ids
        }, 
        transaction : t
      })
    }

    const token_app = await bcrypt.hash(String(idUser), 12)

    const newId = `${idUser}${kodeGroup}`
    const newToken = await RefTokenApp.create({
        id : newId,
        id_user : idUser,
        kode_group : kodeGroup,
        token : token_app
    }, {
      transaction : t
    })

    if(!newToken) throw new CustomError(httpCode.unprocessableEntity, "Gagal Membuat Token")

    const newTokenApp : RefTokenApp | null = await RefTokenApp.findOne({
      where : {
        id_user : idUser
      }, 
      transaction : t
    })

    if(!newTokenApp) throw new CustomError(httpCode.unprocessableEntity, "Token App Baru Tidak Ada")

    if(!newTokenApp.token) throw new CustomError (httpCode.unprocessableEntity, "Token Aplikasi Tidak Ditemukan")

     //CEK LEVEL TO ENCRYPT DATA 
     let sendHash
     let hash : any
     if(level.kode_level === 1) {
       hash  = CryptoJS.AES.encrypt(newTokenApp.token, getConfig("SECRET_KEY_LVL1"))
       sendHash = hash.toString()
       
     }
     if (level.kode_level === 2) {
       hash  = CryptoJS.AES.encrypt(newTokenApp.token, getConfig("SECRET_KEY_LVL2"))
       sendHash = hash.toString()
     }


    await t.commit()  

    const response = {
      id_user : idUser,
      kode_group : kodeGroup, 
      token_old : checkTokenAwal.api_token,
      token : sendHash
    }    

    return response
  } catch (error : any) {
    if (error instanceof CustomError) {
      throw new CustomError(error.code, error.message);
    } else {
      throw new CustomError(500, "Internal server error.");
    }
  }
}

const refreshTokenLanding = async (
  request:RefreshTokenLandingSchema["body"]) : Promise<any | null> => {
  try {
    const token = request.token

    const tokenVerify : any = token.split(" ")[1]

    let decodeToken : any ;

    try {
      decodeToken  = jwt.verify(tokenVerify, getConfig("SECRET_KEY"), {
        ignoreExpiration : true
      })
    } catch (error) {
      throw new CustomError(httpCode.unauthorized, "[1] Token Unauthorized")
    }
    
    console.log(decodeToken);
    

    const checkTokenAwal : RefUser | null  = await  RefUser.findOne({
      where : {
        id : decodeToken.id_user, 
      },
    })

    if(!checkTokenAwal) throw new CustomError(httpCode.unauthorized, "User Unauthorized")

    const updatedToken = jwt.sign(
      {
          id_user : checkTokenAwal.id
      },
      getConfig("SECRET_KEY"),
      {expiresIn : "24h"}
  )

  if(!updatedToken) throw new CustomError(httpCode.unprocessableEntity, "Token Lama Gagal Di Generate")

  const [countUbahToken, resultUbahToken] = await RefUser.update({
    api_token : updatedToken
  }, {
    where : {
      id : decodeToken.id_user
    },
    returning : true,
    
  })

  if(countUbahToken === 0) throw new CustomError(httpCode.unprocessableEntity, "Ubah Data Gagal") 

  console.log(resultUbahToken);
  

  return resultUbahToken
  } catch (error : any) {
    if (error instanceof CustomError) {
      throw new CustomError(error.code, error.message);
    } else {
      throw new CustomError(500, "Internal server error.");
    }
  }
}

const roleByAplikasiEmail = async (
    email:PayloadEmailAplikasiSchema["params"]["email"],
    kode_aplikasi : PayloadEmailAplikasiSchema["params"]["kode_aplikasi"]) : Promise <any> => {
    try {
      const roleUser : TrxGroupUser[] = await TrxGroupUser.findAll({
        where : {
          "$Group.kode_aplikasi$" : kode_aplikasi,
          "$User.email$" : email
        }, 
        attributes : ["id_group_user", "kode_group", "id_user", "status"],
        include : [
          {
            model : RefGroup, 
            as : "Group",
            attributes : ["nama_group", "kode_aplikasi"]
          }, 
          {
            model : RefUser, 
            as : "User",
            attributes : []
          }
        ],
      })

      // console.log(roleUser);
      

      if(roleUser.length === 0) throw new CustomError(httpCode.unprocessableEntity, "Role User Tidak Terdaftar")

      return roleUser
    } catch (error : any) {
      // console.log(error);
      
      if (error instanceof CustomError) {
        throw new CustomError(error.code, error.message);
      } else {
        console.log(error);
        
        throw new CustomError(500, "Internal server error.");
      }
    }
  }
  

export default {
  register,
  login,
  postToken,
  getAplikasiByEmail,
  getMenuApp,
  checkToken,
  logout,
  changePassword,
  forgetPassword,
  refreshToken,
  refreshTokenLanding,
  roleByAplikasiEmail,
  registerExternal
}
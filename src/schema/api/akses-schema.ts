import {z} from "zod"

const payloadEmailPassword = {
    body : z.object({
        email : z.string({
            required_error : "Email Tidak Boleh Kosong",
            invalid_type_error : "Email Harus Huruf"
        }).email(),
        password : z.string({
            required_error : "Password Tidak Boleh Kosong",
            invalid_type_error : "Password Harus String"
        }), 
    }), 
}

const payloadUserGroup = {
    body : z.object({
        id_user : z.number({
            required_error : "Id User Tidak Boleh Kosong",
            invalid_type_error : "Id User Harus Angka"
        }).optional(),
        kode_group : z.string({
            required_error : "Kode_Group Tidak Boleh Kosong",
            invalid_type_error : "Kode_group Harus String"
        }).optional(),
    })
}

const payloadCheckToken = {
    body : z.object({
        id_user : z.number({
            required_error : "Id User Tidak Boleh Kosong",
            invalid_type_error : "Id User Harus Angka"
        }),
        kode_group : z.string({
            required_error : "Kode_Group Tidak Boleh Kosong",
            invalid_type_error : "Kode_group Harus String"
        }),
        token : z.string({
            required_error : "token Tidak Boleh Kosong",
            invalid_type_error : "token Harus String"
        }), 
        level : z.number({
            required_error : "Level Tidak Boleh Kosong",
            invalid_type_error : "Level Harus Angka"
        })
    })
}

const payloadUserAplikasi = {
    body : z.object({
        id_user : z.number({
            required_error : "Id User Tidak Boleh Kosong",
            invalid_type_error : "Id User Harus Angka"
        }),
        kode_aplikasi : z.string({
            required_error : "kode_aplikasi Tidak Boleh Kosong",
            invalid_type_error : "kode_aplikasi Harus Angka"
        })
    })
}

const payloadEmail = {
    body : z.object({
        email : z.string({
            required_error : "Email Tidak Boleh Kosong",
            invalid_type_error : "Email Harus Email"
        }).email()
    })
}

export const payloadAksesSchema = z.object({
    ...payloadEmailPassword
}) 

export const payloadUserGroupAksesSchema = z.object({
    ...payloadUserGroup
})

export const payloadCheckTokenAksesSchema = z.object({
    ...payloadCheckToken
})

export const payloadUserAplikasiAksesSchema = z.object({
    ...payloadUserAplikasi
})

export const payloadEmailAksesSchema = z.object({
    ...payloadEmail
})

export type PayloadAksesSchema = z.infer<typeof payloadAksesSchema>
export type PayloadUserGroupSchema = z.infer<typeof payloadUserGroupAksesSchema>
export type PayloadCheckToken = z.infer<typeof payloadCheckTokenAksesSchema>
export type PayloadUserAplikasiAksesSchema = z.infer<typeof payloadUserAplikasiAksesSchema>
export type PayloadEmailAksesSchema = z.infer<typeof payloadEmailAksesSchema>
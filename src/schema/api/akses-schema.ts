import {z} from "zod"
import { statusPengguna } from "@models/refUserExternal-model"

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
        nip : z.string({
            required_error : "Nip Tidak Boleh Kosong", 
            invalid_type_error : "Nip Harus String"
        }),
        username : z.string({
            required_error : "Username Tidak Boleh Kosong", 
            invalid_type_error : "Username Harus String"
        })
    }), 
}

const payloadRegisterExternal = {
    body : z.object({
        email : z.string({
            required_error : "Email Tidak Boleh Kosong",
            invalid_type_error : "Email Harus String"
        }).email("Harus Email"), 
        password : z.string({
            required_error : "Password Tidak Boleh Kosong",
            invalid_type_error : "Password Harus String"
        }), 
        statusPengguna : z.nativeEnum(statusPengguna),
        username : z.string({
            required_error : "Username Tidak Boleh Kosong",
            invalid_type_error : "Username Harus String"
        })
    })
}


const payloadLogin = {
    body : z.object({
        email : z.string({
            invalid_type_error : "Email Harus Huruf"
        }).email(), 
        password : z.string({
            required_error : "Password Tidak Boleh Kosong",
            invalid_type_error : "Password Harus String"
        })
    })
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

const payloadChangePassword = {
    body : z.object({
        email : z.string({
            required_error : "Email Tidak Boleh Kosong",
            invalid_type_error : "Email harus email"
        }).email(),
        password_lama : z.string({
            required_error : "password_lama Tidak Boleh Kosong",
            invalid_type_error : "password_lama harus password_lama"
        }),
        password_baru : z.string({
            required_error : "password_baru Tidak Boleh Kosong",
            invalid_type_error : "password_baru harus password_baru"
        })
    })
}

const payloadLogout = {
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
    })
}

const payloadRefreshToken = {
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
        token_lama : z.string({
            required_error : "token lama Tidak Boleh Kosong",
            invalid_type_error : "token lama Harus String"
        })
    })
}

const payloadCheckOtp = {
    body : z.object({
        email : z.string({
            required_error : "Email Tidak Boleh Kosong",
            invalid_type_error : "Email Harus String"
        }).email("Harus Format Email"),
        otp : z.string({
            required_error : "OTP Tidak Boleh Kosong",
            invalid_type_error : "OTP Harus String"
        }).max(6, "Maksimal 6 Karakter")
    })
}

const refreshTokenLanding = {
    body : z.object({
        token : z.string({
            required_error : "Token Tidak Boleh Kosong",
            invalid_type_error : "Token Harus String"
        })
    })
}

const payloadEmailAplikasi = {
    params : z.object({
        email : z.string({
            required_error : "Email Tidak Boleh Kosong",
            invalid_type_error : "Email Harus String"
        }).email(),
        kode_aplikasi : z.string({
            required_error : "Kode Aplikasi Tidak Boleh Kosong",
            invalid_type_error : "Kode Aplikasi Harus String"
        })
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

export const payloadChangePasswordSchema = z.object({
    ...payloadChangePassword
})

export const payloadLogoutSchema = z.object({
    ...payloadLogout,
    
})

export const payloadRefreshTokenSchema = z.object({
    ...payloadRefreshToken
})

export const refreshTokenLandingSchema = z.object({
    ...refreshTokenLanding
})

export const payloadLoginSchema = z.object({
    ...payloadLogin
})

export const payloadEmailAplikasiSchema = z.object({
    ...payloadEmailAplikasi
})

export const payloadRegisterExternalSchema = z.object({
    ...payloadRegisterExternal
})

export const payloadCheckOtpSchema = z.object({
    ...payloadCheckOtp
})

export type PayloadAksesSchema = z.infer<typeof payloadAksesSchema>
export type PayloadUserGroupSchema = z.infer<typeof payloadUserGroupAksesSchema>
export type PayloadCheckToken = z.infer<typeof payloadCheckTokenAksesSchema>
export type PayloadUserAplikasiAksesSchema = z.infer<typeof payloadUserAplikasiAksesSchema>
export type PayloadEmailAksesSchema = z.infer<typeof payloadEmailAksesSchema>
export type PayloadLogoutSchema = z.infer<typeof payloadLogoutSchema>
export type PayloadChangePasswordSchema = z.infer<typeof payloadChangePasswordSchema>
export type PayloadRefreshTokenSchema = z.infer<typeof payloadRefreshTokenSchema>
export type RefreshTokenLandingSchema = z.infer<typeof refreshTokenLandingSchema>
export type PayloadLoginSchema = z.infer<typeof payloadLoginSchema>
export type PayloadEmailAplikasiSchema = z.TypeOf<typeof payloadEmailAplikasiSchema>
export type PayloadRegisterExternalSchema = z.TypeOf<typeof payloadRegisterExternalSchema>
export type PayloadCheckOtpSchema = z.TypeOf<typeof payloadCheckOtpSchema>
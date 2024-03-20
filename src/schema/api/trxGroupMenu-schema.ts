import {object, z} from "zod"
import { Akses } from "@models/trxGroupMenu-model"

const payload = {
    body : z.object({
        kode_aplikasi : z.string({
            required_error : "kode_aplikasi Tidak Boleh Kosong",
            invalid_type_error : "kode_aplikasi Harus String"
        }),
        kode_group : z.string({
            required_error : "Kode Group Tidak Boleh Kosong",
            invalid_type_error : "Kode Group Harus String"
        }),
        kode_menu1 : z.string({
            required_error : " kode_menu1 Tidak Boleh Kosong",
            invalid_type_error : " kode_menu1 Harus String"
        }),
        kode_menu2 : z.string({
            required_error : "kode_menu2 Tidak Boleh Kosong",
            invalid_type_error : "kode_menu2 Harus String"
        }),
        kode_menu3 : z.string({
            required_error : "kode_menu3 Tidak Boleh Kosong",
            invalid_type_error : "kode_menu3 Harus String"
        }),
        akses  : z.nativeEnum(Akses).refine((value) => {
            if( (
                value === Akses.Aktif || 
                value === Akses.TidakAktif
            )) {
                return true;
            }
            else {
                return false;
            }
        }),
        ucr  : z.string({
            required_error : "ucr Tidak Boleh Kosong",
            invalid_type_error : "ucr Harus String"
        }),
    })
}

const updated = {
    body : z.object({
        kode_group : z.string({
            required_error : "Kode Group Tidak Boleh Kosong",
            invalid_type_error : "Kode Group Harus String"
        }),
        kode_menu1 : z.string({
            required_error : " kode_menu1 Tidak Boleh Kosong",
            invalid_type_error : " kode_menu1 Harus String"
        }),
        kode_menu2 : z.string({
            required_error : "kode_menu2 Tidak Boleh Kosong",
            invalid_type_error : "kode_menu2 Harus String"
        }),
        kode_menu3 : z.string({
            required_error : "kode_menu3 Tidak Boleh Kosong",
            invalid_type_error : "kode_menu3 Harus String"
        }),
        akses  : z.nativeEnum(Akses).refine((value) => {
            if( (
                value === Akses.Aktif || 
                value === Akses.TidakAktif
            )) {
                return true;
            }
            else {
                return false;
            }
        }),
        uch  : z.string({
            required_error : "uch Tidak Boleh Kosong",
            invalid_type_error : "uch Harus String"
        }),
    }),
    params : z.object({
        id : z.number({
            required_error : "Id Tidak Boleh Kosong",
            invalid_type_error : "Id harus Integer"
        })
    })
}

const destroy = {
    params : z.object({
        id : z.number({
            required_error : "Id Tidak Boleh Kosong",
            invalid_type_error : "Id harus Integer"
        })
    })
}

const paramater = {
    params : z.object({
        id : z.number({
            required_error : "Id Tidak Boleh Kosong",
            invalid_type_error : "Id harus Integer"
        })
    })
}

const query = {
    query: z.object({
      page: z.string({
        required_error: "page boleh kosong",
        invalid_type_error: "page harus huruf",
      }),
      limit: z.string({
        required_error: "limit tidak boleh kosong",
        invalid_type_error: "limit harus huruf",
      }),
    }),
  };

export const payloadTrxGroupMenuSchema = object({
    ...payload
})

export const updatedTrxGroupMenuSchema = object({
    ...updated
})

export const destroyTrxGroupMenuSchema = object({
    ...destroy
})

export const getTrxGroupMenuSchema = object({
    ...paramater
})

export const searchTrxGroupMenuSchema = object({
    ...query
})


export type PayloadTrxGroupMenuSchema = z.infer<typeof payloadTrxGroupMenuSchema>
export type UpdatedTrxGroupMenuSchema = z.infer<typeof updatedTrxGroupMenuSchema>
export type DestroyTrxGroupMenuSchema = z.infer<typeof destroyTrxGroupMenuSchema>
export type GetTrxGroupMenuSchema = z.infer<typeof getTrxGroupMenuSchema>
export type SearchTrxGroupMenuSchema = z.infer<typeof searchTrxGroupMenuSchema>
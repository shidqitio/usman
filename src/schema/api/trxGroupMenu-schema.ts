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
        ucr  : z.string({
            required_error : "ucr Tidak Boleh Kosong",
            invalid_type_error : "ucr Harus String"
        }).optional(),
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
        }).optional(),
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

const paramAplikasi = {
    params : z.object({
        id : z.string({
            required_error : "Kode Aplikasi Tidak Boleh Kosong",
            invalid_type_error : "Koode Aplikasi harus String"
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

const aplikasilevel = {
    params : z.object({
        kode_aplikasi : z.string({
            required_error : "kode_aplikasi tidak boleh kosong ",
            invalid_type_error : "kode_aplikasi harus string"
        }), 
        kode_level : z.string({
            required_error : "kode_level tidak boleh kosong", 
            invalid_type_error : "kode_level harus integer"
        })
    })
}

const urutan = {
    body : z.object({
        urut : z.number({
            invalid_type_error : "Nomor Urut Harus Angka"
        }).optional()
    }),
    params : z.object({
        kode_menu1 : z.string({
            required_error : "Kode Menu 1 Harus String",
            invalid_type_error : "Kode Menu 1 Harus String"
        }),
        kode_group : z.string({
            required_error : "Kode Group Harus Diisi", 
            invalid_type_error : "Kode Group Harus String"
        })
    })
}

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

export const getAplikasiByIdSchema = object({
    ...paramAplikasi
})

export const searchTrxGroupMenuSchema = object({
    ...query
})

export const aplikasilevelSchema = object({
    ...aplikasilevel
})

export const urutSchema = object({
    ...urutan
})


export type PayloadTrxGroupMenuSchema = z.infer<typeof payloadTrxGroupMenuSchema>
export type UpdatedTrxGroupMenuSchema = z.infer<typeof updatedTrxGroupMenuSchema>
export type DestroyTrxGroupMenuSchema = z.infer<typeof destroyTrxGroupMenuSchema>
export type GetTrxGroupMenuSchema = z.infer<typeof getTrxGroupMenuSchema>
export type SearchTrxGroupMenuSchema = z.infer<typeof searchTrxGroupMenuSchema>
export type GetAplikasiByIdSchema = z.infer<typeof getAplikasiByIdSchema>
export type AplikasiLevelSchema = z.infer<typeof aplikasilevelSchema>
export type UrutanSchema = z.TypeOf<typeof urutSchema>
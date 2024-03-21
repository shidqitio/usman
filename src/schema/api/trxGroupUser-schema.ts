import {object, z} from "zod"
import { statusGroupUser } from "@models/trxGroupUser-model"

const payload = {
    body : z.object({
        kode_group : z.string({
            required_error : "kode_group Tidak Boleh Kosong",
            invalid_type_error : "kode_group Harus String"
        }),
        email : z.string({
            required_error : "email Tidak Boleh Kosong",
            invalid_type_error : "email Harus Huruf"
        }),
        password : z.string({
            required_error : "password Tidak Boleh Kosong",
            invalid_type_error : "password Harus Angka"
        }),
        status : z.string({
            required_error : "status Tidak Boleh Kosong",
            invalid_type_error : "status Harus String"
        }),
    })
}

const payloadUser = {
    body : z.object({

    })
}

const payloadUsersSchema = {
    body : z.object({
        kode_group : z.string({
            required_error : "kode_group Tidak Boleh Kosong",
            invalid_type_error : "kode_group Harus String"
        }),
        email : z.string({
            required_error : "email Tidak Boleh Kosong",
            invalid_type_error : "email Harus String"
        }).email()
    })
}

const payloadUserArraySchema = {
    body : z.object({
        users : z.array(payloadUsersSchema["body"]), 
    })
}

const update = {
    body : z.object({
        kode_group : z.string({
            required_error : "kode_group Tidak Boleh Kosong",
            invalid_type_error : "kode_group Harus String"
        }),
        id_user : z.number({
            required_error : "id_user Tidak Boleh Kosong",
            invalid_type_error : "id_user Harus Angka"
        }),
        status : z.string({
            required_error : "status Tidak Boleh Kosong",
            invalid_type_error : "status Harus String"
        }),
    }), 
    params : z.object({
        id : z.number({
            required_error : "Id Tidak Boleh Kosong",
            invalid_type_error : "Id Harus angka"
        })
    })
}

const destroy = {
    params : z.object({
        id : z.number({
            required_error : "Id Tidak Boleh Kosong",
            invalid_type_error : "Id Harus angka"
        })
    })
}

const parameter = {
    params : z.object({
        id : z.number({
            required_error : "Id Tidak Boleh Kosong",
            invalid_type_error : "Id harus Integer"
        }), 
        id_group : z.string({
            required_error : "Id_Group Tidak Boleh Kosong",
            invalid_type_error : "Id_Group harus Integer"
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

export const payloadTrxGroupUserSchema = object({
    ...payload
})

export const updatedTrxGroupUserSchema = object({
    ...update
})

export const storesTrxGroupUserSchema = object({
    ...payloadUserArraySchema
})

export const destroyTrxGroupUserSchema = object({
    ...destroy
})

export const getTrxGroupUserSchema = object({
    ...parameter
})

export const searchTrxGroupUserSchema = object({
    ...query
})


export type PayloadTrxGroupUserSchema = z.infer<typeof payloadTrxGroupUserSchema>
export type StoresTrxGroupsUserSchema = z.infer<typeof storesTrxGroupUserSchema>
export type UpdatedTrxGroupUserSchema = z.infer<typeof updatedTrxGroupUserSchema>
export type DestroyTrxGroupUserSchema = z.infer<typeof destroyTrxGroupUserSchema>
export type GetTrxGroupUserSchema = z.infer<typeof getTrxGroupUserSchema>
export type SearchTrxGroupUserSchema = z.infer<typeof searchTrxGroupUserSchema>
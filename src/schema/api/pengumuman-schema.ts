import {StatusPengumuman} from "@models/refPengumuman-model"
import {object, z} from "zod"

const payload = {
    body : z.object({
        judul_pengumuman : z.string({
            required_error : "Judul Pengumuman Harus Diisi",
            invalid_type_error : "Judul Penguguman Harus String"
        }), 
        isian_pengumuman : z.string({
            required_error : "Isian Pengumuman Harus Diisi",
            invalid_type_error : "Isian Pengumuman Harus Text"
        })
    })
}

const query = {
    query : z.object({
        page : z.string({
            required_error : "Page Tidak Boleh Kosong",
            invalid_type_error : "Page Harus String"
        }),
        limit : z.string({
            required_error : "Limit Tidak Boleh Kosong",
            invalid_type_error : "Limit Harus String"
        })
    })
}

export const payloadSchema = object({
    ...payload
})

export const querySchema = object({
    ...query
})

export type PayloadPengumumanSchema = z.TypeOf<typeof payloadSchema>

export type QueryPengumumanSchema = z.TypeOf<typeof querySchema>
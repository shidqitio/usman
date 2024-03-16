import {z} from "zod";

const payload = {
    body : z.object({
        nama_group : z.string({
            required_error : "nama_group tidak boleh kosong",
            invalid_type_error : "nama_group harus huruf"
        }),
        kode_aplikasi : z.string({
            required_error : "kode_aplikasi tidak boleh kosong",
            invalid_type_error : "kode_aplikasi harus huruf"
        }),
        kode_level : z.number({
            required_error : "kode_level tidak boleh kosong",
            invalid_type_error : "kode_level harus huruf"
        }),
        ucr : z.string({
            required_error : "kode_level tidak boleh kosong",
            invalid_type_error : "kode_level harus huruf"
        }).nullable(),
    }),
};




export const payloadRefGroupSchema = z.object({
    ...payload
})

export type PayloadRefGroupSchema = z.infer<typeof payloadRefGroupSchema>
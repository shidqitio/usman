import {z} from "zod";

const payloadJabatan = {
    body : z.object({
        kode_jabatan_atasan : z.string({
            invalid_type_error : "kode_jabatan_atasan harus string"
        }).optional(),
        nama_jabatan : z.string({
            required_error : "nama_jabatan harus diisi",
            invalid_type_error : "nama_jabatan harus string"
        })
    })
}

const parameter = {
    params : z.object({
        id : z.string({
            required_error : "Id Tidak Boleh Kosong",
            invalid_type_error : "Id Harus String"
        })
    })
}


export const payloadJabatanSchema = z.object({
    ...payloadJabatan
})

//Reusable 
export const parameterSchema = z.object({
    ...parameter
})


export type PayloadJabatanSchema = z.TypeOf<typeof payloadJabatanSchema>

export type ParameterSchema = z.TypeOf<typeof parameterSchema>
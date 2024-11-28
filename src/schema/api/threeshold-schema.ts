import {object, z} from "zod"

//Reusable
const parameter = {
    params : z.object({
        id : z.string({
            required_error : "Id Tidak Boleh Kosong",
            invalid_type_error : "Id Harus String"
        })
    })
}

//Reusable
export const parameterSchema = object({
    ...parameter
})

//Reusable 
export type ParameterSchema = z.TypeOf<typeof parameterSchema>
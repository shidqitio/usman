import {z} from "zod";

const payloadUpdate = {
    body : z.object({
        email : z.string({
            required_error : "email Tidak Boleh Kosong",
            invalid_type_error : "Harus String"
        }),
        password : z.string({
            required_error : "password Tidak Boleh Kosong",
            invalid_type_error : "Harus String"
        }),
        is_login : z.string({
            required_error : "is_login Tidak Boleh Kosong",
            invalid_type_error : "Harus String"
        }),
        uch : z.string({
            required_error : "uch Tidak Boleh Kosong",
            invalid_type_error : "Harus String"
        }),
        user_photo : z.string({
            required_error : "user_photo Tidak Boleh Kosong",
            invalid_type_error : "Harus String"
        }),
    }).partial({uch : true, user_photo : true}),
    parameter : z.object({
        id : z.string({
            required_error : "Id Tidak Boleh Kosong",
            invalid_type_error : "Id harus String"
        })
    })
}

export const payloadUpdateSchema = z.object({
    ...payloadUpdate
})

export type PayloadUpdateSchema = z.infer<typeof payloadUpdateSchema>
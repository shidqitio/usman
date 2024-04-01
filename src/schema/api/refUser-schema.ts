import {z} from "zod";

const payloadUpdate = {
    parameter : z.object({
        id : z.number({
            required_error : "Id Tidak Boleh Kosong",
        })
    })
}

export const payloadUpdateSchema = z.object({
    ...payloadUpdate
})

export type PayloadUpdateSchema = z.infer<typeof payloadUpdateSchema>
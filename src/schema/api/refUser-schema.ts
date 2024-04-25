import {z} from "zod";

const payloadUpdate = {
    parameter : z.object({
        id : z.number({
            required_error : "Id Tidak Boleh Kosong",
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

const searchParams = {
  params : z.object({
    email : z.string({
      required_error : "Email Tidak Boleh Kosong",
      invalid_type_error : "Harus Email"
    }).email()
  })
}

export const payloadUpdateSchema = z.object({
    ...payloadUpdate
})

export const searchRefUserSchema = z.object({
    ...query
})

export const searchParamsSchema = z.object({
  ...searchParams
})

export type PayloadUpdateSchema = z.infer<typeof payloadUpdateSchema>
export type SearchRefUserSchema = z.infer<typeof searchRefUserSchema>
export type SearchParamsSchema = z.infer<typeof searchParamsSchema>
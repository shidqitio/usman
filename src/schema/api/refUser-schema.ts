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

const searchParamsUnit = {
  body : z.object({
    kode_unit : z.string({
      required_error : "Kode Unit Tidak Boleh Kosong",
      invalid_type_error : "Kode Unit Harus String"
    })
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
export const searchParamsUnitSchema = z.object({
  ...searchParamsUnit
})

export type PayloadUpdateSchema = z.infer<typeof payloadUpdateSchema>
export type SearchRefUserSchema = z.infer<typeof searchRefUserSchema>
export type SearchParamsSchema = z.infer<typeof searchParamsSchema>
export type SearchParamsUnitSchema = z.infer<typeof searchParamsUnitSchema>
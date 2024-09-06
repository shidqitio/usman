import {Status} from "@models/refAplikasi-model"
import { TypeOf, nativeEnum, number, object, string, z } from "zod";


const payload = {
    body : z.object({
        nama_aplikasi : z.string({
            required_error : "nama_aplikasi tidak boleh kosong",
            invalid_type_error : "nama_aplikasi harus huruf"
        }),
        status : z.nativeEnum(Status).refine((value) => {
            if (
                value === Status.Tampil || 
                value === Status.Tidak_Tampil
            ) {
                return true;
            }
            else {
                return false;
            }
        }),
        keterangan : z.string({
            invalid_type_error : "Keterangan harus huruf"
        }).nullable(),
        url : z.string({
            required_error : "url tidak boleh kosong",
            invalid_type_error : "url harus huruf"
        }),
        url_token : z.string({
            required_error : "url tidak boleh kosong",
            invalid_type_error : "url harus huruf"
        }), 
        ucr : z.string({
            invalid_type_error : "ucr Harus String"
        }).optional()
    }).partial({url_token:true, keterangan:true}),
};

const updated = {
    body : z.object({
        nama_aplikasi : z.string({
            required_error : "nama_aplikasi tidak boleh kosong",
            invalid_type_error : "nama_aplikasi harus huruf"
        }),
        keterangan : z.string({
            required_error : "keterangan tidak boleh kosong",
            invalid_type_error : "keterangan harus huruf"
        }),
        status : z.nativeEnum(Status).refine((value) => {
            if (
                value === Status.Tampil || 
                value === Status.Tidak_Tampil
            ) {
                return true;
            }
            else {
                return false;
            }
        }),
        url : z.string({
            required_error : "url tidak boleh kosong",
            invalid_type_error : "url harus huruf"
        }),
        url_token : z.string({
            required_error : "url_token tidak boleh kosong",
            invalid_type_error : "url_token harus huruf"
        }),
        uch : z.string({
            invalid_type_error : "UCH Harus String"
        }).optional()
    }),
    params : z.object({
        id : z.string({
            required_error : "id tidak boleh kosong",
            invalid_type_error : "id harus string"
        })
    })
}

const parameter = {
    params : z.object({
        id : string({
            required_error : "Data Tidak Boleh Kosong",
            invalid_type_error : "Data Harus String"
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


export const postRefAplikasiSchema = z.object({
    ...payload
})

export const updatedRefAplikasiSchema = z.object({
    ...updated
})

export const getRefAplikasiSchema = z.object({
    ...parameter
})

export const querySchema = z.object({
    ...query
})

export type PostRefAplikasiSchema = z.infer<typeof postRefAplikasiSchema>;
export type UpdatedRefAplikasiSchema = z.infer<typeof updatedRefAplikasiSchema>;
export type GetRefAplikasiSchema = z.infer<typeof getRefAplikasiSchema>
export type QuerySchema = z.infer<typeof querySchema>

import {nativeEnum, object, z} from "zod";
import { statusOn } from "@models/refMenu1-model";

const payload = {
    body : z.object({
        kode_aplikasi : z.string({
            required_error : "kode_aplikasi tidak boleh kosong",
            invalid_type_error : "kode_aplikasi harus huruf"
        }),
        kode_level : z.number({
            required_error : "kode_level tidak boleh kosong",
            invalid_type_error : "kode_level harus angka"
        }),
        nama_menu1 : z.string({
            required_error : "nama_menu1 tidak boleh kosong",
            invalid_type_error : "nama_menu1 harus huruf"
        }),
        keterangan_menu : z.string({
            invalid_type_error : "keterangan_menu harus huruf"
        }).nullable(),
        icon : z.string({
            invalid_type_error : "icon harus huruf"
        }).nullable(),
        link : z.string({
            required_error : "link tidak boleh kosong",
            invalid_type_error : "link harus huruf"
        }),
        status : nativeEnum(statusOn).refine((value) => {
            if( (
                value === statusOn.Tampil || 
                value === statusOn.Tidak_Tampil
            )) {
                return true;
            }
            else {
                return false;
            }
        }),
        on_update : nativeEnum(statusOn).refine((value) => {
            if( (
                value === statusOn.Tampil || 
                value === statusOn.Tidak_Tampil
            )) {
                return true;
            }
            else {
                return false;
            }
        }),
        on_create :nativeEnum(statusOn).refine((value) => {
            if( (
                value === statusOn.Tampil || 
                value === statusOn.Tidak_Tampil
            )) {
                return true;
            }
            else {
                return false;
            }
        }),
        on_delete : nativeEnum(statusOn).refine((value) => {
            if( (
                value === statusOn.Tampil || 
                value === statusOn.Tidak_Tampil
            )) {
                return true;
            }
            else {
                return false;
            }
        }),
        on_view : nativeEnum(statusOn).refine((value) => {
            if( (
                value === statusOn.Tampil || 
                value === statusOn.Tidak_Tampil
            )) {
                return true;
            }
            else {
                return false;
            }
        }),
        ucr : z.string({
           invalid_type_error : "ucr harus huruf" 
        }).optional(),
        uch : z.string({
           invalid_type_error : "uch harus huruf" 
        }).optional(),
    })
}

const updated = {
    body : z.object({
        kode_aplikasi : z.string({
            required_error : "kode_aplikasi tidak boleh kosong",
            invalid_type_error : "kode_aplikasi harus huruf"
        }),
        kode_level : z.number({
            required_error : "kode_level tidak boleh kosong",
            invalid_type_error : "kode_level harus Angka"
        }),
        nama_menu1 : z.string({
            required_error : "nama_menu1 tidak boleh kosong",
            invalid_type_error : "nama_menu1 harus huruf"
        }),
        keterangan_menu : z.string({
            invalid_type_error : "keterangan_menu harus huruf"
        }).nullable(),
        icon : z.string({
            invalid_type_error : "icon harus huruf"
        }).nullable(),
        link : z.string({
            required_error : "link tidak boleh kosong",
            invalid_type_error : "link harus huruf"
        }),
        status : nativeEnum(statusOn).refine((value) => {
            if( (
                value === statusOn.Tampil || 
                value === statusOn.Tidak_Tampil
            )) {
                return true;
            }
            else {
                return false;
            }
        }),
        on_update : nativeEnum(statusOn).refine((value) => {
            if( (
                value === statusOn.Tampil || 
                value === statusOn.Tidak_Tampil
            )) {
                return true;
            }
            else {
                return false;
            }
        }),
        on_create :nativeEnum(statusOn).refine((value) => {
            if( (
                value === statusOn.Tampil || 
                value === statusOn.Tidak_Tampil
            )) {
                return true;
            }
            else {
                return false;
            }
        }),
        on_delete : nativeEnum(statusOn).refine((value) => {
            if( (
                value === statusOn.Tampil || 
                value === statusOn.Tidak_Tampil
            )) {
                return true;
            }
            else {
                return false;
            }
        }),
        on_view : nativeEnum(statusOn).refine((value) => {
            if( (
                value === statusOn.Tampil || 
                value === statusOn.Tidak_Tampil
            )) {
                return true;
            }
            else {
                return false;
            }
        }),
        ucr : z.string({
           invalid_type_error : "ucr harus huruf" 
        }).optional(),
        uch : z.string({
           invalid_type_error : "uch harus huruf" 
        }).optional(),
    }), 
    params : z.object({
        id : z.string({
            required_error : "id tidak boleh kosong",
            invalid_type_error : "id harus huruf"
        })
    })
}

const destroy = {
    params: z.object({
      id: z.string({
        required_error: "Data tidak boleh kosong",
        invalid_type_error: "Data harus string",
      }),
    }),
  };

const params = {
    params: z.object({
      id: z.string({
        required_error: "Data tidak boleh kosong",
        invalid_type_error: "Data harus huruf",
      }),
    }),
};


const query = {
    query: z.object({
      page: z.string({
        required_error: "page tidak boleh kosong",
        invalid_type_error: "page harus huruf",
      }),
      limit: z.string({
        required_error: "limit tidak boleh kosong",
        invalid_type_error: "limit harus huruf",
      }),
    }),
  };

  const paramsLevel = {
    params : z.object({
        id1 : z.string({
            required_error : "Id 1 Tidak Boleh Kosong",
            invalid_type_error : "Id 1 Harus String"
        }),
        id2 : z.string({
            required_error : "Id2 Tidak Boleh Kosong",
            invalid_type_error : "Id 2 Harus String"
        })
    })
  }

export const payloadRefMenu1Schema = object({
    ...payload
})

export const updatedRefMenu1Schema = object({
  ...updated
})

export const destroyRefMenu1Schema = object({
...destroy
})

export const searchRefMenu1Schema = object({
    ...query
})

export const getRefMenu1Schema = object({
    ...params
})
export const paramsLevelSchema = object({
    ...paramsLevel
})

export type PayloadRefMenu1Schema = z.infer<typeof payloadRefMenu1Schema>
export type UpdatedRefMenu1Schema = z.infer<typeof updatedRefMenu1Schema>
export type DestroyRefMenu1Schema = z.infer<typeof destroyRefMenu1Schema>
export type SearchRefMenu1Schema = z.infer<typeof searchRefMenu1Schema>
export type GetRefMenu1Schema = z.infer<typeof getRefMenu1Schema>
export type ParamsLevelSchema = z.infer<typeof paramsLevelSchema>
import {z, nativeEnum, object} from "zod"
import { statusOn } from "@models/refMenu1-model"

const payload = {
    body : z.object({
        kode_aplikasi : z.string({
            required_error : "kode_aplikasi tidak boleh kosong",
            invalid_type_error : "kode_aplikasi harus huruf"
        }),
        kode_menu2 : z.string({
            required_error : "kode_menu2 tidak boleh kosong",
            invalid_type_error : "kode_menu1 harus huruf"
        }),
        nama_menu3 : z.string({
            required_error : "nama_menu3 tidak boleh kosong",
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
        nama_menu3 : z.string({
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
        required_error: "page boleh kosong",
        invalid_type_error: "page harus huruf",
      }),
      limit: z.string({
        required_error: "limit tidak boleh kosong",
        invalid_type_error: "limit harus huruf",
      }),
    }),
  };

export const payloadRefMenu3Schema = object({
    ...payload
})

export const updatedRefMenu3Schema = object({
    ...updated
})

export const destroyRefMenu3Schema = object({
    ...destroy
    })
    
export const searchRefMenu3Schema = object({
    ...query
})

export const getRefMenu3Schema = object({
    ...params
})

export type PayloadRefMenu3Schema = z.infer<typeof payloadRefMenu3Schema>
export type UpdatedRefMenu3Schema = z.infer<typeof updatedRefMenu3Schema>
export type DestroyRefMenu3Schema = z.infer<typeof destroyRefMenu3Schema>
export type SearchRefMenu3Schema = z.infer<typeof searchRefMenu3Schema>
export type GetRefMenu3Schema = z.infer<typeof getRefMenu3Schema>
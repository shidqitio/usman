import {nativeEnum, object, z} from "zod";
import { statusOn } from "@models/refMenu1-model";

const payload = {
    body : z.object({
        kode_aplikasi : z.string({
            required_error : "kode_aplikasi tidak boleh kosong",
            invalid_type_error : "kode_aplikasi harus huruf"
        }),
        kode_menu1 : z.string({
            required_error : "kode_menu1 tidak boleh kosong",
            invalid_type_error : "kode_menu1 harus huruf"
        }),
        kode_level : z.string({
            required_error : "kode_level tidak boleh kosong",
            invalid_type_error : "kode_level harus huruf"
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
        }).nullable(),
        uch : z.string({
           invalid_type_error : "uch harus huruf" 
        }).nullable(),
        udcr : z.string({
            invalid_type_error : "udcr harus huruf"
        }).nullable(),
        udch : z.string({
            invalid_type_error : "udch harus huruf"
        }).nullable(),
    })
}

const updated = {
    body : z.object({
        kode_aplikasi : z.string({
            required_error : "kode_aplikasi tidak boleh kosong",
            invalid_type_error : "kode_aplikasi harus huruf"
        }),
        kode_level : z.string({
            required_error : "kode_level tidak boleh kosong",
            invalid_type_error : "kode_level harus huruf"
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
        }).nullable(),
        uch : z.string({
           invalid_type_error : "uch harus huruf" 
        }).nullable(),
        udcr : z.string({
            invalid_type_error : "udcr harus huruf"
        }).nullable(),
        udch : z.string({
            invalid_type_error : "udch harus huruf"
        }).nullable(),
    }), 
    params : z.object({
        id : z.string({
            required_error : "id tidak boleh kosong",
            invalid_type_error : "id harus huruf"
        })
    })
}

const destroy = {
    body: z.object({
      id: z.number({
        required_error: "Data tidak boleh kosong",
        invalid_type_error: "Data harus number",
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

export type PayloadRefMenu1Schema = z.infer<typeof payloadRefMenu1Schema>
export type UpdatedRefMenu1Schema = z.infer<typeof updatedRefMenu1Schema>
export type DestroyRefMenu1Schema = z.infer<typeof destroyRefMenu1Schema>
export type SearchRefMenu1Schema = z.infer<typeof searchRefMenu1Schema>
export type GetRefMenu1Schema = z.infer<typeof getRefMenu1Schema>
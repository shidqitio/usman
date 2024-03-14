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
        url : z.string({
            required_error : "url tidak boleh kosong",
            invalid_type_error : "url harus huruf"
        }),
        url_token : z.string({
            required_error : "url_token tidak boleh kosong",
            invalid_type_error : "url_token harus huruf"
        }),
        url_tte : z.string({
            required_error : "url_tte tidak boleh kosong",
            invalid_type_error : "url_tte harus huruf"
        }),
        ucr :  z.string({
            required_error : "url_tte tidak boleh kosong",
            invalid_type_error : "url_tte harus huruf"
        }),
    }),
};

const updated = {
    body : z.object({
        kode_aplikasi : z.string({
            required_error : "kode_aplikasi tidak boleh kosong",
            invalid_type_error : "kode_aplikasi harus huruf"
        }),
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
        url_tte : z.string({
            required_error : "url_tte tidak boleh kosong",
            invalid_type_error : "url_tte harus huruf"
        }),
    })
}

export const postRefAplikasiSchema = z.object({
    ...payload
})

export const updatedRefAplikasiSchema = z.object({
    ...updated
})

export type PostRefAplikasiSchema = z.infer<typeof postRefAplikasiSchema>;
export type UpdatedRefAplikasiSchema = z.infer<typeof updatedRefAplikasiSchema>

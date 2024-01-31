import { TypeOf, nativeEnum, object, string } from "zod";

const payload = {
  body: object({
    kodeGiro: string({
      required_error: "Kode giro tidak boleh kosong",
      invalid_type_error: "Kode giro harus huruf",
    }),
    namaBankVa: string({
      required_error: "Nama Bank va tidak boleh kosong",
      invalid_type_error: "Nama Bank va harus huruf",
    }),
    nomorVa: string({
      required_error: "Nomor va tidak boleh kosong",
      invalid_type_error: "Nomor va harus huruf",
    }),
    namaVa: string({
      required_error: "Nama Va tidak boleh kosong",
      invalid_type_error: "Nama Va harus huruf",
    }),
  }),
};

export const validateTransaksiSchema = object({
  ...payload,
});

export type ValidateTransaksiRequest = TypeOf<typeof validateTransaksiSchema>;

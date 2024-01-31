import { TypeOf, nativeEnum, object, string } from "zod";

const params = {
  query: object({
    data: string({
      required_error: "Data tidak boleh kosong",
      invalid_type_error: "Data harus huruf",
    }),
  }),
};

const query = {
  query: object({
    page: string({
      required_error: "page boleh kosong",
      invalid_type_error: "page harus huruf",
    }),
    limit: string({
      required_error: "limit tidak boleh kosong",
      invalid_type_error: "limit harus huruf",
    }),
  }),
};

export const getTransaksiSchema = object({
  ...query,
});

export const searchTransaksiSchema = object({
  ...params,
});

export type GetTransaksiRequest = TypeOf<typeof getTransaksiSchema>;
export type SearchTransaksiRequest = TypeOf<typeof searchTransaksiSchema>;

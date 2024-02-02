import { StatusUserActive } from "@models/user";
import { TypeOf, nativeEnum, number, object, string } from "zod";

const payload = {
  body: object({
    name: string({
      required_error: "name tidak boleh kosong",
      invalid_type_error: "name harus huruf",
    }),
    email: string({
      required_error: "email tidak boleh kosong",
      invalid_type_error: "email harus huruf",
    }),
    status: nativeEnum(StatusUserActive).refine((value) => {
      if (
        value === StatusUserActive.Active ||
        value === StatusUserActive.NonActive
      ) {
        return true;
      } else {
        throw new Error("Status harus salah satu dari Active atau InActive.");
      }
    }),
    address: string({
      required_error: "address tidak boleh kosong",
      invalid_type_error: "address harus huruf",
    }),
  }),
};

const updated = {
  body: object({
    id: number({
      required_error: "id tidak boleh kosong",
      invalid_type_error: "id harus nomor",
    }),
    name: string({
      required_error: "name tidak boleh kosong",
      invalid_type_error: "name harus huruf",
    }),
    email: string({
      required_error: "email tidak boleh kosong",
      invalid_type_error: "email harus huruf",
    }),
    status: nativeEnum(StatusUserActive).refine((value) => {
      if (
        value === StatusUserActive.Active ||
        value === StatusUserActive.NonActive
      ) {
        return true;
      } else {
        throw new Error("Status harus salah satu dari Active atau InActive.");
      }
    }),
    address: string({
      required_error: "address tidak boleh kosong",
      invalid_type_error: "address harus huruf",
    }),
  }),
};

const params = {
  params: object({
    id: string({
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

export const getExampleSchema = object({
  ...params,
});

export const searchExampleSchema = object({
  ...query,
});

export const payloadExampleSchema = object({
  ...payload,
});

export const updatedExampleSchema = object({
  ...updated,
});

export type GetExampleRequest = TypeOf<typeof getExampleSchema>;
export type SearchExampleRequest = TypeOf<typeof searchExampleSchema>;
export type PayloadExampleRequest = TypeOf<typeof payloadExampleSchema>;
export type UpdatedExampleRequest = TypeOf<typeof updatedExampleSchema>;

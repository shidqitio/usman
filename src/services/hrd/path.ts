import axios, { AxiosInstance } from "axios";
import getConfig from "@config/dotenv";

const Hrd: AxiosInstance = axios.create({
  baseURL: getConfig("HRD_BASE_URL"),
  timeout: 60000,
  timeoutErrorMessage: "Harap periksa kembali koneksi jaringan Anda.",
  headers: {
    Accept: "application/json",
  },
});

export default Hrd;

export const HRD_PATH = {
  PEGAWAI_BY_EMAIL: "/pegawai/landing/email",
  PEGAWAI_BY_UNIT : "/pegawai/usman/get-unit",
  PEGAWAI_GETALL : "/pegawai/usman"
};

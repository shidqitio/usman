import axios, { AxiosInstance } from "axios";
import getConfig from "@config/dotenv";

const Usman: AxiosInstance = axios.create({
  baseURL: getConfig("USMAN_BASE_URL"),
  timeout: 60000,
  timeoutErrorMessage: "Harap periksa kembali koneksi jaringan Anda.",
  headers: {
    Accept: "application/json",
  },
});

export default Usman;

export const USMAN_PATH = {
  TOKEN: "/check-token",
};

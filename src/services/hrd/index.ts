import Hrd, { HRD_PATH } from "@services/hrd/path";
import generateHeaderWithSignature from "@utils/signature"
import getConfig from "@config/dotenv";

const getPegawaiByEmail = async (
  email: string
): Promise<[any | null, any | null]> => {
  try {
    const method = "GET";
    const url = `${getConfig("HRD_BASE_URL")}${HRD_PATH.PEGAWAI_BY_EMAIL}/${email}`
    const data = {}

    const headers : any = await generateHeaderWithSignature(method, url, data)


    const response = await Hrd.get(url, {
      headers : headers,
      data : data
    });

    const result = response.data;

    console.log(result.nip)
    if (result.status === "Success") {
      return [result.data, null];
    } else {
      return [null, result.error];
    }
  } catch (error) {
    if (error instanceof Error) {
      return [null, error?.message];
    }
    return [null, "Internal server error"];
  }
};

const getPegawaiByUnit = async (body : any) => {
  try {
    const method = "POST"

    const url = `${getConfig("HRD_BASE_URL")}${HRD_PATH.PEGAWAI_BY_UNIT}`

    const data = {
      kode_unit : body
    }

    const headers : any = await generateHeaderWithSignature(method, url, data)

    console.log(url)

    console.log("TES HEADERS :", headers)

    const response = await Hrd.post(url, data, {
      headers : headers,
    });

    const result = response.data;

    console.log(result)
    if (result.status === "Success") {
      return [result.data, null];
    } else {
      return [null, result.error];
    }
  } catch (error) {
    if (error instanceof Error) {
      return [null, error?.message];
    }
    return [null, "Internal server error"];
  }
}


export { getPegawaiByEmail, getPegawaiByUnit };

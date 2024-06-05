import Hrd, { HRD_PATH } from "@services/hrd/path";

const getPegawaiByEmail = async (
  email: string
): Promise<[any | null, any | null]> => {
  try {
    const response = await Hrd.get(`${HRD_PATH.PEGAWAI_BY_EMAIL}/${email}`);
    const result = response.data;
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

export { getPegawaiByEmail };

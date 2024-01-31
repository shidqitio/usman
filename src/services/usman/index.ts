import Usman, { USMAN_PATH } from "@services/usman/path";

export type TokenUsman = {
  idUser: number;
  kodeGrup: string;
  token: string;
};

const checkTokenUsman = async (
  data: TokenUsman,
  token: string
): Promise<[any | null, any | null]> => {
  try {
    const response = await Usman.post(USMAN_PATH.TOKEN, {
      id_user: data.idUser,
      kode_group: data.kodeGrup,
      token: data.token
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    const result = response.data;
    if (result.status === "success") {
      return [result.data, null];
    } else {
      return [null, result.message];
    }
  } catch (error) {
    if (error instanceof Error) {
      return [null, error.message];
    }
    return [null, "Internal server error"];
  }
};

export { checkTokenUsman };

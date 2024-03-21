import { Request, Response, NextFunction } from "express";
import { IncomingHttpHeaders } from "http";
import CustomError from "@middleware/error-handler";
import { TokenUsman, checkTokenUsman } from "@services/usman";
import { getPegawaiByEmail } from "@services/hrd";
import { httpCode } from "@utils/prefix";

interface HeaderAuth extends IncomingHttpHeaders {
  idUser?: string;
  kodeGroup?: string;
  tokenLama?: string;
  tokenBaru?: string;
}

type UserAuth = {
  id: number;
  email: string;
  token: string;
  is_login: string | null;
};

type PegawaiAuth = {
  nip: string;
  TrxUnitKerjaPegawais: {
    Unit: {
      kode_unit_baru: string;
      kode_unit: string;
      nama_unit: string;
    };
  }[];
};

export type UserData = {
  id: number;
  email: string;
  token: string;
  is_login: string | null;
};

declare global {
  namespace Express {
    interface Request {
      user: UserData;
    }
  }
}

const authorization = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id_user, kode_group, token_lama, token_baru }: HeaderAuth =
      req.headers;

    if (!id_user || !kode_group || !token_lama || !token_baru) {
      throw new CustomError(httpCode.unauthorized, "Unauthorized");
    }

    if (
      typeof token_lama === "string" &&
      token_lama.split(" ")[0] === "Bearer"
    ) {
      throw new CustomError(httpCode.unauthorized, "Unauthorized");
    }

    const data: TokenUsman = {
      idUser: parseInt(id_user as string, 10),
      kodeGrup: kode_group as string,
      token: token_baru as string,
    };

    const [user, errorUsman]: [UserAuth, string] = await checkTokenUsman(
      data,
      token_lama as string
    );

    if (errorUsman) {
      throw new CustomError(httpCode.unauthorized, errorUsman);
    }

    if (!user || !user.email) {
      throw new CustomError(httpCode.unauthorized, "Unauthorized");
    }

    const [pegawai, errorHrd]: [PegawaiAuth, string] = await getPegawaiByEmail(
      user.email
    );

    if (errorHrd) {
      throw new CustomError(httpCode.unauthorized, errorHrd);
    }

    // const userData: UserData = {
    //   idUser: user.id,
    //   nip: pegawai.nip,
    //   email: user.email,
    //   apiToken: user.api_token,
    //   isLogin: user.is_login,
    //   kodeUnit: pegawai.TrxUnitKerjaPegawais[0].Unit.kode_unit_baru,
    //   kodeUnitLama: pegawai.TrxUnitKerjaPegawais[0].Unit.kode_unit,
    //   namaUnit: pegawai.TrxUnitKerjaPegawais[0].Unit.nama_unit,
    //   // ...pegawai,
    // };

    // req.user = userData;

    next();
  } catch (err) {
    next(err);
  }
};

export default authorization;

import CustomError from "@middleware/error-handler";
import Users, { StatusUserActive, UserInput, UserOutput } from "@models/user";
import {
  GetExampleRequest,
  PayloadExampleRequest,
  SearchExampleRequest,
  UpdatedExampleRequest,
} from "@schema/api/example-schema";
import { httpCode } from "@utils/prefix";

const searchExampleApi = async (
  page: SearchExampleRequest["query"]["page"],
  limit: SearchExampleRequest["query"]["limit"]
): Promise<UserOutput[]> => {
  /**
   * variabel
   */
  try {
    let pages: number = parseInt(page);
    let limits: number = parseInt(limit);
    let offset = 0;

    if (pages > 1) {
      offset = (pages - 1) * limits;
    }

    const user: Users[] = await Users.findAll({
      where: {
        status: StatusUserActive.Active,
      },
      order: [["created_at", "DESC"]],
      limit: limits,
      offset: offset,
    });
    if (!user) throw new CustomError(httpCode.found, "Gagal membuat user");

    return user;
  } catch (error: any) {
    if (error instanceof CustomError) {
      throw new CustomError(error.code, error.message);
    } else {
      throw new CustomError(500, "Internal server error.");
    }
  }
};

const getExampleApi = async (
  id: GetExampleRequest["params"]["id"]
): Promise<UserOutput> => {
  /**
   * variabel
   */
  try {
    const user = await Users.findOne({
      where: {
        id: id,
      },
    });
    if (!user) throw new CustomError(httpCode.found, "User tidak ditemukan!");

    return user;
  } catch (error: any) {
    if (error instanceof CustomError) {
      throw new CustomError(error.code, error.message);
    } else {
      throw new CustomError(500, "Internal server error.");
    }
  }
};

const storeExampleApi = async (
  request: PayloadExampleRequest["body"]
): Promise<UserInput> => {
  try {
    const userInput: UserInput = {
      name: request.name,
      email: request.email,
      status: request.status,
      address: request.address,
    };

    const user = await Users.create(userInput);

    if (!user) throw new CustomError(httpCode.found, "Gagal membuat user");

    return user;
  } catch (error: any) {
    if (error instanceof CustomError) {
      throw new CustomError(error.code, error.message);
    } else {
      throw new CustomError(500, "Internal server error.");
    }
  }
};

const updatedExampleApi = async (
  request: UpdatedExampleRequest["body"]
): Promise<UserInput | any> => {
  try {
    const userInput: UserInput = {
      name: request.name,
      email: request.email,
      status: request.status,
      address: request.address,
    };

    const exists = await Users.findOne({ where: { id: request.id } });
    if (!exists) throw new CustomError(httpCode.found, "User tidak ditemukan");

    const user = await Users.update(userInput, {
      where: {
        id: request.id,
      },
    });
    if (!user) throw new CustomError(httpCode.found, "Gagal membuat user");

    return user;
  } catch (error: any) {
    if (error instanceof CustomError) {
      throw new CustomError(error.code, error.message);
    } else {
      throw new CustomError(500, "Internal server error.");
    }
  }
};

const destroyExampleApi = async (
  id: GetExampleRequest["params"]["id"]
): Promise<UserOutput | any> => {
  /**
   * variabel
   */
  try {
    let data = parseInt(id);

    const exists = await Users.findOne({
      where: {
        id: data,
      },
    });
    if (!exists) throw new CustomError(httpCode.found, "User tidak ditemukan!");

    const user = await Users.destroy({
      where: {
        id: data,
      },
    });
    if (!user)
      throw new CustomError(httpCode.found, "User tidak berhasil di hapus!");

    return user;
  } catch (error: any) {
    if (error instanceof CustomError) {
      throw new CustomError(error.code, error.message);
    } else {
      throw new CustomError(500, "Internal server error.");
    }
  }
};

export default {
  searchExampleApi,
  getExampleApi,
  storeExampleApi,
  updatedExampleApi,
  destroyExampleApi,
};

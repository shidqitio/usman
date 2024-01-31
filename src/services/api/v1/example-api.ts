import CustomError from "@middleware/error-handler";
import UserAkses, { StatusUserActive, UserOutput } from "@models/user-akses";

const exampleApi = async (
  page: string,
  limit: string
): Promise<UserOutput[]> => {
  /**
   * variabel
   * fungsi model
   * logic
   * return
   * handle response
   * sebelum ke controller data harus clean
   */
  try {
    let pages: number = parseInt(page);
    let limits: number = parseInt(limit);
    let offset = 0;

    if (pages > 1) {
      offset = (pages - 1) * limits;
    }

    const user: UserAkses[] = await UserAkses.findAll({
      where: {
        status: StatusUserActive.Active,
      },
      order: [["udch", "DESC"]],
      limit: limits,
      offset: offset,
    });

    return user;
  } catch (error: any) {
    if (error instanceof CustomError) {
      throw new CustomError(error.code, error.message);
    } else {
      throw new CustomError(500, "Internal server error.");
    }
  }
};

exports = { exampleApi };

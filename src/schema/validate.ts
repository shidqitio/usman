import { AnyZodObject, ZodError } from "zod";
import { removeFile } from "@utils/remove-file";
import { httpCode, responseStatus } from "@utils/prefix";
import { Request, Response, NextFunction } from "express";

const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // console.log(req.body)
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      next();
    } catch (e: any) {
      if (req.file && req.file.path) {
        await removeFile(req.file.path);
      }
      // console.log(e)
      const message = e.errors.map((error: any) => error.message).join(", ");
      console.log(message)
      return res.status(422).json({
        code: httpCode.unprocessableEntity,
        status: responseStatus.error,
        message : message
      });
    }
  };


export default validate;

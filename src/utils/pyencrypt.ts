import {exec} from "child_process"
import getConfig from "@config/dotenv"
import CustomError from "@middleware/error-handler";
import { httpCode } from "./prefix";

const runCommand = (command : any) => {
    return new Promise((resolve, reject) => {
      exec(command, (error, stdout : any, stderr : any) => {
        if (error) {
          reject(error);
        } else {
          resolve({ stdout, stderr });
        }
      });
    });
  };


  const pysha256enc = async(word : any) => {

    if(!word){
      throw new CustomError(httpCode.found, "Error")
    }
    
    try {
      const stdout = await runCommand(
        "cd src/python && source env/bin/activate && python3 sha256enc.py " +
          word 
      );
      return stdout;
    } catch (error) {
      return error;
    }
  }

export default {
    pysha256enc
}
import { mode, modePrefix } from "@utils/prefix";
import dotenv from "dotenv";
dotenv.config();

const MODE = process.env.NODE_ENV || process.env.MODE;

const getConfig = (key: string): string => {
  let envKey;
  if (MODE === mode.development) {

    envKey = `${modePrefix.dev_}${key}`;

  } else if (MODE === mode.production) {

    envKey = `${modePrefix.prod_}${key}`;
    
  }

  if (envKey === undefined) {
    throw new Error("Invalid mode or key.");
  }

  const value = process.env[envKey];

  if (value === undefined) {
    throw new Error(`Environment variable ${envKey} is not defined.`);
  }

  return value as string;
};

export default getConfig;

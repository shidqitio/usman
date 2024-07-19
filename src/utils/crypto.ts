import crypto from "crypto"
import getConfig from "@config/dotenv";

const hmacSHA256 = async (payloads : string) => {
  try {
    const result = crypto
      .createHmac("sha256", getConfig("CRYPTO_KEY"))
      .update(payloads)
      .digest("hex");

    return result;
  } catch (error) {
    throw error;
  }
};

const SHA256 = async (data : any) => {
  try {
    const result = crypto
      .createHash("sha256")
      .update(JSON.stringify(data))
      .digest("hex");

    return result;
  } catch (error) {
    throw error;
  }
};

export  { hmacSHA256, SHA256 };

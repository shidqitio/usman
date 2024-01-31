import crypto from "crypto";

const generateCode = (word: string): string => {
  const key = "sippp2023unitpmo";
  const result = encryptWithKey(word, key);
  return result;
};

const generateSptd = (reff: string): string => {
  const key = "sippp2023unitpmo";
  const dec = decryptWithKey(reff, key);
  return dec;
};

const generateCodeSippp = (reffSippp: string): string => {
  const key = "sippp2023unitpmo";
  const result = encryptWithKey(reffSippp, key);
  return result;
};

const encryptWithKey = (word: string, secret: string) => {
  let key = Buffer.from(secret, "utf-8");
  let secret_msg = Buffer.from(word, "utf-8");
  let cipher = crypto.createCipheriv("aes-128-ecb", key, null);
  let encryptedData = Buffer.concat([cipher.update(secret_msg), cipher.final()])
    .toString("hex")
    .toUpperCase();

  return encryptedData;
};

const decryptWithKey = (word: any, secret: string) => {
  let key = Buffer.from(secret, "utf-8");
  let secret_msg = Buffer.from(word, "hex");

  let cipher = crypto.createDecipheriv("aes-128-ecb", key, null);
  let decryptData = Buffer.concat([
    cipher.update(secret_msg),
    cipher.final(),
  ]).toString("utf-8");
  return decryptData;
};

export { generateCode, generateCodeSippp, generateSptd };

import * as crypto from 'crypto';

export const hmacSHA256 = (payloads: string, secret: string) => {
  const result = crypto
    .createHmac("SHA256", secret)
    .update(payloads)
    .digest("hex");
  return result;
};

export const hmacSHA512 = (payloads: string, secret: string) => {
  const result = crypto
    .createHmac("SHA512", secret)
    .update(payloads)
    .digest("base64");
  return result;
};

export const hmacSHA256Single = (data: string) => {
  const result = crypto.createHash("sha256").update(data).digest("hex");

  return result;
};
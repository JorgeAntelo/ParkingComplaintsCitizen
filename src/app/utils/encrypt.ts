import * as CryptoJS from "crypto-js";
import { environment } from "src/environments/environment";

const key = CryptoJS.enc.Utf8.parse(environment.keyEncrypt);
const iv = CryptoJS.enc.Utf8.parse(environment.keyEncrypt);

export const decrypt = (encrypted: string) => {
  let encryptedHexStr = CryptoJS.enc.Base64.parse(encrypted);

  let srcs = CryptoJS.enc.Base64.stringify(encryptedHexStr);

  let decrypted = CryptoJS.AES.decrypt(srcs, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
};
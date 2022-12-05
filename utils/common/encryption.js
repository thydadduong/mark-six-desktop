const crypto = require("crypto");
// let rsaKey = Buffer.from(process.env.RSA_AUTH_KEY || "", "base64").toString();
let encryptData = (data, key) => {
  return crypto
    .publicEncrypt(
      { key, padding: crypto.constants.RSA_PKCS1_PADDING },
      Buffer.from(data)
    )
    .toString("base64");
};
export { encryptData };

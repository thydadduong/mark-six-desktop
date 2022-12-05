const crypto = require("crypto");
export const hashEncrypt = (secret = "") => {
  let timestamp = Math.floor(Date.now() / 1000);
  let hash = crypto
    .createHmac("sha1", secret)
    .update(timestamp.toString())
    .digest("hex");
  return Buffer.from(hash + "&" + timestamp).toString("base64");
};

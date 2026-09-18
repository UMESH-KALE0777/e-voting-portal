// server/utils/generateHash.js
import crypto from "crypto";
 
const generateHash = (data) => {
  if (!data) throw new Error("generateHash: data is required");

  return crypto
    .createHash("sha256")
    .update(String(data))
    .digest("hex");
};

export default generateHash;
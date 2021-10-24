const fs = require("fs");

const config = {
  privateKey: fs.readFileSync("./keys/private.key"),
  publicKey: fs.readFileSync("./keys/public.key"),
  sign_options: {
    algorithm: "RS256",
    expiresIn: "30d",
  },
  verify_options: {
    algorithms: ["RS256"],
  },
};

module.exports = config;

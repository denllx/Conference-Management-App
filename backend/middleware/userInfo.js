const jwtConfig = require("../utils/jwt-config");
const jwt = require("jsonwebtoken");

// Check whether or not user has logged in
const userInfo = async (ctx, next) => {
  const token = ctx.cookies.get("token");
  try {
    ctx.user = jwt.verify(token, jwtConfig.publicKey, jwtConfig.verify_options);
    // console.log("verify success");
    return next();
  } catch {
    console.log("verify failed");
    ctx.body = {
      code: "400",
    };
    return;
  }
};

module.exports = userInfo;

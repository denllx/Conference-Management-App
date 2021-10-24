const KoaRouter = require("koa-router");
const router = new KoaRouter();
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtConfig = require("../utils/jwt-config");

router.get("/", (async) => {
  // TODO: Get current username
});

router.post("/", async (ctx, next) => {
  let username = ctx.request.body["username"];
  let password = ctx.request.body["password"];
  let nickname = ctx.request.body["nickname"];
  let admin = ctx.request.body["admin"];
  let paperIds = [];
  let hashpassword = bcrypt.hashSync(password, 10);
  console.log(hashpassword);
  const collection = (await db).collection("users");
  let res = await collection
    .find({ $or: [{ username: username }, { nickname: nickname }] })
    .toArray();

  if (res.length > 0)
    ctx.body = {
      code: "400",
    };
  else {
    if (admin == false) {
      console.log("register");
      console.log({
        username: username,
        password: hashpassword,
        nickname: nickname,
        isAdmin: admin,
        paperIds: paperIds,
      });
      collection.insertOne({
        username: username,
        password: hashpassword,
        nickname: nickname,
        isAdmin: admin,
        paperIds: paperIds,
      });
    } else
      collection.insertOne({
        username: username,
        password: hashpassword,
        nickname: nickname,
        isAdmin: admin,
        conferences: ctx.request.body["conferences"],
      });
    ctx.body = {
      code: "200",
    };
  }
  console.log(ctx.body);
});

router.put("/", async (ctx, next) => {
  console.log(ctx.request.body);
  let username = ctx.request.body["username"];
  let password = ctx.request.body["password"];
  let admin = ctx.request.body["admin"];
  const collection = (await db).collection("users");
  let res = await collection
    .find({ username: username, isAdmin: admin })
    .toArray();
  if (res.length === 0)
    ctx.body = {
      code: "400",
    };
  else {
    user_password = res[0]["password"];
    const confirm = bcrypt.compareSync(password, user_password);
    if (confirm) {
      delete res[0][password]; // not send password to client
      console.log(res[0]);
      const token = jwt.sign(
        {
          username: res[0].username,
          password: res[0].password,
        },
        jwtConfig.privateKey,
        jwtConfig.sign_options
      );
      ctx.cookies.set("token", token);
      ctx.body = {
        code: "200",
        data: res[0],
      };
    } else
      ctx.body = {
        code: "400",
      };
  }
  console.log(ctx.body);
});

router.delete("/", async (ctx, next) => {
  // TODO: Logout
  ctx.cookies.set("token", null);
  ctx.body = {
    code: "200",
  };
});

module.exports = router;

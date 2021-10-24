const Koa = require("koa");
const app = new Koa();
const Router = require("koa-router");
const router = new Router();
const bodyParser = require("koa-bodyparser");
const userInfo = require('./middleware/userInfo');

const AccountRoutes = require("./routes/account");
const UserRoutes = require("./routes/users");
const ConferenceRoutes = require("./routes/conferences");

router.use("/account", AccountRoutes.routes());
router.use("/users", UserRoutes.routes());
router.use("/conferences", userInfo, ConferenceRoutes.routes());

app
  .use(
    bodyParser({
      jsonLimit: "10mb", // for image uploading
    })
  )
  .use(router.routes())
  .use(router.allowedMethods());

console.log("Listen at http://localhost:3000");
app.listen(3000);

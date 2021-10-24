const KoaRouter = require("koa-router");
const router = new KoaRouter();
const db = require("../db");
const ObjectID = require("mongodb").ObjectID;
const userInfo = require("../middleware/userInfo");
const bcrypt = require("bcrypt");

router.get("/nickname/:nickname", async (ctx) => {
  const userCollection = (await db).collection("users");
  const user = await userCollection.findOne({ nickname: ctx.params.nickname });
  if (user) ctx.body = user.username;
  else ctx.body = false;
});

router.get("/:username", async (ctx) => {
  // TODO: get user data
  const collection = (await db).collection("users");
  const user = await collection.findOne({ username: ctx.params.username });
  delete user.password;
  ctx.body = user;
});

router.patch("/:username/password", userInfo, async (ctx) => {
  const oldPwd = ctx.request.body.oldPassword;
  const newPwd = ctx.request.body.newPassword;
  const users = (await db).collection("users");
  const username = ctx.user.username;
  const user = await users.findOne({ username });
  const pwd = user.password;
  if (bcrypt.compareSync(oldPwd, pwd)) {
    console.log("pwd correct");
    const newPwdHash = bcrypt.hashSync(newPwd, 10);
    await users.updateOne({ username }, { $set: { password: newPwdHash } });
    ctx.body = {
      code: 200,
    };
  } else {
    console.log("pwd wrong");
    ctx.body = {
      code: 400,
    };
  }
});

router.put("/:username", userInfo, async (ctx) => {
  const userData = ctx.request.body.data;
  console.log("newUserData=", userData);
  const users = (await db).collection("users");
  delete userData["_id"];
  await users.replaceOne({ username: ctx.params.username }, userData);
  //TODO: check insert success
  ctx.body = {
    code: 200,
  };
});

// get paper collections
router.get("/:username/collections", userInfo, async (ctx) => {
  console.log("collections");
  const username = ctx.params.username;
  console.log("username=", username);
  const users = (await db).collection("users");
  const paperIds = (await users.findOne({ username })).paperIds;
  console.log("paperIds=", paperIds);

  const paperCollection = (await db).collection("papers");
  const papers = await Promise.all(
    paperIds.map(async (id) => await paperCollection.findOne({ _id: id }))
  );
  console.log("papers=", papers);
  for (const paper of papers) {
    for (const comment of paper.comments) {
      comment.user = await users.findOne({ username: comment.user });
    }
  }
  console.log("papers:", papers);
  ctx.body = {
    code: 200,
    data: papers,
  };
});

router.get("/:username/chats", userInfo, async (ctx) => {
  // console.log("get chats");
  const msgCollection = (await db).collection("msgs");
  const username = ctx.params.username;
  const userCollection = (await db).collection("users");
  let msgs = await msgCollection
    .find({
      $or: [{ "user1.name": username }, { "user2.name": username }],
    })
    .toArray();
  // remove userinfo about me
  const promises = [];
  msgs.forEach(async (msg) => {
    promises.push(
      new Promise(async (resolve, reject) => {
        if (msg.user1.name === username) {
          // i am user1
          msg.friend = {
            username: msg.user2.name,
            avatar: (await userCollection.findOne({ username: msg.user2.name }))
              .avatar,
          };
          msg.unread = msg.user1.unread;
        } else {
          msg.friend = {
            username: msg.user1.name,
            avatar: (await userCollection.findOne({ username: msg.user1.name }))
              .avatar,
          };
          msg.unread = msg.user2.unread;
        }
        delete msg["user1"];
        delete msg["user2"];
        resolve();
      })
    );
  });
  await Promise.all(promises);
  // console.log("response=", msgs);
  // add avatar to friend
  ctx.body = {
    code: 200,
    data: msgs,
  };
});

// reset unread
router.patch("/:username/chats", userInfo, async (ctx) => {
  console.log("reset unread");
  const msgCollection = (await db).collection("msgs");
  let me = ctx.user.username;
  let friend = ctx.request.body.username;
  const userCollection = (await db).collection("users");
  const friendUser = await userCollection.findOne({ username: friend });
  if (!friendUser) {
    console.log("friend not exists");
    ctx.body = {
      code: 404,
    };
    return;
  }
  console.log(me + " clear unread with " + friend);
  let user1 = me,
    user2 = friend;
  if (user1 > user2) {
    let tmp = user1;
    user1 = user2;
    user2 = tmp;
  }
  let ret = await msgCollection.findOne({
    "user1.name": user1,
    "user2.name": user2,
  });
  if (ret) {
    console.log("clearn unread ret=", ret);
    delete ret["_id"];
    let user = ret.user2.name === ctx.user.username ? "user2" : "user1";
    ret[user].unread = 0;
    console.log("clear unread newret=", ret);
    await msgCollection.updateOne(
      { "user1.name": user1, "user2.name": user2 },
      { $set: ret },
      { upsert: true }
    );
  }
  ctx.body = {
    code: 200,
  };
});

router.post("/:username/chats", userInfo, async (ctx) => {
  console.log("send chat");
  const msgCollection = (await db).collection("msgs");
  let user1 = ctx.user.username;
  let user2 = ctx.request.body.username;
  // check whether friend exists
  const userCollection = (await db).collection("users");
  const friend = await userCollection.findOne({ username: user2 });
  if (!friend) {
    console.log("friend not exists");
    ctx.body = {
      code: 404,
    };
    return;
  }
  console.log(user1 + " talks to " + user2);
  const content = ctx.request.body.content;
  const timestamp = ctx.request.body.timestamp;
  if (user1 > user2) {
    let tmp = user1;
    user1 = user2;
    user2 = tmp;
  }
  let ret = await msgCollection.findOne({
    "user1.name": user1,
    "user2.name": user2,
  });
  console.log("ret=", ret);
  if (ret) {
    console.log("chat history exists");
    delete ret["_id"];
    ret["messages"].push({
      user: ctx.user.username,
      content,
      timestamp,
    });
    let friend = "user1";
    if (ret[friend].name === ctx.user.username) {
      friend = "user2";
    }
    ret[friend].unread++;
  } else {
    console.log("chat history not exists");
    ret = {
      user1: {
        name: user1,
        unread: user1 === ctx.user.username ? 0 : 1,
      },
      user2: {
        name: user2,
        unread: user2 === ctx.user.username ? 0 : 1,
      },
      messages: [
        {
          user: ctx.user.username,
          content,
          timestamp,
        },
      ],
    };
  }
  console.log("newret=", ret);
  await msgCollection.updateOne(
    { "user1.name": user1, "user2.name": user2 },
    { $set: ret },
    { upsert: true }
  );
  ctx.body = {
    code: 200,
  };
});

module.exports = router;

const db = require("../db");
const ObjectID = require("mongodb").ObjectID;

async function talk(user1, user2) {
  const msgCollection = (await db).collection("msgs");
  if (user1.username > user2.username) {
    var temp = user1;
    user1 = user2;
    user2 = temp;
  }
  await msgCollection.updateOne(
    { user1: user1.username, user2: user2.username },
    {
      $set: {
        user1: {
          name: user1.username,
          unread: 1,
        },
        user2: {
          name: user2.username,
          unread: 0,
        },
        messages: [
          {
            user: user1.username,
            content: "Hello~",
            timestamp: new Date().getTime(),
          },
          {
            user: user2.username,
            content: "Hi",
            timestamp: new Date().getTime(),
          },
        ],
      },
    },
    {
      upsert: true,
    }
  );
}

async function mockData() {
  const userCollection = (await db).collection("users");
  const paperCollection = (await db).collection("papers");
  const papers = await paperCollection.find({}).toArray();
  const paperIds = papers.map((paper) => paper._id);
  const users = [
    {
      username: "icebear",
      password: "$2b$10$xaf9w9gpGZ3i21xNeU.5KuL8uWaDqhO2hiextaDZz81fqLiX3ezDS",
      // password : "a",
      //password: "", // TODO:
      avatar:
        "https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=1354268575,1268995723&fm=26&gp=0.jpg",
      signature: "icebear feels good",
      nickname: "Johann Schleier-Smith",
      isAdmin: false,
      paperIds: [],
    },
    {
      username: "admin",
      password: "$2b$10$xaf9w9gpGZ3i21xNeU.5KuL8uWaDqhO2hiextaDZz81fqLiX3ezDS",
      // password : "a",
      avatar:
        "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1589475468425&di=8f8d5647d0962d5798bf19de0685ffd5&imgtype=0&src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201709%2F10%2F20170910110429_5J8jt.jpeg",
      signature: "admin's signature",
      nickname: "acy",
      isAdmin: true,
      paperIds: [],
      conferences: [
        ObjectID.createFromHexString('5'.repeat(23) + '0'),
        ObjectID.createFromHexString('5'.repeat(23) + '1'),
        ObjectID.createFromHexString('5'.repeat(23) + '2'),
        ObjectID.createFromHexString('5'.repeat(23) + '3')
      ],
    },
    {
      username: "bob",
      password: "$2b$10$QXqo5wNlBjVXGY9nRb/IOeLTGRauh.aZA2GetFxOOSDnqalRoIrV2",
      // password : "b",
      avatar:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Missing_avatar.svg/768px-Missing_avatar.svg.png",
      signature: "This is a simple note.",
      nickname: "Mike Johnson",
      isAdmin: false,
      paperIds: paperIds,
    },
    {
      username: "cat",
      password: "$2b$10$QXqo5wNlBjVXGY9nRb/IOeLTGRauh.aZA2GetFxOOSDnqalRoIrV2",
      // password : "b",
      avatar:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Missing_avatar.svg/768px-Missing_avatar.svg.png",
      signature: "Hello, world",
      nickname: "Joseph M. Hellerstein",
      isAdmin: false,
      paperIds: paperIds,
    },
    {
      username: "dot",
      password: "$2b$10$QXqo5wNlBjVXGY9nRb/IOeLTGRauh.aZA2GetFxOOSDnqalRoIrV2",
      // password : "b",
      avatar:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Missing_avatar.svg/768px-Missing_avatar.svg.png",
      signature: "Hello, world",
      nickname: "Vikram Sreekanti",
      isAdmin: false,
      paperIds: paperIds,
    },
  ];
  await userCollection.insertMany(users);
  const bob = await userCollection.findOne({ username: "bob" });
  const cat = await userCollection.findOne({ username: "cat" });
  const dot = await userCollection.findOne({ username: "dot" });
  const icebear = await userCollection.findOne({ username: "icebear" });
  await talk(bob, cat);
  await talk(bob, dot);
  await talk(bob, icebear); // ensure userids are sorted lexically before passed as parameter
  await talk(cat, icebear);
  await talk(cat, dot);
  await talk(dot, icebear);

  process.exit(0);
}

mockData();

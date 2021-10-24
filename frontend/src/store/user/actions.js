import axios from "axios";

export async function register(context, dic) {
  let username = dic["username"];
  let nickname = dic["nickname"];
  let password = dic["password"];
  let admin = dic["admin"];
  var body = {
    username: username,
    nickname: nickname,
    password: password,
    admin: admin
  };
  if (admin == true) body["conferences"] = [];
  const result = await axios.post(`http://39.107.235.247:3000/account`, body);
  return result;
}

export async function login(context, dic) {
  let username = dic["username"];
  let password = dic["password"];
  let admin = dic["admin"];
  console.log("1", username, password, admin);
  const result = await axios.put(`http://39.107.235.247:3000/account`, {
    username: username,
    password: password,
    admin: admin
  });
  console.log("2");
  if (result.data.code == "200") {
    context.commit("updateUserData", result.data.data);
    console.log("login success");
    console.log("userdata=", result.data.data);
  }
  return result;
}

export async function logout(context) {
  const result = await axios.delete(`http://39.107.235.247:3000/account`);
  if (result.data.code == "200") {
    context.commit("updateUserData", {});
  }
  return result;
}

export async function updatePassword(context, { oldPassword, newPassword }) {
  console.log("oldpassword=", oldPassword, newPassword);
  const result = await axios.patch(
    `http://39.107.235.247:3000/users/${context.state.userData.username}/password`,
    {
      oldPassword,
      newPassword
    }
  );
  console.log("ret=", result);
  if (result.data.code == 200) {
    console.log("success");
    context.commit("updatePassword", newPassword);
    return 0;
  } else {
    console.log("fail");
    return 1;
  }
}

export async function sendMessage(context, { friend, content, timestamp }) {
  const result = await axios.post(
    `http://39.107.235.247:3000/users/${context.state.userData.username}/chats`,
    {
      username: friend.username,
      content,
      timestamp
    }
  );
  if (result.data.code == "200") {
    console.log("send message success");
    context.commit("appendMsg", { friend, content, timestamp });
    return 0;
  } else {
    console.log("send message fail", result.data.code);
    return 1;
  }
}

export async function getPapers(context, username) {
  // check for cache
  const user = username || context.state.userData.username;
  const papers = context.state.papers;
  if (!papers[user]) {
    const ret = await axios.get(
      `http://39.107.235.247:3000/users/${user}/collections`
    );
    console.log("ret=", ret);
    if (ret.data.code == 200) {
      console.log("get paper success");
      context.commit("updatePapers", {
        user,
        papers: ret.data.data
      });
    } else {
      console.log("get paper error");
      return -1;
    }
  }
  return context.state.papers[user];
}

export async function getMessages(context) {
  // check for cache
  const msgs = context.state.messages;
  //TODO: cache
  // if (msgs.length > 0) {
  //   return;
  // }
  const result = await axios.get(
    `http://39.107.235.247:3000/users/${context.state.userData.username}/chats`
  );
  if (result.data.code == 200) {
    context.commit("updateMessages", result.data.data);
    return 0;
  } else {
    console.log("get chat error");
    return 1;
  }
}

export async function updateUserData(context, newUserData) {
  const result = await axios.put(
    `http://39.107.235.247:3000/users/${context.state.userData.username}`,
    {
      data: newUserData
    }
  );
  if (result.data.code == "200") {
    console.log("update userdata success");
    context.commit("updateUserData", newUserData);
    return 0;
  } else {
    console.log("update userdata failed");
    return 1;
  }
}

export async function getUser(context, username) {
  if (!context.state.user[username]) {
    const result = await axios.get(
      `http://39.107.235.247:3000/users/${username}`
    );
    context.commit("updateUser", result.data);
  }
  return context.state.user[username];
}

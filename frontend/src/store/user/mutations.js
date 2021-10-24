export function updateUserData(state, userData) {
  state.userData = userData;
}

export function updateMessages(state, msgs) {
  state.messages = msgs;
}

export function updatePapers(state, { user, papers }) {
  state.papers[user] = papers;
}

export function appendMsg(state, { friend, content, timestamp }) {
  let chats = state.messages;
  console.log("chats=", chats);
  let i = 0;
  let newMsg = {
    user: state.userData.username,
    content,
    timestamp
  };
  for (; i < chats.length; i++) {
    if (chats[i].friend.username === friend.username) {
      // chat with old friend
      chats[i].messages.push(newMsg);
      break;
    }
  }
  if (i == chats.length) {
    // chat with new friend(i.e. no previous messages)
    chats.push({
      friend,
      messages: [newMsg]
    });
  }
  console.log("new chats=", state.messages);
}

export function updatePassword(state, password) {
  state.userData.password = password;
}

export function setusername(state, username) {
  state.userData.username = username;
}

export async function updateUser(state, user) {
  state.user[user.username] = user;
}

export async function clearUserPapers(state, user) {
  if (state.papers[user])
    delete state.papers[user];
}

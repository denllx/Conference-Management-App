import axios from "axios";

export async function newConference(context, dic) {
  var name = dic["name"];
  var data = dic["data"];
  const result = await axios.post(
    `http://39.107.235.247:3000/conferences`,
    dic
  );

  if (result.data["code"] == 200) {
    let id = result.data["id"];
    await getConference(context, id);
    context.commit("addConferenceID", id);
    await getConferences(context, name);
    var newUserData = await axios.get(
      `http://39.107.235.247:3000/users/${name}`
    );
    newUserData = newUserData.data;
    newUserData["conferences"] = context.state.conference_id;
  }
  return result.data["code"];
}

export async function newKeynote(context, dic) {
  var conference_id = dic["id"];
  var data = dic["data"];
  const result = await axios.post(
    `http://39.107.235.247:3000/conferences/keynote`,
    dic
  );

  if (result.data["code"] == 200) {
    await getConference(context, conference_id);
  }
  return result.data["code"];
}

export async function newEvent(context, dic) {
  var conference_id = dic["id"];
  var data = dic["data"];
  const result = await axios.post(
    `http://39.107.235.247:3000/conferences/event`,
    dic
  );

  if (result.data["code"] == 200) {
    await getConference(context, conference_id);
  }
  return result.data["code"];
}

export async function newSession(context, dic) {
  var conference_id = dic["id"];
  var data = dic["data"];
  const result = await axios.post(
    `http://39.107.235.247:3000/conferences/session`,
    dic
  );

  if (result.data["code"] == 200) {
    await getConference(context, conference_id);
  }
  return result.data["code"];
}

export async function newPaper(context, dic) {
  var session_id = dic["id"];
  var data = dic["data"];
  const result = await axios.post(
    `http://39.107.235.247:3000/conferences/paper`,
    dic
  );
  if (result.data["code"] == 200) {
    var paper_id = result.data["id"];
    await getSession(context, session_id);
  }
  return result.data["code"];
}

export async function getConference(context, id) {
  const result = await axios.get(
    `http://39.107.235.247:3000/conferences/${id}`
  );
  context.commit("updateConference", result.data);
  return context.state.conference[id];
}

export async function getKeynote(context, id) {
  const result = await axios.get(
    `http://39.107.235.247:3000/conferences/keynotes/${id}`
  );
  // context.commit("updateSession", result.data);
  console.log(result.data);
  return result.data;
}

export async function getSession(context, id) {
  const result = await axios.get(
    `http://39.107.235.247:3000/conferences/sessions/${id}`
  );
  // context.commit("updateSession", result.data);
  return result.data;
}

export async function getPaper(context, id) {
  const result = await axios.get(
    `http://39.107.235.247:3000/conferences/getpaper/${id}`
  );
  // context.commit("updatePaper", result.data);
  return result.data;
}

export function getCurrentConference(context) {
  return context.state.current_conference;
}

export function getCurrentSession(context) {
  return context.state.current_session;
}

export async function updateInfo(context, name) {
  var result = await axios.get(`http://39.107.235.247:3000/users/${name}`);
  var id_list = result.data["conferences"];
  context.commit("setConferenceID", id_list);
}
export async function getConferences(context, name) {
  const result = await axios.get(
    `http://39.107.235.247:3000/conferences/myconferences/${name}`
  );
  //const result = await axios.post(`http://39.107.235.247:3000/conferences/management");
  context.commit("updateConferences", result.data["conference"]);
}

export async function modifyConference(context, data) {
  var id = data["id"];
  var body = data["body"];
  const result = await axios.put(
    `http://39.107.235.247:3000/conferences/${id}`,
    body
  );
  //context.commit("deleteConference", id);
  return 200;
}

export async function deleteConference(context, dic) {
  const result = await axios.patch(
    `http://39.107.235.247:3000/conferences/conference`,
    dic
  );
  return 200;
}

export async function deletePaper(context, dic) {
  const result = await axios.patch(
    `http://39.107.235.247:3000/conferences/paper`,
    dic
  );
  return 200;
}

export async function deleteSession(context, dic) {
  const result = await axios.patch(
    `http://39.107.235.247:3000/conferences/session`,
    dic
  );
  return 200;
}

export async function deleteKeynote(context, dic) {
  const result = await axios.patch(
    `http://39.107.235.247:3000/conferences/keynote`,
    dic
  );
  return 200;
}

export async function deleteEvent(context, dic) {
  const result = await axios.patch(
    `http://39.107.235.247:3000/conferences/event`,
    dic
  );
  return 200;
}
export async function modifyKeynote(context, data) {
  var id = data["id"];
  var body = data["body"];
  const result = await axios.put(
    `http://39.107.235.247:3000/conferences/keynotes/${id}`,
    body
  );
  return 200;
}

export async function modifySession(context, data) {
  var id = data["id"];
  var body = data["body"];
  const result = await axios.put(
    `http://39.107.235.247:3000/conferences/sessions/${id}`,
    body
  );
  return 200;
}

export async function modifyEvent(context, data) {
  var id = data["id"];
  var body = data["body"];
  const result = await axios.put(
    `http://39.107.235.247:3000/conferences/events/${id}`,
    body
  );
  return 200;
}

export async function modifyPaper(context, data) {
  var id = data["id"];
  var body = data["body"];
  const result = await axios.put(
    `http://39.107.235.247:3000/conferences/papers/${id}`,
    body
  );
  return 200;
}

export async function getSessionIDs(context, id) {
  const result = await axios.get(
    `http://39.107.235.247:3000/conferences/getsessions/${id}`
  );
  return result.data.sessions;
}

export async function getKeynoteIDs(context, id) {
  const result = await axios.get(
    `http://39.107.235.247:3000/conferences/getkeynotes/${id}`
  );
  return result.data.keynotes;
}

export async function getPapers(context, id) {
  const result = await axios.get(
    `http://39.107.235.247:3000/conferences/sessions/management/${id}/papers`
  );
  return result.data;
}

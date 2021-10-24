import axios from "axios";

export async function getConferences(context) {
  if (!context.state.conferences) {
    const result = await axios.get(`http://39.107.235.247:3000/conferences`);
    context.commit("updateConferences", result.data);
  }
  return context.state.conferences;
}

export async function getConference(context, id) {
  if (!context.state.conference[id]) {
    const result = await axios.get(
      `http://39.107.235.247:3000/conferences/${id}`
    );
    context.commit("updateConference", result.data);
  }
  return context.state.conference[id];
}

export async function getSession(context, id) {
  if (!context.state.session[id]) {
    const result = await axios.get(
      `http://39.107.235.247:3000/conferences/sessions/${id}`
    );
    context.commit("updateSession", result.data);
  }
  return context.state.session[id];
}

export async function getPapers(context, { id, update }) {
  if (update || !context.state.conference[id]) {
    const result = await axios.get(
      `http://39.107.235.247:3000/conferences/sessions/${id}/papers`
    );
    context.commit("updatePapers", {
      id,
      data: result.data
    });
  }
  return context.state.papers[id];
}

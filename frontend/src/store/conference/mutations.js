export function updateConferences(state, conferences) {
  state.conferences = conferences;
}

export function updateConference(state, conference) {
  state.conference[conference._id] = conference;
}

export function updatePapers(state, { id, data }) {
  state.papers[id] = data;
}

export function updateSession(state, session) {
  state.session[session._id] = session;
}

export function clearCache(state) {
  state.conferences = null;
  state.conference = {};
  state.session = {};
  state.papers = {};
}

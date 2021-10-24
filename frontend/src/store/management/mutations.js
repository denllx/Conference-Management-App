export function updateConferences(state, conferences) {
    state.conferences = conferences;
  }
  
  export function updateConference(state, conference) {
    state.conference[conference._id] = conference;
  }

  export function deleteConference(state, id) {
    delete state.conference[id];
  }

  
  export function addConferenceID(state, id) {
    state.conference_id = state.conference_id.concat([id]);
  }
  export function setConferenceID(state, id_list) {
    state.conference_id = id_list;
  }

  export function setCurrentConference(state, id) {
    state.current_conference = id;
  }

  export function setCurrentSession(state, id) {
    state.current_session = id;
  }


  
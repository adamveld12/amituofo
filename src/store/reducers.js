import {
  SESSION_START,
  SESSION_TICK,
  SESSION_PAUSE,
  SESSION_RESET,
  SESSION_COMPLETE,
  SESSION_INTERRUPT,
  SESSION_QUIT,
  TIMER_EDIT_APPLY,
  TIMER_EDIT,
  AUDIO_PLAY,
  AUDIO_FILE_EDIT,
  AUDIO_STOP,
  AUDIO_VOLUME_EDIT,
  LOAD_STATE,
} from './actions/types.js'

const session = (state, action) => {
  const ns = { ...state }
  const session = state.session
  switch(action.type){
    case SESSION_START:
      ns.session = {
        ...session,
        started: true,
        active: true,
        completed: false,
        remaining: session.duration
      }
      break
    case SESSION_TICK:
      ns.session.remaining = action.remaining
      break
    case SESSION_PAUSE:
      ns.session.active = false
      break
    case SESSION_RESET:
      ns.time.edit = false
      ns.session = {
        ...session,
        started: false,
        active: false,
        completed: false,
        remaining: session.duration,
        interruptions: 0,
      }

      break
  }

  return ns
}

const stats = (state, action) => {
  const ns = { ...state }
  const session = state.session

  switch(action.type){
    case SESSION_COMPLETE:
      ns.session = {
        ...session,
        started: true,
        active: false,
        completed: true,
        remaining: 0,
        interruptions: 0
      }

      const completedSession = {
        timestamp: (new Date()).toUTCString(),
        interruptions: session.interruptions,
        duration: session.duration
      }

      ns.stats.completed = state.stats.completed.concat([completedSession])
      break
    case SESSION_INTERRUPT:
      if (ns.session.active)
        ns.session.interruptions = session.interruptions + 1
      break
    case SESSION_QUIT:
      if (session.remaining < session.duration && session.started) {
        const prematureEndedSession = {
          timestamp: (new Date()).toUTCString(),
          iterruptions: session.interruptions,
          duration: session.duration,
          timeLeft: session.remaining
        }

        ns.stats.quits = state.stats.quits.concat([prematureEndedSession])
      }
      break
  }

  return ns
}

const timer_edit = (state, { type, duration, mode }) => {
  const ns = {...state}
  const session = state.session
  switch(type){
    case TIMER_EDIT_APPLY:
      ns.session = {
        ...session,
        duration,
        remaining: duration,
      }
      ns.time.edit = false
      break
    case TIMER_EDIT:
      ns.time.edit = mode
      break
  }
  return ns
}

const audio = (state, { type, volume, audioURI }) => {
  const ns = {...state}
  switch(type){
    case AUDIO_PLAY:
      ns.audio.playing = true
      break
    case AUDIO_STOP:
      ns.audio.playing = false
      break
    case AUDIO_FILE_EDIT:
      ns.audio.audioURI = audioURI
      break
    case AUDIO_VOLUME_EDIT:
      ns.audio.finalVolume = volume
      break
  }
  return ns
}

const storage = (state, { type, state: loadedState }) => {
  const ns = {...state}
  switch(type){
    case LOAD_STATE:
    ns.stats = loadedState.stats
    //ns.audio = loadedState.audio
    ns.session = loadedState.session
    ns.session.active = false
    break
    // maybe add clear state
  }

  return ns
}

export default [ session, stats, timer_edit, audio, storage ]

import {
  SESSION_START,
  SESSION_TICK,
  SESSION_PAUSE,
  SESSION_RESET,
  SESSION_COMPLETE,
  SESSION_INTERRUPT,
  SESSION_QUIT,
  TIMER_EDIT_APPLY,
  TIMER_EDIT_UPDATE,
  TIMER_EDIT,
  AUDIO_PLAY,
  AUDIO_FILE_EDIT,
  AUDIO_STOP,
  AUDIO_VOLUME_EDIT,
  REPLACE_STATE,
  ANALYTICS_IDENTIFY
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
      ns.timer.edit = false
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
        duration: ns.timer.minutes * 60,
        remaining: ns.timer.minutes * 60,
      }
      ns.timer.edit = false
      break
    case TIMER_EDIT:
      ns.timer.edit = mode
      ns.timer.minutes = Math.floor(ns.session.duration / 60)
      break
    case TIMER_EDIT_UPDATE:
      ns.timer.minutes = duration
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
    case REPLACE_STATE:
    ns.user = Object.assign(state.user, loadedState.user)

    ns.timer = Object.assign(state.timer, {
        edit: false
    })

    ns.session = Object.assign(state.session, loadedState.session, {
        started: false,
        active: false,
        completed: false,
    })

    ns.audio = Object.assign(state.audio, loadedState.audio, {
        playing: false,
    })

    ns.stats = Object.assign(state.stats, loadedState.stats)

    break
  }

  return ns
}

const analytics = (state, { type, identity }) => {
  const ns = {...state}
  switch(type){
    case ANALYTICS_IDENTIFY:
        ns.user = Object.assign(state.user, identity)

        if (__DEV__){
            ns.user = {
                id: `developer-1337`,
                username: "developer"
            }
        }

    break
  }

  return ns

}

export default [ session, stats, timer_edit, audio, storage, analytics]

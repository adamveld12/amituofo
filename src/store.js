import timer from './timer'
import player from './player'
import weedux, { middleware } from 'weedux'
import { AsyncStorage } from 'react-native'

const { thunk, logger } = middleware

const initialState = {
  time: {
    edit: false,
    active: false,
  },
  session: {
    // if a countdown was started
    started: false,
    // if the countdown is active
    active: false,
    // if the session is finished
    completed: false,
    // how long the session will last in seconds
    duration: 10, //5 * 60,
    // how many seconds are left in the session
    remaining: 10, //5 * 60,
    // the # of interruptions (pauses) during the session
    interruptions: 0,
  },
  audio: {
    audioURI: 'singing_gong.mp3',
    playing: false,
    finalVolume: 1,
  },
  stats: {
    // sessions that were quit before finishing
    quits: [],
    // sessions that were successfully completed
    completed: [],
  }
}

const reducers = [
  // session
  (state, action) => {
    const ns = { ...state }
    const session = state.session
    switch(action.type){
      case 'SESSION_START':
        ns.session = {
          ...session,
          started: true,
          active: true,
          completed: false,
          remaining: session.duration
        }
        break
      case 'SESSION_TICK':
        ns.session.remaining = action.remaining
        break
      case 'SESSION_PAUSE':
        ns.session.active = false
        timerHandle && timerHandle.stop()
        break
      case 'SESSION_RESET':
        ns.time.edit = false
        ns.session = {
          ...session,
          started: false,
          active: false,
          completed: false,
          remaining: session.duration,
          interruptions: 0,
        }

        timerHandle && timerHandle.stop()
        break
    }

    return ns
  },
  // stats
  (state, action) => {
    const ns = { ...state }
    const session = state.session

    switch(action.type){
      case 'SESSION_COMPLETE':
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
        timerHandle && timerHandle.stop()
        __DEV__ && console.log(completedSession)
        break
      case 'SESSION_INTERRUPT':
        if (ns.session.active)
          ns.session.interruptions = session.interruptions + 1
        break
      case 'SESSION_QUIT':
        if (session.remaining < session.duration && session.started) {
          const prematureEndedSession = {
            timestamp: (new Date()).toUTCString(),
            iterruptions: session.interruptions,
            duration: session.duration,
            timeLeft: session.remaining
          }

          ns.stats.quits = state.stats.quits.concat([prematureEndedSession])
          __DEV__ && console.log(prematureEndedSession)
        }
        break
    }

    return ns
  },
  // timer edit
  (state, { type, duration, mode }) => {
    const ns = {...state}
    const session = state.session
    switch(type){
      case 'TIMER_EDIT_APPLY':
        ns.session = {
          ...session,
          duration,
          remaining: duration,
        }
        break
      case 'TIMER_EDIT':
        ns.time.edit = mode
        break
    }
    return ns
  },
  // audio
  (state, { type, volume, audioURI }) => {
    const ns = {...state}
    switch(type){
      case 'AUDIO_BEGIN_LOAD':
      case 'AUDIO_LOADED':
      case 'AUDIO_PLAY':
        ns.audio.active = true
        break
      case 'AUDIO_FILE_EDIT':
        ns.audio.audioURI = audioURI
        break
      case 'AUDIO_VOLUME_EDIT':
        ns.audio.finalVolume = volume
        break
    }
    return ns
  },
  // load from storage
  (state, { type, state: loadedState }) => {
    const ns = {...state}
    switch(type){
      case 'LOAD_STATE':
      ns.stats = loadedState.stats
      //ns.audio = loadedState.audio
      ns.session = loadedState.session
      ns.session.active = false
      break
      // maybe add clear state
    }

    return ns
  },
]

const persist = store => next => action => {
  next(action)
  AsyncStorage.setItem('@amituofo:state', JSON.stringify(store.getState()))
              .then(() => __DEV__ && console.log("saved state"))
              .catch((e) => __DEV__ && console.error(e))
}


const store = new weedux(initialState, reducers, [logger, thunk, persist])
export default store
export const onDispatchComplete = store.onDispatchComplete.bind(store)
export const removeOnDispatchComplete = store.removeOnDispatchComplete.bind(store)
export const dispatcher = store.dispatcher.bind(store)
export const state = store.getState.bind(store)

const dispatch = store.dispatcher()


var timerHandle = undefined
var playerHandle = undefined
export const actions = {
  load: () => {
    dispatch((d) => {
      AsyncStorage.getItem('@amituofo:state').then((state) => {
        const newState = JSON.parse(state)
        console.log(newState)
        //d({ type: 'LOAD_STATE', state: Object.assign(initialState, newState) })
      }).catch((e) => console.error(e) )
    })
  },
  start: (duration, cb) => {
    dispatch((d) => {
      d({ type: 'SESSION_START', duration })

      timerHandle && timerHandle.stop()

      timerHandle = timer(duration,
                    (remaining) => d({ type: 'SESSION_TICK', remaining }),
                    () => actions.complete())


      const reset = () => {
        d({ type: 'SESSION_QUIT' })
        d({ type: 'SESSION_RESET', duration })
      }

      const pause = () => {
        d({ type: 'SESSION_INTERRUPT' })
        d({ type: 'SESSION_PAUSE' })
      }

      cb({ reset, pause })
    })
  },
  complete: () => {
    playerHandle && playerHandle.stop()
    console.log("firing complete")

    const { audioURI, finalVolume } = store.getState().audio
    playerHandle = player(audioURI, finalVolume, 12, (e) => {
      if (e){
        console.error(e)
        return
      }
    })

    dispatch({ type: 'SESSION_COMPLETE' })
  },
  edit_mode: (mode) => dispatch((d) => {
    playerHandle && playerHandle.stop()

    d({ type: 'SESSION_INTERRUPT' })
    d({ type: 'SESSION_PAUSE' })
    d({ type: 'TIMER_EDIT', mode: !!mode })
  }),
  apply_edit: (duration) => dispatch((d) => {
    playerHandle && playerHandle.stop()

    d({ type: 'TIMER_EDIT_APPLY', duration })
    d({ type: 'TIMER_EDIT', mode: false })
    d({ type: 'SESSION_RESET' })
  }),
}

import timer from './timer.js'
import weedux, { middleware } from 'weedux'
const { thunk } = middleware


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
    duration: 60 * 60,
    // how many seconds are left in the session
    remaining: 60 * 60,
    // the # of interruptions (pauses) during the session
    interruptions: 0,
  },
  audio: {
    audioURI: '',
    playing: false,
    finalVolume: 0,
  },
  stats: {
    // sessions that were quit before finishing
    quits: [],
    // sessions that were successfully completed
    completed: [],
  }
}

var handle = undefined
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
        if (handle)
          handle.stop()


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

        if (handle)
          handle.stop()

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
        console.log(completedSession)

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
          console.log(prematureEndedSession)
        }
        break
    }

    return ns
  },
  // timer edit
  (state, action) => {
    const ns = {...state}
    const session = state.session
    switch(action.type){
      case 'TIMER_EDIT_APPLY':
        ns.session = {
          ...session,
          duration: action.duration,
          remaining: action.duration,
        }
        break
      case 'TIMER_EDIT':
        ns.time.edit = action.mode
        break
    }
    return ns
  },
  (state, action) => {
    const ns = {...state}
    switch(action.type){
      case 'AUDIO_PLAY':
      case 'AUDIO_FILE_EDIT':
      case 'AUDIO_VOLUME_EDIT':
    }
    return ns
  }

]

const store = new weedux(initialState, reducers, [thunk])
export default store
export const onDispatchComplete = store.onDispatchComplete.bind(store)
export const removeOnDispatchComplete = store.removeOnDispatchComplete.bind(store)
export const dispatcher = store.dispatcher.bind(store)
export const state = store.getState.bind(store)


const dispatch = store.dispatcher()
export const actions = {
  start: (duration, cb) => {
    dispatch((d) => {
      d({ type: 'SESSION_START', duration })

      if (handle) {
        handle.stop()
      }

      handle = timer(duration,
                    (remaining) => d({ type: 'SESSION_TICK', remaining }),
                    () => d({ type: 'SESSION_COMPLETE' }) )


      const reset = () => {
        handle.stop()
        d({ type: 'SESSION_QUIT' })
        d({ type: 'SESSION_RESET', duration })
      }

      const pause = () => {
        handle.stop()
        d({ type: 'SESSION_INTERRUPT' })
        d({ type: 'SESSION_PAUSE' })
      }

      cb({ reset, pause })
    })
  },
  complete: () => dispatch({ type: 'SESSION_COMPLETE' }),
  edit_mode: (mode) => dispatch((d) => {
    d({ type: 'SESSION_INTERRUPT' })
    d({ type: 'SESSION_PAUSE' })
    d({ type: 'TIMER_EDIT', mode: !!mode })
  }),
  apply_edit: (duration) => dispatch((d) => {
    d({ type: 'TIMER_EDIT_APPLY', duration })
    d({ type: 'TIMER_EDIT', mode: false })
    d({ type: 'SESSION_RESET' })
  })
}

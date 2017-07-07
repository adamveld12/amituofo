import weedux, { middleware } from 'weedux'
import { AsyncStorage } from 'react-native'
import reducers from './reducers'
import createSagaMiddleware from 'redux-saga'
import { v4 } from 'uuid'

const { thunk, logger } = middleware

export const initialState = {
  user: {
      id: v4(),
      username: "user",
  },
  time: {
      // if timer is in edit mode
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
    duration: 1, //5 * 60,
    // how many seconds are left in the session
    remaining: 1, //5 * 60,
    // the # of interruptions (pauses) during the session
    interruptions: 0,
  },
  audio: {
    audioURI: 'singing_gong.mp3',
    playing: false,
    finalVolume: 1,
    rampTime: 12
  },
  stats: {
    // sessions that were quit before finishing
    quits: [],
    // sessions that were successfully completed
    completed: [],
  }
}

const sagaMiddleware = createSagaMiddleware()

const persist = s => n => a => {
    n(a)
    n({ type: "SAVE_STATE" })
}

const actionLog = s => n => a => {
    if (__DEV__) {
        const oldState = s.getState()
        n(a)
        const newState = s.getState()
        console.info("ACTION - ", a, " STATE - BEFORE:", oldState, " AFTER:", newState)
    } else {
        n(a)
    }
}

export const store = new weedux(initialState, reducers, [actionLog, persist, sagaMiddleware])

import sagas from './sagas'
sagaMiddleware.run(sagas)

export const subscribe = store.subscribe
export const dispatch = store.dispatch
export const getState = store.getState

import actionCreators from './actions/index.js'
export const actions = actionCreators(store.dispatch)

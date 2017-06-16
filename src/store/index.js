import weedux, { middleware } from 'weedux'
import { AsyncStorage } from 'react-native'
import reducers from './reducers'
import createSagaMiddleware from 'redux-saga'

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


const persist = store => next => action => {
  next(action)
  AsyncStorage.setItem('@amituofo:state', JSON.stringify(store.getState()))
              .then(() => __DEV__ && console.log("saved state"))
              .catch((e) => __DEV__ && console.error(e))
}

const sagaMiddleware = createSagaMiddleware()
export const store = new weedux(initialState, reducers, [logger, thunk, persist, sagaMiddleware])

import sagas from './sagas'
sagaMiddleware.run(sagas)

export const subscribe = store.subscribe
export const dispatch = store.dispatch
export const getState = store.getState

import actionContext from './actions.js'
export const actions = actionContext(store.dispatch)

import actionCreators from './actions/index.js'
export const actions2 = actionCreators(store.dispatch)

import { take, put, call, fork, race, cancelled } from 'redux-saga/effects'
import { eventChannel, END } from 'redux-saga'
import {
  SESSION_START,
  SESSION_TICK,
  SESSION_PAUSE,
  SESSION_COMPLETE,
  SESSION_INTERRUPT,
  SESSION_QUIT,
  SESSION_RESET,
  TIMER_EDIT
} from '../actions/types.js'

const countdown = (seconds) => {
  __DEV__ && console.log("creating a countdown for", seconds)
  return eventChannel(listener => {
    const increment = 100
    let timeRemaining = seconds * 1000

    setImmediate(() => listener(timeRemaining/1000))

    const handle = setInterval(() => {
      timeRemaining = timeRemaining - increment
      if (timeRemaining > 0){
        listener(timeRemaining/1000)
      } else if (timeRemaining <= 0){
        listener(END)
        clearInterval(handle)
      }
    }, increment)

    return () => clearInterval(handle)
  })
}

function* incrementTimer({ duration }){
  const chan = yield call(countdown, duration)
  try {
    while(true){
      let remaining = yield take(chan)
      yield put({ type: SESSION_TICK, remaining })
    }
  } finally {
    if(!(yield cancelled()))
      yield put({ type: SESSION_COMPLETE })
  }
}

export default function* startTimerSaga(seconds){
  try {
    while(true){
      const action = yield take(SESSION_START)
      const { reset, edit_mode, paused } = yield race({
        timer: call(incrementTimer, action),
        paused: take(SESSION_PAUSE),
        reset: take(SESSION_RESET),
        edit_mode: take(TIMER_EDIT)
      })

      if(reset || edit_mode)
        yield put({ type: SESSION_QUIT })
      else if (paused)
        yield put({ type: SESSION_INTERRUPT })
    }
  } finally {
    console.log("timer terminated")
  }
}

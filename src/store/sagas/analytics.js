import { take, put, call, fork, race, cancelled, select } from 'redux-saga/effects'
import { eventChannel, END } from 'redux-saga'

import config from '../../config'
import { Sentry, SentrySeverity } from 'react-native-sentry'


Sentry.config(config.SENTRY_URL, Object.assign(config.SENTRY_OPTS, { })).install()

if (__DEV__){
    Sentry.setEventSentSuccessfully((event) => {
      console.info('sentry event', Sentry.lastEventId(), '-', Sentry.lastException())
    })
}

import {
  SESSION_START,
  SESSION_TICK,
  SESSION_PAUSE,
  SESSION_COMPLETE,
  SESSION_INTERRUPT,
  SESSION_QUIT,
  SESSION_RESET,
  TIMER_EDIT,
  AUDIO_PLAY,
  AUDIO_STOP,
  ANALYTICS_ERROR
} from '../actions/types.js'

function* startSentry({ id = "", username = "dude" }){
  try {
    // set the context
    Sentry.setUserContext({
        userID: id,
        username
    })

    Sentry.setTagsContext({
        "environment": __DEV__ ? "development" : "production",
    })


    while(true){
        // next record any actions we're interested in
        const action = yield take('*')

        if (action.type === SESSION_TICK) {
            continue
        } else if (action.type === ANALYTICS_ERROR) {
           Sentry.captureMessage(`${action.message}--${action.error}`)
           // throw because the app is now in an inconsistent state
           if (action.error)
               throw action.error

        } else {
            Sentry.captureBreadcrumb({
                category: 'action',
                data: action
            })
        }
    }
  } finally {
    __DEV__ && console.log("sentry terminated")
  }
}


export default function* startAnalytics(){
  try {
    // execute the sentry saga so it can capture events
    while(true){
        // first step is to do an identify call
        const identity = yield select((s) => s.user)
        // next record any actions we're interested in
        yield call(startSentry, identity)
    }
  } finally {
  }
}

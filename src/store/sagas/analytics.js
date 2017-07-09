import { take, put, call, fork, race, cancelled, select } from 'redux-saga/effects'
import { eventChannel, END } from 'redux-saga'
import { Sentry, SentrySeverity } from 'react-native-sentry'

import { v4 } from 'uuid'

import config from '../../config'


Sentry.config(config.SENTRY_URL, Object.assign(config.SENTRY_OPTS, {
    deactivateStacktraceMerging: true
})).install()

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
  ANALYTICS_ERROR,
  ANALYTICS_IDENTIFY,
  LOAD_STATE_FINISHED,
} from '../actions/types.js'

function* startSentry({ id, username }){
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

        // we don't need to flood the breadcrumbs with session_ticks
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

function* setContext(identity){
    try {
        console.log(id, '-', username)

        // execute the sentry saga so it can capture events
        while(true){
            // first step is to do an identify call
            const identity = yield select((s) => s.user)
            // next record any actions we're interested in
            yield call(startSentry, identity)
        }
    } finally {
        __DEV__ && console.log("sentry terminated")
    }
}

function* identify(){
    var identity = yield select((s) => s.user)

    if (!identity || !identity.id) {
        __DEV__ && console.log("no identity found, generating a new one")
        identity = {
            id: v4(),
            username: "user"

        }
    }

    yield put({ type: ANALYTICS_IDENTIFY, identity })

    return identity
}


export default function* startAnalytics(){
  try {
    // execute the sentry saga so it can capture events
    while(true){
        // wait until data has been loaded from storage
        yield take(LOAD_STATE_FINISHED)
        const identity = yield call(identify)
        // next record any actions we're interested in
        yield call(startSentry, identity)
    }
  } finally {
    __DEV__ && console.log("sentry terminated")
  }
}

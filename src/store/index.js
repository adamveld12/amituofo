import createSagaMiddleware from 'redux-saga'
import Weedux from 'weedux'
import reducers from './reducers'
import sagas from './sagas'
import a from './actions/index'

export const initialState = {
    user: {},
    timer: {
        // if timer is in edit mode
        edit: false,
        minutes: 0,
    },
    session: {
        // if a countdown was started
        started: false,
        // if the countdown is active
        active: false,
        // if the session is finished
        completed: false,
        // how long the session will last in seconds
        duration: 1, // 5 * 60,
        // how many seconds are left in the session
        remaining: 1, // 5 * 60,
        // the # of interruptions (pauses) during the session
        interruptions: 0,
    },
    audio: {
        audioURI: 'singing_gong.mp3',
        playing: false,
        finalVolume: 1,
        rampTime: 12,
    },
    stats: {
    // sessions that were quit before finishing
        quits: [],
        // sessions that were successfully completed
        completed: [],
    },
}

const sagaMiddleware = createSagaMiddleware()

const actionLog = ({ getState }) => next => (action) => {
    // eslint-disable-next-line no-undef 
    if (__DEV__) {
        try {
            console.groupCollapsed('STATE', action)
            const oldState = getState()
            console.info('OLD', oldState)
            next(a)
            const newState = getState()
            console.info('NEW', newState)
        } finally {
            console.groupEnd()
        }
    } else {
        next(a)
    }
}

export const store = new Weedux(initialState, reducers, [actionLog, sagaMiddleware])

sagaMiddleware.run(sagas)

export const subscribe = store.subscribe
export const dispatch = store.dispatch
export const getState = store.getState
export const actions = a

import createSagaMiddleware from 'redux-saga'
import Weedux from 'weedux'
import reducers from './reducers'
import sagas from './sagas'
import a from './actions/index'

const STARTING_TIME = (__DEV__) ? 1 : 5 * 60

export const initialState = {
    user: {},
    timer: {
        // if timer is in edit mode
        edit: false,
        minutes: 0,
    },
    session: {
        // if a meditation session was started
        started: false,
        // if the countdown timer is active
        active: false,
        // if the session is finished
        completed: false,
        // how long the session will last in seconds
        duration: STARTING_TIME,
        // how many seconds are left in the session
        remaining: STARTING_TIME,
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
            console.groupCollapsed(`ACTION ${action.type}`, action)

            console.info('OLD', getState())

            next(action)

            console.info('NEW', getState())
        } finally {
            console.groupEnd()
        }
    } else {
        next(action)
    }
}

export const store = new Weedux(initialState, reducers, [actionLog, sagaMiddleware])

sagaMiddleware.run(sagas)

export const subscribe = store.subscribe
export const dispatch = store.dispatch
export const getState = store.getState
export const actions = a

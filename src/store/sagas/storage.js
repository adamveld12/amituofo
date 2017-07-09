import { AsyncStorage } from 'react-native'
import { take, put, call, fork, race, cancelled, select } from 'redux-saga/effects'
import { eventChannel, END } from 'redux-saga'
import {
    ANALYTICS_ERROR,
    LOAD_STATE,
    SAVE_STATE,
    CLEAR_STATE,
    LOAD_STATE_FINISHED,
    REPLACE_STATE
} from '../actions/types.js'

function* load(stateKey){
    const stateJSON = yield call(AsyncStorage.getItem, stateKey)
    const newState = JSON.parse(stateJSON)
    __DEV__ && console.log("loading state:", newState)
    if (newState !== null){
        yield put({ type: REPLACE_STATE, state: newState })
    }

    yield put({ type: LOAD_STATE_FINISHED })
}

function* save(stateKey){
    const currentState = yield select((state) => state)
    yield call(AsyncStorage.setItem, stateKey, JSON.stringify(currentState))
}

export default function* startStorageSaga(){
    const stateKey = "@amituofo:state"
    var result = null
    try {
        while(true){
            result = yield race ({
                load: take(LOAD_STATE),
                save: take(SAVE_STATE),
                clear: take(CLEAR_STATE)
            })

            if (result.load)
                yield call(load, stateKey)
            else if (result.clear)
                yield call(AsyncStorage.removeItem, stateKey)
            else if (result.save)
                yield call(save, stateKey)
        }
    } catch(e){
        yield put({
          type: ANALYTICS_ERROR,
          message: "Could not exec storage operation: " + JSON.stringify(result),
          error: e
        })
    } finally {
        __DEV__ && console.log("store saga terminated")
    }
}

import {
  SESSION_START,
  SESSION_COMPLETE,
  SESSION_PAUSE,
  SESSION_RESET,
  TIMER_EDIT,
  TIMER_EDIT_APPLY,
  AUDIO_STOP,
  SAVE_STATE,
  LOAD_STATE,
  REPLACE_STATE
} from './types.js'


const session = {
    start: (duration) => ({ type: SESSION_START, duration }),
    complete: () => ({ type: SESSION_COMPLETE }),
    pause: () => ({ type: SESSION_PAUSE }),
    reset: () => ({ type: SESSION_RESET })
}

const timer = {
    edit_mode: (mode) => ({ type: TIMER_EDIT, mode: !!mode }),
    apply_edit: (duration) => ({ type: TIMER_EDIT_APPLY, duration })
}

const storage = {
    save: () => ({ type: SAVE_STATE }),
    load: () => ({ type: LOAD_STATE }),
    replace: (state) => ({ type: REPLACE_STATE, state })
}

function wrapDispatch(action, dispatch) {
    return function(){
        return dispatch(action.apply(this, arguments))
    }
}

function wrapActions(actions, dispatch){
    const result = {}
    for (var k in actions){
        result[k] = wrapDispatch(actions[k], dispatch)
    }

    return result
}

export default (dispatch) => ({
    ...wrapActions(session, dispatch),
    ...wrapActions(timer, dispatch),
    ...wrapActions(storage, dispatch)
})

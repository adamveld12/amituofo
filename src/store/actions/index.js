import {
    SESSION_START,
    SESSION_COMPLETE,
    SESSION_INTERRUPT,
    SESSION_QUIT,
    SESSION_PAUSE,
    SESSION_RESET,
    TIMER_EDIT,
    TIMER_EDIT_UPDATE,
    TIMER_EDIT_APPLY,
    SAVE_STATE,
    LOAD_STATE,
    REPLACE_STATE,
} from './types.js'


const session = {
    start: duration => ({ type: SESSION_START, duration }),
    complete: () => ({ type: SESSION_COMPLETE }),
    pause: () => ({ type: SESSION_PAUSE }),
    reset: () => ({ type: SESSION_RESET }),
}

const timer = {
    edit: mode => ({ type: TIMER_EDIT, mode: !!mode }),
    apply: duration => ({ type: TIMER_EDIT_APPLY, duration }),
    update: duration => ({ type: TIMER_EDIT_UPDATE, duration }),
}

const storage = {
    save: () => ({ type: SAVE_STATE }),
    load: () => ({ type: LOAD_STATE }),
    replace: state => ({ type: REPLACE_STATE, state }),
}

const stats = {
    interrupt: () => ({ type: SESSION_INTERRUPT }),
    quit: () => ({ type: SESSION_QUIT }),
}

export default {
    session,
    timer,
    storage,
    stats,
}

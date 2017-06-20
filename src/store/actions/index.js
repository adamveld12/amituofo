import {
  SESSION_START,
  SESSION_COMPLETE,
  SESSION_PAUSE,
  SESSION_RESET,
  TIMER_EDIT,
  TIMER_EDIT_APPLY,
  AUDIO_STOP,
} from './types.js'

function wrapDispatch(actionCreator, dispatch) {
   return function() {
     dispatch(actionCreator.apply(this, arguments))
   }
}

const sessionActions = {
  start: (duration) => ({ type: SESSION_START, duration }),
  complete: () => ({ type: SESSION_COMPLETE }),
  pause: () => ({ type: SESSION_PAUSE }),
  reset: () => ({ type: SESSION_RESET })
}

const timerActions = {
  edit_mode: (mode) => ({ type: TIMER_EDIT, mode: !!mode }),
  apply_edit: (duration) => ({ type: TIMER_EDIT_APPLY, duration })
}

export default function actionCreator(dispatch){
  const actions = {
    ...sessionActions,
    ...timerActions,
  }

  for (var k in actions){
    actions[k] = wrapDispatch(actions[k], dispatch)
  }

  return actions
}

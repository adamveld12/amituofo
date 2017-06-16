import player from '../player'
import { AsyncStorage } from 'react-native'

import { call, put, takeEvery, takeLatest } from 'redux-saga/effects'
import { delay } from 'redux-saga'


var playerHandle = undefined

export default (dispatch) => {
  const actions =
  {
    load: () =>{
      dispatch((d) => {
        AsyncStorage.getItem('@amituofo:state').then((state) => {
          const newState = JSON.parse(state)
          console.log(newState)
          //d({ type: 'LOAD_STATE', state: Object.assign(initialState, newState) })
        }).catch((e) => console.error(e) )
      })
    },
    edit_mode: (mode) => dispatch((d) => {
      playerHandle && playerHandle.stop()

      d({ type: 'SESSION_INTERRUPT' })
      d({ type: 'SESSION_PAUSE' })
      d({ type: 'TIMER_EDIT', mode: !!mode })
    }),
    apply_edit: (duration) => dispatch((d) => {
      playerHandle && playerHandle.stop()

      d({ type: 'TIMER_EDIT_APPLY', duration })
      d({ type: 'TIMER_EDIT', mode: false })
      d({ type: 'SESSION_RESET' })
    })
  }
  return actions
}

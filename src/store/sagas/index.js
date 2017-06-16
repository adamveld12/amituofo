import { fork } from 'redux-saga/effects'

import startTimer from './timer'
import startAudio from './audio'

export default function* rootSaga(){
  yield fork(startTimer)
  yield fork(startAudio)
}

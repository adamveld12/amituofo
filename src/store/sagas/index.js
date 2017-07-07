import { fork } from 'redux-saga/effects'

import startTimer from './timer'
import startAudio from './audio'
import startAnalytics from './analytics'
import startStorage from './storage'

export default function* rootSaga(){
  yield fork(startAudio)
  yield fork(startTimer)
  yield fork(startStorage)
  yield fork(startAnalytics)
}

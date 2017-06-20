import { take, put, call, fork, race, cancelled, select } from 'redux-saga/effects'
import { eventChannel, END } from 'redux-saga'
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
} from '../actions/types.js'
import Sound from 'react-native-sound'

Sound.setCategory('Playback')

function loadSound(audioURI){
  return new Promise((resolve, reject) => {
    const alertSound = new Sound(audioURI, Sound.MAIN_BUNDLE, (error) => {
      if (error){
        reject(error)
        return
      }

      resolve(alertSound)
    })
  })
}

function playSound(audio){
  return new Promise((resolve, reject) => {
    audio.play((s) => {
      audio.release()
      resolve(s, audio)
    })
  })
}

function volumeRamp(rampTime, finalVolume, audio){
  return eventChannel(listener => {
    const interval = 100
    let currentRamp = rampTime * 1000
    const maxRamp = currentRamp

    const intervalHandle = setInterval(() => {
      currentRamp -= interval

      const normalizedVol = currentRamp / maxRamp
      console.log(`${currentRamp}/${maxRamp} - ${1 - normalizedVol}`)

      listener(finalVolume * (1 - normalizedVol))

      if (currentRamp <= 0){
        clearInterval(intervalHandle)
        listener(END)
      }
    }, interval)

    return () => {
      intervalHandle && clearInterval(intervalHandle)
    }
  });
}

function* stop(audio){
  yield take(AUDIO_STOP)
  audio.stop(() => audio.release())
}

function* ramp(audio, rampTime, finalVolume){
  try {
    __DEV__ && console.log("playing audio")
    const chan = yield call(volumeRamp, rampTime, finalVolume, audio)

    while(true){
      let volume = yield take(chan)
      audio.setVolume(volume)
    }
  } finally {
    if(!(yield cancelled())) {
      __DEV__ && console.log("audio ramped to", finalVolume)
    }
  }
}

function* play(audioURI, finalVolume, rampTime){
  yield fork(ramp, audio, rampTime, finalVolume)
}

export default function* startAudio(){
  try {
    while(true){
      const action = yield take(SESSION_COMPLETE)

      const { audioURI, finalVolume, rampTime } = yield select((state) => state.audio)

      const audio = yield call(loadSound, audioURI)
      audio.setVolume(0).setNumberOfLoops(-1)

      yield put({ type: AUDIO_PLAY })
      let rampTask = yield fork(ramp, audio, rampTime, finalVolume)

      const { audioPlayback } = yield race({
        audioPlayback: call(playSound, audio),
        cancel: take([TIMER_EDIT, SESSION_RESET, SESSION_PAUSE]),
      })

      if  (!audioPlayback){
        yield put({ type: AUDIO_STOP })
        rampTask.cancel()
        audio.stop(() => audio.release())
      }
    }
  } finally {
    __DEV__ && console.log("audio stopped")
  }
}

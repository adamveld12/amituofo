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
  AUDIO_STOP
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
    var thandle

    const intervalHandle = setInterval(() => {
      currentRamp -= interval

      const normalizedVol = currentRamp / maxRamp
      console.log(`${currentRamp}/${maxRamp} - ${1 - normalizedVol}`)

      listener(finalVolume * (1 - normalizedVol))

      if (currentRamp <= 0){
        clearInterval(intervalHandle)
        audio.setNumberOfLoops(0)

         thandle = setTimeout(() => {
            listener(END)
         }, interval * 100)
      }
    }, interval)

    return () => {
      intervalHandle && clearInterval(intervalHandle)
      thandle && clearTimeout(thandle)
    }
  });
}

function* play(audioURI, finalVolume, rampTime){
  const audio = yield call(loadSound, audioURI)
  console.log(audio)

  try {
    audio.setVolume(0).setNumberOfLoops(-1)

    console.log("playing audio")
    const handle = yield fork(playSound, audio)


    const chan = yield call(volumeRamp, rampTime, finalVolume, audio)
    while(true){
      let volume = yield take(chan)
      audio.setVolume(volume)
    }

  } finally {
    if(!(yield cancelled()))
      console.log("audio completed successfully")

    audio.stop(() => audio.release())
  }
}

export default function* startAudio(){
  try {
    while(true){
      const action = yield take(SESSION_COMPLETE)
      const { audioURI, finalVolume, playing } = yield select((state) => state.audio)
      console.log("starting audio")
      const { rampUpVolume } = yield race({
        rampUpVolume: call(play, audioURI, finalVolume, 7),
        edit: take(TIMER_EDIT),
        reset: take(SESSION_RESET),
        pause: take(SESSION_PAUSE),
      })

      if  (!rampUpVolume){
        yield put({ type: AUDIO_STOP })
      }
    }
  } finally {
    console.log("audio stopped")
  }
}

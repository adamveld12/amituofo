import Sound from 'react-native-sound'

Sound.setCategory('Playback')

export default (audioURI, volume, rampTime, onLoad) => {
    var handle, cancelled;
    console.log("loading audio", audioURI)
    const alertSound = new Sound(audioURI, Sound.MAIN_BUNDLE, (error) => {
      onLoad && onLoad(error)

      console.log("loaded", audioURI)
      if (error){
        console.log("could not load sound")
        return
      }

      alertSound.setVolume(0).setNumberOfLoops(-1).play((s) =>{
        console.log("finished")
        alertSound.release()
      })

      if(!cancelled) {
        const interval = 100
        let currentRamp = rampTime * 1000
        const maxRamp = currentRamp

        var thandle
        handle = setInterval(() => {
          currentRamp -= interval

          const normalizedVol = currentRamp / maxRamp
          console.log(`${currentRamp}/${maxRamp} - ${1 - normalizedVol}`)

          alertSound.setVolume(volume * (1 - normalizedVol))

          if (currentRamp <= 0 ){
            clearInterval(handle)
            alertSound.setNumberOfLoops(0)

            thandle = setTimeout(() => {
              console.log("cleaning up normally")
              alertSound.stop()
              alertSound.release()
            }, 10000)
          }
        }, 100)

      }
    })

    return {
      stop: (onStop) => {
        cancelled = true
        clearInterval(handle)
        clearTimeout(thandle)
        alertSound.stop(() => {
          alertSound.release()
          onStop && onStop()
        })
      }
    }
}

function interpolate(a, b, amount){
  return a + (a - b) * amount
}

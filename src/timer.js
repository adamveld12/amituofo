

export default (seconds, onTick, onFinish) => {
  let timeRemaining = seconds

  setImmediate(() => onTick(timeRemaining), 0)

  let handle = setInterval(() => {
    timeRemaining--
    onTick(timeRemaining)
    if (timeRemaining <= 0){
      clearInterval(handle)
      onFinish()
    }
  }, 1000)

  return {
    stop: () => clearInterval(handle)
  }
}

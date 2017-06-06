import React, { PureComponent } from 'react'
import {
  AppState,
  StyleSheet,
  Platform,
  View,
  Text
} from 'react-native'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { actions }  from '../store.js'
const { start, edit_mode, apply_edit } = actions

import Control from './Control'
import AudioControl from './AudioControl'
import EditTimer from './EditTimer'
import CountdownTimer from './CountdownTimer'

export default class TimerComponent extends PureComponent {
  constructor(){
    super()
    this.state = {}
  }

  start(duration){
    start(duration, (timerHandle) => this.setState({ timerHandle }))
  }

  pause(){
    const th = this.state.timerHandle
    if (th)
      th.pause()
  }

  restart(){
    const th = this.state.timerHandle
    if (th)
      th.reset()
  }

  _handleStateChange = (nextState) => {
    if (nextState.match(/inactive|background/))
      this.pause()
  }

  componentDidMount(){
    AppState.addEventListener('change', this._handleStateChange)
  }

  componentWillUnmount(){
    this.pause()
    AppState.removeEventListener('change', this._handleStateChange)
  }

  render(){
    const { duration, remaining, started, active, edit, audio } = this.props

    return (
      <View style={styles.container}>
        <AnimatedCircularProgress size={300}
                                  width={6}
                                  fill={edit ? 100 : remaining/duration * 100}
                                  tintColor="#8ddba6"
                                  backgroundColor="#3d5875">
          {
            () =>
              edit ?
               (<EditTimer duration={duration}
                           cancel={() => edit_mode(false)}
                           apply={apply_edit} />)
               :
              (<CountdownTimer edit_mode={() => edit_mode(true)}
                               duration={duration}
                               remaining={remaining} />)
          }
        </AnimatedCircularProgress>

        <Control active={active}
                 started={started}
                 onStart={() => !edit && this.start(remaining)}
                 onPause={() => !edit && this.pause()}
                 onReset={() => !edit && this.restart()} />

        <AudioControl {...audio} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginTop: 100,
    ...Platform.select({
      android: {
          marginTop: 50,
          marginBottom: 50,
      }
    })
  }
})

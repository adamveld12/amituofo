import React, { PureComponent } from 'react'
import {
  AppState,
  StyleSheet,
  Platform,
  View,
  Text
} from 'react-native'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { actions }  from '../store'

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
    const { actions : { start } } = this.props
    start(duration)
  }

  pause(){
    const { actions : { pause } } = this.props
    pause()
  }

  restart(){
    const { actions : { reset } } = this.props
    reset()
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
    const {
      actions: {
        apply_edit,
        edit_mode,
      },
      duration,
      remaining,
      started,
      active,
      edit,
      audio } = this.props

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
                               onStart={() => !edit && this.start(remaining)}
                               onPause={() => !edit && this.pause()}
                               onReset={() => !edit && this.restart()}
                               active={active}
                               duration={duration}
                               remaining={remaining} />)
          }
        </AnimatedCircularProgress>

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

import React, { PureComponent } from 'react'
import {
  AppState,
  StyleSheet,
  Platform,
  View,
  Text
} from 'react-native'
import { actions }  from '../store'

import Control from './Control'
import AudioControl from './AudioControl'
import EditTimer from './EditTimer'
import CountdownTimer from './CountdownTimer'
import Progress from './Progress'

export default class TimerComponent extends PureComponent {
  _handleStateChange = (nextState) => {
    if (nextState.match(/inactive|background/)) {
      const { actions : { pause } } = this.props
      pause()
    }
  }

  componentDidMount = () => AppState.addEventListener('change', this._handleStateChange)
  componentWillUnmount = () => AppState.removeEventListener('change', this._handleStateChange)

  render(){
    const {
      actions: {
        apply_edit,
        edit_mode,
        reset,
        pause,
        start,
      },
      duration,
      remaining,
      started,
      active,
      edit,
      audio } = this.props

    return (
      <View style={styles.container}>
        <Progress duration={duration} edit={edit} remaining={remaining} >
          {
              edit ?
               (<EditTimer duration={duration}
                           cancel={() => edit_mode(false)}
                           apply={apply_edit} />)
               :
              (<CountdownTimer onEditMode={() => edit_mode(true)}
                               onStart={() => !edit && start(remaining)}
                               onPause={() => !edit && pause()}
                               onReset={() => !edit && reset()}
                               audioPlaying={audio.playing}
                               active={active}
                               duration={duration}
                               remaining={remaining} />)
          }
        </Progress>

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

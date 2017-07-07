import React, { PureComponent } from 'react'
import {
  AppState,
  StyleSheet,
  Platform,
  View,
  Text
} from 'react-native'
import PropTypes from 'prop-types'

import Control from './Control'
import AudioControl from './AudioControl'
import EditTimer from './EditTimer'
import CountdownTimer from './CountdownTimer'
import Progress from './Progress'

Timer.propTypes = {
    actions: PropTypes.shape({
        apply_edit: PropTypes.func.isRequired,
        edit_mode: PropTypes.func.isRequired,
        reset: PropTypes.func.isRequired,
        pause: PropTypes.func.isRequired,
        start: PropTypes.func.isRequired,
    }).isRequired,
    duration: PropTypes.number.isRequired,
    remaining: PropTypes.number.isRequired,
    started: PropTypes.bool.isRequired,
    active: PropTypes.bool.isRequired,
    edit: PropTypes.bool.isRequired,
    audio: PropTypes.shape({
        audioURI: PropTypes.string.isRequired,
        playing: PropTypes.bool.isRequired,
        finalVolume: PropTypes.number.isRequired,
        rampTime: PropTypes.number.isRequired,
    }).isRequired
}

export default function Timer(props){
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
      audio } = props

    return (
      <View style={styles.container}>
        <Progress duration={duration} edit={edit} remaining={remaining} >
          {
              edit ?
               (<EditTimer duration={duration}
                           cancel={() => edit_mode(false)}
                           apply={(duration) => console.log(duration) || apply_edit(duration)} />)
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

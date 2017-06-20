import React, { PureComponent } from 'react'
import { StyleSheet, Platform, Text, View } from 'react-native'

import FIcon from 'react-native-vector-icons/FontAwesome'
import EIcon from 'react-native-vector-icons/EvilIcons'
import MIcon from 'react-native-vector-icons/MaterialIcons'

import Control from './Control'

import {sprintf} from 'sprintf'

export default class CountdownTImer extends PureComponent {
  render(){
    const { remaining, duration, onEditMode, onStart, onPause, onReset, active, audioPlaying } = this.props
    const minutes = Math.floor(remaining / 60)
    const seconds = remaining - (minutes * 60)

    return (
      <View style={styles.progress}>
        <View style={styles.timer}>
          <Text onLongPress={() => onEditMode()} style={styles.timerDisplay}>
            { sprintf("%01d:%02d", minutes, seconds) }
          </Text>
        </View>

        <Control active={active}
                 audioPlaying={audioPlaying}
                 onStart={onStart}
                 onPause={onPause}
                 onReset={onReset} />
      </View>
    )
  }
}


export const styles = StyleSheet.create({
  progress: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: 300,
    height: 300,
    paddingBottom: 55,
    paddingTop: 70
  },
  timer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: 200,
  },
  timerDisplay: {
   backgroundColor: 'transparent',
   textAlign: 'center',
   color: 'white',
   fontSize: 40,
   fontWeight: "100"
 },
})

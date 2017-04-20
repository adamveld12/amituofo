import React, { PureComponent } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import FIcon from 'react-native-vector-icons/FontAwesome'
import EIcon from 'react-native-vector-icons/EvilIcons'
import MIcon from 'react-native-vector-icons/MaterialIcons'

import {sprintf} from 'sprintf'

export default class CountdownTImer extends PureComponent {
  render(){
    const { remaining, duration, edit_mode } = this.props
    const minutes = Math.floor(remaining / 60)
    const seconds = remaining - (minutes * 60)

    return (
      <View style={styles.progress}>
        <View style={styles.timer}>
          <Text onLongPress={() => edit_mode()} style={styles.timerDisplay}>
            { sprintf("%02d:%02d", minutes, seconds) }
          </Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  progress: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: 200,
    height: 200,
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
   fontSize: 32,
   fontWeight: "100"
 }
})

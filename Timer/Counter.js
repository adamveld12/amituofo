import React, { PureComponent } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import {sprintf} from 'sprintf'
import FIcon from 'react-native-vector-icons/FontAwesome'
import EIcon from 'react-native-vector-icons/EvilIcons'
import MIcon from 'react-native-vector-icons/MaterialIcons'



export default class Counter extends PureComponent {
  editFill(minutes, seconds){
    return (
      <View style={styles.progressEdit}>
        <View style={styles.timer} >
          <EIcon.Button name="chevron-up" backgroundColor="transparent"></EIcon.Button>
          <Text style={styles.points}>
            { sprintf("%02d:%02d", minutes, seconds) }
          </Text>
          <EIcon.Button name="chevron-down" backgroundColor="transparent"></EIcon.Button>
        </View>
        <View style={styles.edit}>
          <MIcon.Button name="check" color="#7FFF00" backgroundColor="transparent"></MIcon.Button>
          <MIcon.Button name="close" color="red" backgroundColor="transparent"></MIcon.Button>
        </View>
      </View>
    )
  }

  countdownFill(minutes, seconds){
    return (
      <View style={styles.progress}>
        <View style={styles.timer} >
          <Text style={styles.points}>
            { sprintf("%02d:%02d", minutes, seconds) }
          </Text>
        </View>
      </View>
    )

  }
  render(){
    const { remaining, duration, edit } = this.props
    const mins = Math.floor(remaining / 60)
    const seconds = remaining - (mins * 60)

    return (
      <AnimatedCircularProgress size={200}
                                width={4}
                                fill={edit ? 100 : remaining/duration * 100}
                                tintColor="#00e0ff"
                                backgroundColor="#3d5875">
          {
            (fill) => (
              (edit ? this.editFill: this.countdownFill)(mins, seconds)
            )
          }
      </AnimatedCircularProgress>
    )
  }
}

const styles = StyleSheet.create({
  progressEdit: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: 200,
    height: 200,
    paddingTop: 74.5,
    paddingBottom: 20,
  },
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
  },
  edit: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  points: {
   backgroundColor: 'transparent',
   textAlign: 'center',
   color: 'white',
   fontSize: 32,
   fontWeight: "100"
 }
})

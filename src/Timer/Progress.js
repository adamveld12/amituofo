import React, { PureComponent } from 'react'
import {
  AppState,
  StyleSheet,
  Platform,
  View,
  Text
} from 'react-native'
import { AnimatedCircularProgress } from 'react-native-circular-progress'

export default class Progress extends PureComponent {
  render(){
    const {
      children,
      duration,
      remaining,
      edit } = this.props
      console.log(remaining/duration  * 100)

    return (
      <AnimatedCircularProgress size={300}
                                width={15}
                                fill={edit ? 100 : remaining/duration * 100}
                                tintColor="#8ddba6"
                                backgroundColor="#3d5875">
        {
          () => children
        }
      </AnimatedCircularProgress>
    )
  }
}

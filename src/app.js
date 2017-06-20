import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native'

import AnimatedLinearGradient, {presetColors} from 'react-native-animated-linear-gradient'

import Timer from './Timer'
import { dispatch, getState, subscribe, actions } from './store'
//import StatsPage from './statsPage.js'

export default class App extends Component {
  constructor(){
    super()
    this.state = getState()
  }

  static defaultProps = {
    dispatch: dispatch
  }
  
  componentWillMount(){
    __DEV__ && console.log("connecting to store")
    this.__handle__ = subscribe((s, a) => console.log("updating state") || this.setState(s))
  }

  componentWillUnmount(){
    __DEV__ && console.log("unmounting app")
    this.__handle__()
  }

  render() {
    const {
      time: {
        edit
      },
      session: {
        started,
        duration,
        remaining,
        active
      },
      audio
    } = this.state
    return (
      <View style={styles.container}>
        <AnimatedLinearGradient customColors={gradientColors} speed={10000}/>
        <Timer
           actions={{
             edit_mode: actions.edit_mode,
             apply_edit: actions.apply_edit,
             start: actions.start,
             pause: actions.pause,
             reset: actions.reset,
             complete: actions.complete,
             stopAudio: actions.stop,
           }}
           active={active}
           started={started}
           duration={duration}
           remaining={remaining}
           edit={edit}
           audio={audio} />
      </View>
    )
  }
}

const gradientColors = [
  '#ca9ebc',
  '#b992ad',
  '#877481',
  '#a57b53'
]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
})

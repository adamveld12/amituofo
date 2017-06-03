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
import { dispatcher, state, onDispatchComplete, removeOnDispatchComplete } from './store.js'

//import StatsPage from './statsPage.js'

export default class App extends Component {
  constructor(){
    super()
    this.state = state()
    this.__handle__ = onDispatchComplete((s, a) => this.setState(s))
  }

  static defaultProps = {
    dispatch: dispatcher,
    state: state
  }

  componentWillUnmount(){
    removeOnDispatchComplete(this.__handle__)
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
      }
    } = this.state
    return (
      <View style={styles.container}>

        <AnimatedLinearGradient customColors={gradientColors} speed={10000}/>

        <Timer active={active}
           started={started}
           duration={duration}
           remaining={remaining}
           edit={edit} />
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

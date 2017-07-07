import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native'
import { StackNavigator } from 'react-navigation'

import AnimatedLinearGradient, {presetColors} from 'react-native-animated-linear-gradient'

import Timer from './Timer'
import { dispatch, getState, subscribe, actions } from './store'
//import StatsPage from './statsPage.js'


const screens = StackNavigator({
    Timer: { screen: Timer, title: "Timer" },
    //Stats: { screen: Stats, title: "Statistics" },
    //Timer: { screen: Settings, title: "Settings" },
})

export default class App extends Component {
  constructor(){
    super()
    this.state = getState()
  }

  componentWillMount(){
    this.__handle__ = subscribe((s, a) =>  this.setState(s))
  }

  componentDidMount(){
      actions.load()
  }

  componentWillUnmount(){
    this.__handle__()
  }

  render() {
    return (
      <View style={styles.container}>
        <AnimatedLinearGradient customColors={gradientColors} speed={10000}/>
        <Timer {...this.state} />
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

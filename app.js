import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native';

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

  onComponentWillUnmount(){
    removeOnDispatchComplete(this.__handle__)
  }

  render() {
    const {
      session: {
        duration,
        remaining,
        active
      }
    } = this.state
    return (
      <View style={styles.container}>
        <AnimatedLinearGradient customColors={presetColors.instagram} speed={8000}/>
        <Timer active={active}
               duration={duration}
               remaining={remaining} />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
});

import React, { PureComponent } from 'react'
import {
  StyleSheet,
  View,
  Text
} from 'react-native'

import { actions }  from '../store.js'
const { start } = actions

import Control from './Control'
import Counter from './Counter'
import timer from '../timer.js'


export default class TimerComponent extends PureComponent {
  constructor(){
    super()
    this.state = {}
  }

  start(duration){
    start(duration, (timerHandle) => {
      this.setState({ timerHandle })
    })
  }

  pause(){
    const th = this.state.timerHandle
    if (th) {
      th.pause()
    }
  }

  restart(){
    const th = this.state.timerHandle
    if (th) {
      th.reset()
    }
  }

  onComponentWillUnmount(){
    this.pause()
  }

  render(){
    const { duration, remaining, active } = this.props

    return (
      <View style={styles.container}>
        <Counter edit={false} duration={duration} remaining={remaining} />
        <Control active={active}
                 onStart={() => this.start(remaining) }
                 onPause={this.pause.bind(this)}
                 onReset={this.restart.bind(this)} />
        <View>

        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginTop: 150,
    marginBottom: 150,
    height: 200,
  }
});

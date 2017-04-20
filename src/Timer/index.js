import React, { PureComponent } from 'react'
import {
  StyleSheet,
  View,
  Text
} from 'react-native'
import { AnimatedCircularProgress } from 'react-native-circular-progress'

import { actions }  from '../store.js'
const { start, edit_mode, apply_edit } = actions

import Control from './Control'
import EditTimer from './EditTimer'
import CountdownTimer from './CountdownTimer'
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

  componentWillUnmount(){
    this.pause()
  }

  render(){
    const { duration, remaining, started, active, edit } = this.props

    return (
      <View style={styles.container}>
        <AnimatedCircularProgress size={200}
                                  width={4}
                                  fill={edit ? 100 : remaining/duration * 100}
                                  tintColor="#8ddba6"
                                  backgroundColor="#3d5875">
          {
            () =>
              edit ?
               (<EditTimer duration={duration}
                           cancel={() => edit_mode(false)}
                           apply={apply_edit} />)
               :
              (<CountdownTimer edit_mode={() => edit_mode(true)}
                               duration={duration}
                               remaining={remaining} />)
          }

        </AnimatedCircularProgress>

        {
          <Control active={active}
                   started={started}
                   onStart={() => !edit && this.start(remaining)}
                   onPause={() => !edit && this.pause()}
                   onReset={() => !edit && this.restart()} />
        }
      </View>
    )
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
})

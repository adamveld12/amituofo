import React, { Component } from 'react'
import { Platform, StyleSheet, TextInput, View } from 'react-native'
import FIcon from 'react-native-vector-icons/FontAwesome'
import EIcon from 'react-native-vector-icons/EvilIcons'
import MIcon from 'react-native-vector-icons/MaterialIcons'
import PropTypes from 'prop-types'

import { sprintf } from 'sprintf'

export default class EditCounter extends Component {
  constructor(){
    super()
    this.state = { minutes: 0 }
  }

  static propTypes = {
      duration: PropTypes.number.isRequired,
      cancel: PropTypes.func.isRequired,
      apply: PropTypes.func.isRequired
  }

  syncState = () => {
    const { duration } = this.props
    const minutes = Math.floor(duration / 60)
    this.setState({ minutes })
  }

  startEdit(){
    this.syncState()
    const { edit_mode } = this.props
    edit_mode(true)
  }

  componentDidMount(){
      this.syncState()
  }

  shouldComponentUpdate(nextProps, nextState){
      const { nduration } = nextProps
      const { duration } = this.props


      const { nminutes } = nextState
      const { minutes } = this.state

      return nduration !== duration || nminutes !== minutes
  }

  render(){
    const { minutes } = this.state
    const { duration, cancel, apply } = this.props

    return (
      <View style={styles.progress}>
        <View style={styles.timer} >
          <EIcon.Button onPress={() => this.setState({ minutes: minutes + 1 })}
                        iconStyle={styles.icon}
                        borderRadius={2}
                        name="chevron-up"
                        backgroundColor="transparent" />

            <TextInput style={styles.timerDisplay}
                       keyboardType="numeric"
                       returnKeyType="done"
                       underlineColorAndroid={'rgba(0,0,0,0)'}
                       blurOnSubmit={false}
                       autoCorrect={false}
                       maxLength={4}
                       onChangeText={(v) => {
                         let h = parseInt(v)
                         if (h + "" !== "NaN") this.setState({ minutes:  h })
                       }}
                       onSubmitEditing={() => apply(minutes * 60)}
                       defaultValue={sprintf("%01d", minutes)} >
            </TextInput>

          <EIcon.Button onPress={() => this.setState({ minutes: Math.max(minutes - 1, 1) })}
                        iconStyle={styles.icon}
                        borderRadius={2}
                        name="chevron-down"
                        backgroundColor="transparent" />
        </View>

        <View style={styles.editPanel}>
          <MIcon.Button onPress={() => apply(minutes * 60)}
                        iconStyle={styles.icon}
                        name="check"
                        color="#7FFF00"
                        backgroundColor="transparent" />

          <MIcon.Button onPress={cancel}
                        iconStyle={styles.icon}
                        name="close"
                        color="red"
                        backgroundColor="transparent" />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  icon:{
    marginRight: 0,
    justifyContent: 'center',
    padding: 0,
    fontWeight: "100",
    fontSize: 32,
  },
  progress: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: 300,
    height: 180,
    marginTop: 60,
    marginBottom: 10,
  },
  timer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
  },
  editPanel: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    width: 130,
  },
  timerDisplay: {
   backgroundColor: 'transparent',
   textAlign: 'center',
   color: 'white',
   height: 40,
   fontSize: 45,
   fontWeight: "100",
   minWidth: 70,
   height: 60,
    ...Platform.select({
      android: {
        fontSize: 35,
      }
    })
 }
})

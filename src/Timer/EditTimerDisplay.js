import React, { Component } from 'react'
import { Platform, StyleSheet, TextInput, View } from 'react-native'
import EIcon from 'react-native-vector-icons/EvilIcons'
import PropTypes from 'prop-types'

import { sprintf } from 'sprintf'

export default class EditTimerDisplay extends Component {
  // es-lint-disable-next-line
  static propTypes = {
      minutes: PropTypes.number.isRequired,
      onCancelEdit: PropTypes.func.isRequired,
      onApplyEdit: PropTypes.func.isRequired
  }

  render(){
    const {
        minutes,
        onCancelEdit,
        onApplyEdit,
        onUpdateEdit
    } = this.props

    return (
      <View style={styles.progress}>
        <View style={styles.timer} >
          <EIcon.Button onPress={() => onUpdateEdit(minutes + 1) }
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
                         if (h + "" !== "NaN") onUpdateEdit(h)
                       }}
                       onSubmitEditing={() => onApplyEdit()}
                       defaultValue={sprintf("%01d", minutes)} >
            </TextInput>

          <EIcon.Button onPress={() => onUpdateEdit(Math.max(minutes - 1, 1))}
                        iconStyle={styles.icon}
                        borderRadius={2}
                        name="chevron-down"
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
    color: 'black'
  },
  progress: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: 300,
    height: 180,
  },
  timer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    marginTop: 110
  },
  editPanel: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timerDisplay: {
   backgroundColor: 'transparent',
   textAlign: 'center',
   height: 40,
   fontSize: 50,
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

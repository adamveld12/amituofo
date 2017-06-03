import React, { PureComponent } from 'react'
import {
  TouchableNativeFeedback,
  StyleSheet,
  Text,
  View
} from 'react-native'

export default class Control extends PureComponent {
  render(){
    const { active, onStart, onPause, onReset } = this.props

    return (
      <View style={styles.container}>
        <TouchableNativeFeedback onPress={() => (active ? onPause : onStart)()}
                                 background={TouchableNativeFeedback.SelectableBackgroundBorderless()}>
          <View style={styles.button}>
            <Text style={styles.buttonText}> { active ? "Pause" : "Start" } </Text>
          </View>
        </TouchableNativeFeedback>

        <TouchableNativeFeedback onPress={() => onReset()}
                                 background={TouchableNativeFeedback.SelectableBackgroundBorderless()}>
          <View style={styles.button}>
            <Text style={styles.buttonText}> Reset </Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    width: 60,
  },
  buttonText: {
    color: "#F5FCFF",
    justifyContent: 'center',
    fontSize: 20,
  },
  container: {
    flex: 1,
    flexDirection: "row",
    marginTop: 30,
    alignItems: "center",
    justifyContent: 'space-between',
    width: 300,
  }
})

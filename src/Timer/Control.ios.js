import React, { PureComponent } from 'react'
import { Button, StyleSheet, View } from 'react-native'

export default class Control extends PureComponent {
  render(){
    const { active, onStart, onPause, onReset } = this.props
    const color = '#F5FCFF'
    return (
      <View style={styles.container}>
        <Button onPress={() => (active ? onPause : onStart)()} title={active ? "Pause" : "Start"} color={color} />
        <Button onPress={() => onReset()} title="Reset" color={color} />
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 25,
    width: 160,
    height: 10,
    flexDirection: "row",
    justifyContent: 'space-between',
  }
})

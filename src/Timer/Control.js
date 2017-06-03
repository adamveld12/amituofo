import React, { PureComponent } from 'react'
import { Button, StyleSheet, Text, View } from 'react-native'
import { start } from '../timer.js'

export default class Control extends PureComponent {
  render(){
    const { active, onStart, onPause, onReset } = this.props

    return (
      <View style={styles.container}>
        {
          active ?
          (<Button onPress={() => onPause()}
                  title="Pause"
                  color="#F5FCFF" />) :
          (<Button onPress={() => onStart()}
                  title="Start"
                  color="#F5FCFF" />)
        }

        <Button onPress={() => onReset()}
                title="Reset"
                color="#F5FCFF" />
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 25,
    width: 160,
    flexDirection: "row",
    justifyContent: 'space-between'
  }
})

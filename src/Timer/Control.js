import React, { PureComponent } from 'react'
import { Button, StyleSheet, View } from 'react-native'

import FIcon from 'react-native-vector-icons/FontAwesome'
import EIcon from 'react-native-vector-icons/EvilIcons'
import MIcon from 'react-native-vector-icons/MaterialIcons'

export default class Control extends PureComponent {
  renderTimerControl({ active, onPause, onStart, onReset }){
    const color = '#F5FCFF'
    return (
      <View style={styles.container}>
        <MIcon.Button onPress={() => (active ? onPause : onStart)()}
                      name={active ? "pause" : "play-arrow"}
                      backgroundColor="transparent"
                      iconStyle={styles.icon}
                      color={color} />

        <MIcon.Button onPress={onReset}
                       name="autorenew"
                       backgroundColor="transparent"
                       iconStyle={styles.icon}
                       color={color} />
      </View>
    )
  }

  renderAudioControl({ onReset }){
    const color = '#F5FCFF'
    return (
      <View style={styles.container}>
          <MIcon.Button onPress={onReset}
                        iconStyle={styles.icon}
                        name="check"
                        color="#7FFF00"
                        backgroundColor="transparent" />

          <MIcon.Button onPress={onReset}
                        name="autorenew"
                        backgroundColor="transparent"
                        iconStyle={styles.icon}
                        color={color} />
      </View>
    )
  }

  render(){
    const { audioPlaying } = this.props

    return audioPlaying ?
      this.renderAudioControl(this.props) :
      this.renderTimerControl(this.props)
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 160,
    maxHeight: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 20,
  },
  icon: {
    fontSize: 30,
    width: 60,
    height: 60,
    marginRight: 0
  }
})

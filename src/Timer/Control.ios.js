import React, { PureComponent } from 'react'
import { Button, StyleSheet, View } from 'react-native'

import FIcon from 'react-native-vector-icons/FontAwesome'
import EIcon from 'react-native-vector-icons/EvilIcons'
import MIcon from 'react-native-vector-icons/MaterialIcons'

export default class Control extends PureComponent {
  render(){
    const { active, onStart, onPause, onReset } = this.props
    const color = '#F5FCFF'
    return (
      <View style={styles.container}>
        <FIcon.Button onPress={() => (active ? onPause : onStart)()}
                      name={active ? "pause" : "play"}
                      backgroundColor="transparent"
                     iconStyle={styles.icon}
                      color={color} />

          <MIcon.Button onPress={() => onReset()}
                         name="autorenew"
                         backgroundColor="transparent"
                         iconStyle={styles.icon}
                         color={color} />
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: 160,
    maxHeight: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 20,
  },
  icon: {
    width: 30,
    maxHeight: 30,
    marginRight: 0
  }
})

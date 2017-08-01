import React, { PureComponent } from 'react'
import { Button, StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'

import MIcon from 'react-native-vector-icons/MaterialIcons'

export default class CountdownTimerControl extends PureComponent {
    static propTypes = {
        active: PropTypes.bool.isRequired,
        onPause: PropTypes.func.isRequired,
        onStart: PropTypes.func.isRequired,
        onReset: PropTypes.func.isRequired,
        container: PropTypes.object,
        icon: PropTypes.object,
    }

  render(){
    const {
        active,
        onPause,
        onStart,
        onReset,
        container,
        icon
    } = this.props

    const color = '#F5FCFF'
    return (
      <View style={container}>
        <MIcon.Button onPress={() => (active ? onPause : onStart)()}
                      name={active ? "pause" : "play-arrow"}
                      backgroundColor="transparent"
                      iconStyle={icon}
                      color={color} />

        <MIcon.Button onPress={onReset}
                       name="autorenew"
                       backgroundColor="transparent"
                       iconStyle={icon}
                       color={color} />

      </View>
    )
  }
}
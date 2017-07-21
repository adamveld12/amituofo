import React, { PureComponent } from 'react'
import { StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'

import MIcon from 'react-native-vector-icons/MaterialIcons'

export default class TimerCompletedControl extends PureComponent {
    static propTypes = {
        onReset: PropTypes.func.isRequired
    }

    render(){
        const {
          onReset
        } = this.props

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
    marginRight: 0,
    color: 'black'
  }
})

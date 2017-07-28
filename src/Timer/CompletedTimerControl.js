import React, { PureComponent } from 'react'
import { View } from 'react-native'
import PropTypes from 'prop-types'

import MIcon from 'react-native-vector-icons/MaterialIcons'

export default class TimerCompletedControl extends PureComponent {
    static propTypes = {
        onReset: PropTypes.func.isRequired,
        container: PropTypes.object,
        icon: PropTypes.object,
    }

    render(){
        const {
          onReset,
          container,
          icon
        } = this.props

        return (
          <View style={container}>
              <MIcon.Button onPress={onReset}
                            iconStyle={icon}
                            name="check"
                            color="#7FFF00"
                            backgroundColor="transparent" />

              <MIcon.Button onPress={onReset}
                            name="autorenew"
                            backgroundColor="transparent"
                            iconStyle={icon}
                            color='#F5FCFF' />
          </View>
        )
    }
}
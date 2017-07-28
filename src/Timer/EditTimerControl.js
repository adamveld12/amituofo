import React, { PureComponent } from 'react'
import { View } from 'react-native'
import PropTypes from 'prop-types'

import MIcon from 'react-native-vector-icons/MaterialIcons'

export default class TimerEditControl extends PureComponent {
    static propTypes = {
        onApply: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
        container: PropTypes.object,
        icon: PropTypes.object,
    }

    render(){
        const {
            onApply,
            onCancel,
            container,
            icon
        } = this.props

        return (
            <View style={container}>
              <MIcon.Button onPress={onApply}
                            iconStyle={icon}
                            name="check"
                            color="#7FFF00"
                            backgroundColor="transparent" />

              <MIcon.Button onPress={onCancel}
                            iconStyle={icon}
                            name="close"
                            color="red"
                            backgroundColor="transparent" />
            </View>
        )
    }
}
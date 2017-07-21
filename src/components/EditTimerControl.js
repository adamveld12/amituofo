import React, { PureComponent } from 'react'
import { StyleSheet, View } from 'react-native'
import PropTypes from 'prop-types'

import MIcon from 'react-native-vector-icons/MaterialIcons'

export default class TimerEditControl extends PureComponent {
    static propTypes = {
        onApply: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
    }

    render(){
        const {
            onApply,
            onCancel,
        } = this.props

        return (
            <View style={styles.container}>
              <MIcon.Button onPress={onApply}
                            iconStyle={styles.icon}
                            name="check"
                            color="#7FFF00"
                            backgroundColor="transparent" />

              <MIcon.Button onPress={onCancel}
                            iconStyle={styles.icon}
                            name="close"
                            color="red"
                            backgroundColor="transparent" />
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

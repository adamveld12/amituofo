import React, { PureComponent } from 'react'
import {
  StyleSheet,
  Text,
  View
} from 'react-native'
import PropTypes from 'prop-types'

import FAIcon from 'react-native-vector-icons/FontAwesome'

export default class NavigationControl extends PureComponent {
  // eslint-disable-next-line 
  state = {}

  // eslint-disable-next-line 
  static propTypes = {
      currentScreen: PropTypes.string.isRequired,
      navigation: PropTypes.shape({
          Timer: PropTypes.func,
          Settings: PropTypes.func,
          Stats: PropTypes.func,
      }).isRequired
  }

  render(){
    const {
        currentScreen,
        navigation: {
            Timer,
            Settings,
            Stats
        }
    } = this.props


    return (
        <View style={styles.container}>
            <FAIcon name="cog" 
                    size={20} 
                    color="black" />

            <FAIcon name="line-chart" 
                    size={20} 
                    color="black" />
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { 
      flexDirection: 'row',
      width: '90%', 
      justifyContent: 'space-between' 
  }
})

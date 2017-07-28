import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View
} from 'react-native'
import PropTypes from 'prop-types'

import FAIcon from 'react-native-vector-icons/FontAwesome'

export default class NavigationControl extends Component {
    initialProps = {
        hide: ""
    }

    // eslint-disable-next-line 
    static propTypes = {
        currentScreen: PropTypes.string.isRequired,
        hide: PropTypes.string,
        navigation: PropTypes.shape({
            timer: PropTypes.func,
            settings: PropTypes.func,
            stats: PropTypes.func,
        }).isRequired
    }


  shouldComponentUpdate(nextProps){
      const { currentScreen } = this.props
      const { next_currentScreen } = nextProps

      return currentScreen !== next_currentScreen
  }

  _buildButton = (name, navFunc) => 
    (<FAIcon.Button name={name}
                    backgroundColor="transparent" 
                    onPress={() => navFunc({ from: this.props.currentScreen })}
                    size={20} 
                    color="black" />)

  render(){
    const {
        currentScreen,
        hide,
        navigation: {
            timer,
            settings,
            stats
        }
    } = this.props


    return (

        <View style={styles.container}>
            {
                (currentScreen !== "Settings" && hide !== "Settings") &&
                this._buildButton('cog', settings)
            }

            {
                (currentScreen !== "Timer" && hide !== "Timer") && 
                this._buildButton('clock-o', timer)
            }

            {
                (currentScreen !== "Stats" && hide !== "Stats") &&
                this._buildButton('line-chart', stats)
            }


        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: { 
      flexDirection: 'row',
      width: '100%', 
      justifyContent: 'space-between' 
  }
})

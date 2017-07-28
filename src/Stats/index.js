import React, { Component } from 'react'
import {
  TextInput,
  Text,
  StyleSheet,
  View,
} from 'react-native'
import PropTypes from 'prop-types'

import { actions, store } from '../store'
import { connect } from 'weedux'

import { NavigationControl } from '../components'

class StatsContainer extends Component {
    static navigationOptions = {
        title: "Stats"
    }

    static propTypes = {
        completed: PropTypes.array.isRequired,
        quits: PropTypes.array.isRequired,
        navigation: PropTypes.shape({
            settings: PropTypes.func.isRequired,
            timer: PropTypes.func.isRequired,
        })
    }

    render(){
        const {
            completed,
            quits,
            navigation
        } = this.props


        return (
          <View style={styles.container}>
            <NavigationControl currentScreen={StatsContainer.navigationOptions.title} navigation={navigation} />
            <Text>Coming Soon.</Text>
          </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
})

function buildNavigator(screen, navigate, params){
    return (navOptions) => navigate(screen, { ...params, ...navOptions })
}

export default connect(
    (state, props) => ({ ...props, ...state.stats }),
    (dispatch, props, state) => {
        const {
            navigation: { navigate }
        } = props

        const nav = {
            settings: buildNavigator('Settings', navigate, {}),
            timer: buildNavigator('Timer', navigate, {})
        }

        return { navigation: nav }
    },
    store
)(StatsContainer)

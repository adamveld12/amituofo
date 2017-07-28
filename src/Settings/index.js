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

class SettingsContainer extends Component {
    static navigationOptions = {
        title: "Settings"
    }

    static propTypes = {
        actions: PropTypes.shape({
            onApplySetting: PropTypes.func.isRequired,
            onClearStats: PropTypes.func.isRequired,
            onSendUsage: PropTypes.func.isRequired
        }).isRequired,
        finalVolume: PropTypes.number.isRequired,
        rampTime: PropTypes.number.isRequired,
        navigation: PropTypes.shape({
            timer: PropTypes.func.isRequired,
            //stats: PropTypes.func.isRequired,
        })
    }

    render(){
        const {
            actions: {
                onApplySetting,
                onClearStats,
                onSendUsage,
            },
            finalVolume,
            rampTime,
            navigation
        } = this.props


        return (
          <View style={styles.container}>
            <NavigationControl currentScreen={SettingsContainer.navigationOptions.title} 
                               navigation={navigation} />
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
    (state, props) => ({ ...props, ...state.audio }),
    (dispatch, props, state) => {
        const {
            session,
            timer
        } = actions

        const {
            navigation: { navigate }
        } = props

        const viewActions = ({})

        const nav = {
            timer: buildNavigator('Timer', navigate, {}),
            stats: buildNavigator('Stats', navigate, {})
        }

        return { actions: viewActions , navigation: nav}
    },
    store
)(SettingsContainer)

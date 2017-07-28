import React, { Component } from 'react'
import {
  AppState,
  StyleSheet,
  Platform,
  View,
} from 'react-native'
import PropTypes from 'prop-types'

import { actions, store } from '../store'
import { connect } from 'weedux'

class SettingsContainerComponent extends Component {
    static navigationOptions = {
        title: "Settings"
    }

    static propTypes = {
        actions: PropTypes.shape({
            onStart: PropTypes.func.isRequired,
            onPause: PropTypes.func.isRequired,
            onReset: PropTypes.func.isRequired,
            onStartEditMode: PropTypes.func.isRequired,
            onCancelEdit: PropTypes.func.isRequired,
            onApplyEdit: PropTypes.func.isRequired,
            onUpdateEdit: PropTypes.func.isRequired,
        }).isRequired,
        timer: PropTypes.shape({
            edit: PropTypes.bool.isRequired
        }).isRequired,
        session: PropTypes.shape({
            active: PropTypes.bool.isRequired,
            duration: PropTypes.number.isRequired,
            remaining: PropTypes.number.isRequired,
        }).isRequired,
        audio: PropTypes.shape({
            audioURI: PropTypes.string.isRequired,
            playing: PropTypes.bool.isRequired,
            finalVolume: PropTypes.number.isRequired,
            rampTime: PropTypes.number.isRequired,
        }).isRequired
    }

    render(){
        const {
            actions: {
                onStart,
                onPause,
                onReset,
                onStartEditMode,
                onCancelEdit,
                onApplyEdit,
                onUpdateEdit,
            },
            timer: {
                edit,
                minutes,
            },
            session: {
                duration,
                remaining,
                active
            },
            audio
        } = this.props


        return (
          <View style={styles.container}>
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

export default connect(
    (state, props) => ({ ...props, ...state }),
    (dispatch, props, state) => {
        const {
            session,
            timer
        } = actions

        const viewActions = ({
            onUpdateEdit: (duration) => {
                dispatch(timer.update(duration))
                KeepAwake.deactivate()
            },
            onStart: (remaining, editMode) =>  {
                !editMode && dispatch(session.start(remaining))
                KeepAwake.activate()
            },
            onPause: () => {
                 dispatch(session.pause())
                KeepAwake.deactivate()
            },
            onReset: () => {
                dispatch(session.reset())
                KeepAwake.deactivate()
            },
            onStartEditMode: () => {
                dispatch(timer.edit(true))
                KeepAwake.deactivate()
            },
            onCancelEdit: () => {
                dispatch(timer.edit(false))
                KeepAwake.deactivate()
            },
            onApplyEdit: (duration) => {
                dispatch(timer.apply(duration))
                KeepAwake.deactivate()
            }
        })
        return { actions: viewActions }
    },
    store
)(SettingsContainerComponent)

import React, { Component } from 'react'
import {
  AppState,
  StyleSheet,
  Platform,
  View,
} from 'react-native'
import PropTypes from 'prop-types'

import AudioControl from './AudioControl'
import TimerDisplay from './TimerDisplay'
import Control from './Control'

import { actions, store } from '../store'
import { connect } from 'weedux'

import KeepAwake from 'react-native-keep-awake'

class TimerContainerComponent extends Component {
    static navigationOptions = {
        title: "Timer"
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

    _handleStateChange = (nextState) => {
        if (nextState.match(/inactive|background/)) {
              const { actions: { onPause }, timer: { edit } } = this.props
              onPause()()
        }
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleStateChange)
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleStateChange)
        KeepAwake.deactivate()
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
            <View style={styles.timer_container}>
                <TimerDisplay active={active}
                              audioPlaying={audio.playing}
                              editMode={edit}
                              duration={duration}
                              minutes={minutes}
                              onUpdateEdit={onUpdateEdit}
                              onApplyEdit={() => onApplyEdit(minutes)}
                              onStartEditMode={onStartEditMode}
                              onCancelEdit={onCancelEdit}
                              remaining={remaining} />
            </View>

            <View style={styles.audio_container}>
                <AudioControl {...audio} />
            </View>

            <View style={styles.control_container}>
                <Control audioPlaying={audio.playing}
                        active={active}
                        editMode={edit}
                        onApply={() => onApplyEdit(minutes)}
                        onStart={() => onStart(remaining, edit)}
                        onCancel={onCancelEdit}
                        onPause={onPause}
                        onReset={onReset} />
            </View>
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
    timer_container: {
        flex: 6,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        width: '100%'
    },
    audio_container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        width: '100%'
    },
    control_container: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%'
    }
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
)(TimerContainerComponent)

import React, { Component } from 'react'
import {
  AppState,
  StyleSheet,
  Platform,
  View,
  Text
} from 'react-native'
import PropTypes from 'prop-types'

import { actions }  from '../store'

import Control from './Control'
import AudioControl from './AudioControl'
import EditTimer from './EditTimer'
import CountdownTimer from './CountdownTimer'
import Progress from './Progress'

import Timer from './Timer.js'

export default class TimerContainerComponent extends Component {
    static navigationOptions = {
        title: "Timer"
    }

    _handleStateChange = (nextState) => {
        if (nextState.match(/inactive|background/)) {
              const { actions : { pause } } = this.props
              pause()
        }
    }

    componentDidMount = () => AppState.addEventListener('change', this._handleStateChange)
    componentWillUnmount = () => AppState.removeEventListener('change', this._handleStateChange)

    render(){
        const actionProps = {
             edit_mode: actions.edit_mode,
             apply_edit: actions.apply_edit,
             start: actions.start,
             pause: actions.pause,
             reset: actions.reset,
             complete: actions.complete,
             stopAudio: actions.stop,
       }

        const {
            time: {
                edit
            },
            session: {
                started,
                duration,
                remaining,
                active
            },
            audio
        } = this.props

        return (<Timer actions={actionProps}
                        edit={edit}
                        duration={duration}
                        started={started}
                        remaining={remaining}
                        active={active}
                        audio={audio} />)
    }
}

TimerContainerComponent.propTypes = {
    time: PropTypes.shape({
        edit: PropTypes.bool.isRequired
    }).isRequired,
    session: PropTypes.shape({
        started: PropTypes.bool.isRequired,
        active: PropTypes.bool.isRequired,
        duration: PropTypes.number.isRequired,
        remaining: PropTypes.number.isRequired,
    }),
    audio: PropTypes.shape({
        audioURI: PropTypes.string.isRequired,
        playing: PropTypes.bool.isRequired,
        finalVolume: PropTypes.number.isRequired,
        rampTime: PropTypes.number.isRequired,
    }).isRequired
}

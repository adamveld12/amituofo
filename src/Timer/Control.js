import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import {
    CompletedTimerControl,
    CountdownTimerControl,
    EditTimerControl
} from '../components'

export default class Control extends PureComponent {
    static propTypes = {
        active: PropTypes.bool.isRequired,
        audioPlaying: PropTypes.bool.isRequired,
        editMode: PropTypes.bool.isRequired,
        onPause: PropTypes.func.isRequired,
        onStart: PropTypes.func.isRequired,
        onCancel: PropTypes.func.isRequired,
        onReset: PropTypes.func.isRequired,
    }

    render(){
        const {
            active,
            audioPlaying,
            editMode,
            onApply,
            onCancel,
            onPause,
            onStart,
            onReset
        } = this.props

        if (audioPlaying) {
            return (<CompletedTimerControl onReset={onReset} />)

        } else if (editMode) {
            return (<EditTimerControl onApply={onApply} onCancel={onCancel} />)
        } else {
            return (<CountdownTimerControl active={active}
                                  onPause={onPause}
                                  onStart={onStart}
                                  onReset={onReset} />)
        }
    }
}

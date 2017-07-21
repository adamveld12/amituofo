import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import {
    EditTimerDisplay,
    CountdownTimerDisplay,
    Progress
} from '../components'

export default class TimerDisplay extends PureComponent {
    static propTypes = {
        active: PropTypes.bool.isRequired,
        audioPlaying: PropTypes.bool.isRequired,
        duration: PropTypes.number.isRequired,
        minutes: PropTypes.number.isRequired,
        remaining: PropTypes.number.isRequired,
        editMode: PropTypes.bool.isRequired,
        onApplyEdit: PropTypes.func.isRequired,
        onCancelEdit: PropTypes.func.isRequired,
        onStartEditMode: PropTypes.func.isRequired,
        onUpdateEdit: PropTypes.func.isRequired,
    }

    render() {
        const {
            active,
            audioPlaying,
            duration,
            minutes,
            editMode,
            remaining,
            onApplyEdit,
            onCancelEdit,
            onStartEditMode,
            onUpdateEdit,
        } = this.props

        return (
            <Progress duration={duration} editMode={editMode} remaining={remaining} >
              {
                  editMode ?
                   (<EditTimerDisplay minutes={minutes}
                               onCancelEdit={onCancelEdit}
                               onUpdateEdit={onUpdateEdit}
                               onApplyEdit={onApplyEdit} />)
                   :
                  (<CountdownTimerDisplay onStartEditMode={onStartEditMode}
                                   audioPlaying={audioPlaying}
                                   active={active}
                                   duration={duration}
                                   remaining={remaining} />)
              }
            </Progress>
        )
    }
}

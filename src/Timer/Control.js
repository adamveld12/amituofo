import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

import CompletedTimerControl from './CompletedTimerControl'
import CountdownTimerControl from './CountdownTimerControl'
import EditTimerControl from './EditTimerControl'

export default class Control extends PureComponent {
    // eslint-disable-next-line
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
            return (<CompletedTimerControl {...styles} onReset={onReset} />)
        } else if (editMode) {
            return (<EditTimerControl {...styles} onApply={onApply} onCancel={onCancel} />)
        } else {
            return (<CountdownTimerControl active={active}
                                  onPause={onPause}
                                  onStart={onStart}
                                  onReset={onReset} 
                                  {...styles} />)
        }
    }
}

const styles = {
  container: {
    flex: 1,
    width: '70%',
    maxHeight: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 20,
  },
  icon: {
    fontSize: 40,
    width: 60,
    height: 60,
    marginRight: 0,
    color: 'black'
  }
}

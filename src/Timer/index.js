import React, { Component } from 'react'
import {
  AppState,
  StyleSheet,
  Platform,
  View,
  Text
} from 'react-native'
import PropTypes from 'prop-types'

import AudioControl from './AudioControl'
import EditTimer from './EditTimer'
import CountdownTimer from './CountdownTimer'
import Progress from './Progress'
import { actions, store } from '../store'
import { connect } from 'weedux'

import KeepAwake from 'react-native-keep-awake'

class TimerContainerComponent extends Component {
    static navigationOptions = {
        title: "Timer"
    }

    static propTypes = {
        onStart: PropTypes.func.isRequired,
        onPause: PropTypes.func.isRequired,
        onReset: PropTypes.func.isRequired,
        onEditMode: PropTypes.func.isRequired,
        onCancelEdit: PropTypes.func.isRequired,
        onApplyEdit: PropTypes.func.isRequired,
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


    _handleStateChange = (nextState) => {
        if (nextState.match(/inactive|background/)) {
              const { onPause } = this.props
              onPause()
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
            onStart,
            onPause,
            onReset,
            onEditMode,
            onCancelEdit,
            onApplyEdit,
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

        return (
          <View style={styles.container}>
            <Progress duration={duration} edit={edit} remaining={remaining} >
              {
                  edit ?
                   (<EditTimer duration={duration}
                               cancel={() => onCancelEdit(edit)}
                               apply={onApplyEdit} />)
                   :
                  (<CountdownTimer onEditMode={() => onEditMode(edit)}
                                   onStart={() => onStart(remaining, edit)}
                                   onPause={() => onPause(edit)}
                                   onReset={() => onReset(edit)}
                                   audioPlaying={audio.playing}
                                   active={active}
                                   duration={duration}
                                   remaining={remaining} />)
              }
            </Progress>

            <AudioControl {...audio} />
          </View>
        )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginTop: 100,
    ...Platform.select({
      android: {
          marginTop: 50,
          marginBottom: 50,
      }
    })
  }
})

export default connect(
    (state, props) => ({ ...props, ...state }),
    (dispatch, props, state) => {
        const {
            session,
            timer
        } = actions

        return ({
            onStart: (remaining, editMode) => {
                !editMode && dispatch(session.start(remaining))
                KeepAwake.activate()
            },
            onPause: (editMode) => {
                !editMode && dispatch(session.pause())
                KeepAwake.deactivate()
            },
            onReset: (editMode) => {
                !editMode && dispatch(session.reset())
                KeepAwake.deactivate()
            },
            onEditMode: (editMode) => {
                !editMode && dispatch(timer.edit(true))
                KeepAwake.deactivate()
            },
            onCancelEdit: (editMode) => {
                editMode && dispatch(timer.edit(false))
                KeepAwake.deactivate()
            },
            onApplyEdit: (duration) => {
                dispatch(timer.apply(duration))
                KeepAwake.deactivate()
            }
        })
    },
    store
)(TimerContainerComponent)

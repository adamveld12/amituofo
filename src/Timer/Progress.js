import React, { PureComponent } from 'react'
import {
  AppState,
  StyleSheet,
  Platform,
  View,
  Text
} from 'react-native'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import PropTypes from 'prop-types'

export default class Progress extends PureComponent {
    static propTypes = {
        children: PropTypes.object.isRequired,
        duration: PropTypes.number.isRequired,
        remaining: PropTypes.number.isRequired,
        edit: PropTypes.bool.isRequired,
    }

    render(){
        const {
            children,
            duration,
            remaining,
            edit
        } = this.props

        const fill = edit ? 100 : remaining/duration * 100

        return (
            <AnimatedCircularProgress size={300}
                                    width={15}
                                    fill={fill}
                                    tintColor="#8ddba6"
                                    backgroundColor={ fill >= 100 ? "#8ddba6" : "#3d5875"}>
            {
              () => children
            }
            </AnimatedCircularProgress>
        )
    }
}

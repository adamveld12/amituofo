import React, { PureComponent } from 'react'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import PropTypes from 'prop-types'

export default class Progress extends PureComponent {
    static propTypes = {
        children: PropTypes.object.isRequired,
        duration: PropTypes.number.isRequired,
        remaining: PropTypes.number.isRequired,
        editMode: PropTypes.bool.isRequired,
    }

    render(){
        const {
            children,
            duration,
            remaining,
            editMode
        } = this.props

        const fill = editMode ? 100 : remaining/duration * 100
        const fillColor = "black"//"#8ddba6"
        const backgroundColor = "white" //"#3d5875"

        return (
            <AnimatedCircularProgress size={300}
                                    width={15}
                                    fill={fill}
                                    prefill={100}
                                    rotation={180}
                                    linecap="round"
                                    tintColor={fillColor}
                                    backgroundColor={ fill >= 100 ? fillColor : backgroundColor}>
            {
              () => children
            }
            </AnimatedCircularProgress>
        )
    }
}

import React, { PureComponent } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import PropTypes from 'prop-types'

import { sprintf } from 'sprintf'

import FAIcon from 'react-native-vector-icons/FontAwesome'

export default class CountdownTimerDisplay extends PureComponent {
    static propTypes = {
        remaining: PropTypes.number.isRequired,
        duration: PropTypes.number.isRequired,
        onStartEditMode: PropTypes.func.isRequired,
        active: PropTypes.bool.isRequired,
        audioPlaying: PropTypes.bool.isRequired
    }

    render() {
        const {
            remaining,
            duration,
            onStartEditMode,
            active,
            audioPlaying
        } = this.props

        const minutes = Math.floor(remaining / 60)
        const seconds = remaining - (minutes * 60)

        return (
            <View style={styles.progress}>
                <Text style={styles.timerDisplay} onLongPress={() => onStartEditMode()} >
                { sprintf("%01d:%02d", minutes, seconds) }
                </Text>
            </View>
        )
    }
}



export const styles = StyleSheet.create({
    progress: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        width: 300,
        height: 300,
    },
    timerDisplay: {
        backgroundColor: 'transparent',
        textAlign: 'center',
        color: 'white',
        fontSize: 45,
        fontWeight: "100",
        color: 'black',
        width: '100%',
    },
    icon: {
        fontSize: 20,
        textAlign: 'center'
    }
})

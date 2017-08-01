import React, { PureComponent } from 'react'
import {
  StyleSheet,
  Text,
  View
} from 'react-native'
import PropTypes from 'prop-types'

import FAIcon from 'react-native-vector-icons/FontAwesome'

const VOLUME_LOOKUP = ['volume-off', 'volume-down', 'volume-up']

export default class AudioControl extends PureComponent {
  // eslint-disable-next-line 
  state = { loaded: "singing_gong.mp3" }

  // eslint-disable-next-line 
  static propTypes = {
      audioURI: PropTypes.string.isRequired,
      finalVolume: PropTypes.number.isRequired,
      increaseVolume: PropTypes.func.isRequired,
  }

  _changeVolume = () => {
    const { finalVolume, increaseVolume } = this.props
    let newVolume = stepVolume(finalVolume)
    console.log(`going from ${finalVolume} to ${newVolume}`)
    increaseVolume(newVolume)
  }

  render(){
    const {
      audioURI,
      finalVolume
    } = this.props

    const audioTitle =  toTitle(audioURI)
    const volumeIcon = VOLUME_LOOKUP[calcVolume(finalVolume)]

    return (
      <View style={styles.container}>
        <FAIcon.Button name={volumeIcon}
                       size={30} 
                       color='black' 
                       backgroundColor='transparent' 
                       onPress={this._changeVolume} />

        <Text style={styles.soundLabel}>
          { audioTitle }
        </Text>
      </View>
    )
  }
}

function calcVolume(volume){
  if (volume === 1) {
    return 2
  } else if (volume === .5) {
    return 1
  } else {
    return 0 
  }
}

function stepVolume(volume){
  if (volume === 0) {
    return .5
  } else if (volume === .5) {
    return  1
  } else {
    return  0
  }
}

function toTitle(audioURI){
    return audioURI.split('_').map((x) => x[0].toUpperCase() + x.substr(1)).join(' ').replace(/\.mp3/, '')
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'transparent',
    width: '90%',
  },
  soundLabel: {
    color: 'black',
    fontSize: 18
  }
})

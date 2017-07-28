import React, { PureComponent } from 'react'
import {
  StyleSheet,
  Text,
  View
} from 'react-native'
import PropTypes from 'prop-types'

import FAIcon from 'react-native-vector-icons/FontAwesome'

export default class AudioControl extends PureComponent {
  // eslint-disable-next-line 
  state = { loaded: "singing_gong.mp3" }

  // eslint-disable-next-line 
  static propTypes = {
      audioURI: PropTypes.string.isRequired,
  }

  render(){
    const {
      audioURI
    } = this.props

    const audioTitle =  toTitle(audioURI)

    return (
      <View style={styles.container}>
        <FAIcon name="volume-up" size={30} color="black" />
        <Text style={styles.soundLabel}>
          { audioTitle }
        </Text>
      </View>
    )
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

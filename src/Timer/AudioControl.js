import React, { PureComponent } from 'react'
import {
  TouchableNativeFeedback,
  StyleSheet,
  Text,
  View
} from 'react-native'
import PropTypes from 'prop-types'

export default class AudioControl extends PureComponent {
  constructor(){
    super()
    this.state = { loaded: "singing_gong.mp3" }
  }

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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    marginTop: 10,
    marginBottom: 50
  },
  soundLabel: {
    color: '#F5FCFF'
  }
})

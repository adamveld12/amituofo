import React, { PureComponent } from 'react'
import {
  TouchableNativeFeedback,
  StyleSheet,
  Text,
  View
} from 'react-native'

export default class AudioControl extends PureComponent {
  constructor(){
    super()
    this.state = { loaded: "singing_gong.mp3" }
  }


  render(){
    const {
      playing,
      active,
      finalVolume,
      audioURI
    } = this.props

    const audioTitle =  audioURI.split('_').map((x) => x[0].toUpperCase() + x.substr(1)).join(' ').replace(/\.mp3/, '')

    return (
      <View style={styles.container}>
        <Text style={styles.soundLabel}>
          { audioTitle }
        </Text>
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
    marginTop: 10,
    marginBottom: 50
  },
  soundLabel: {
    color: '#F5FCFF'
  }
})

import React, { Component } from 'react'
import { StyleSheet, View } from 'react-native'
import { StackNavigator, createNavigationContainer, addNavigationHelpers } from 'react-navigation'
import AnimatedLinearGradient, {presetColors} from 'react-native-animated-linear-gradient'

import { getState, subscribe, actions, store } from './store'
import { connect } from 'weedux'

import Timer from './Timer'

const Screens = StackNavigator({
    Timer: { screen: Timer, title: "shit" },
    //Stats: { screen: Stats, title: "Statistics" },
    //Timer: { screen: Settings, title: "Settings" },
},
{
    initialRouteName: "Timer",
    lazy: false,
    headerMode: "none",
    mode: "card",
    cardStyle: {
        flex: 1,
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent'
    }
})

class App extends Component {
  constructor(){
    super()
    this.state = getState()
  }

  componentDidMount(){
      const { load } = this.props
      load()
  }

  render() {
    return (
      <View style={styles.container}>
        <AnimatedLinearGradient customColors={gradientColors} speed={10000} />
        <Screens style={{
            flex: 1,
            width: '100%',
            height: '100%'
        }} />
      </View>
    )
  }
}

const gradientColors = [
  '#ca9ebc',
  '#b992ad',
  '#877481',
  '#a57b53'
]

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  }
})

export default connect(
    (state) => state,
    (dispatch) => ({
        load: () => dispatch(actions.storage.load())
    }),
    store
)(App)

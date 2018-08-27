import React from 'react'
import { StyleSheet, Text, View, Switch } from 'react-native'
import { observer } from 'mobx-react'
import AppStore from './store'

@observer
export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.appStore = new AppStore()
    this.toggled = false
  }

  render() {
    const { userPropStore } = this.appStore
    return (
      <View style={styles.container}>
        <Text>ReactNativeMobXAsyncStorage</Text>

        <Switch value={userPropStore.switch1} onValueChange={userPropStore.toggleSwitch1} />
        <Switch value={userPropStore.switch2} onValueChange={userPropStore.toggleSwitch2} />
        <Switch value={userPropStore.switch3} onValueChange={userPropStore.toggleSwitch3} />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

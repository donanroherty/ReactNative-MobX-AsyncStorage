/**
 * A pattern to manage parity between MobX stores and local React Native data
 * via AsyncStorage.
 * Should be simple to modify for LocalStorage on other platforms.
 */

import { observable, action, toJS, reaction } from 'mobx'
import { AsyncStorage } from 'react-native'

export default class AppStore {
  constructor() {
    this.storeName = 'AppStore'
    this.userPropStore = new UserPropStore()

    this.storageHandler = new StorageHandler()

    this.storageHandler.trackStore(this.userPropStore)
    this.storageHandler.refreshStore(this.userPropStore)
  }
}

export class UserPropStore {
  constructor() {
    this.storeName = 'UserPropStore'
  }

  @observable
  switch1 = false

  @observable
  switch2 = true

  @observable
  switch3 = false

  @action
  toggleSwitch1 = () => {
    this.switch1 = !this.switch1
  }

  @action
  toggleSwitch2 = () => {
    this.switch2 = !this.switch2
  }

  @action
  toggleSwitch3 = () => {
    this.switch3 = !this.switch3
  }
}

export class StorageHandler {
  constructor() {
    this.trackedStores = []
  }

  @action
  trackStore = storeRef => {
    // A lit of MobX stores registered with the handler
    this.trackedStores.push(storeRef)

    // Reacts to property changes and updates AsyncStorage to match
    this.userPropStoreReaction = reaction(
      () => toJS(storeRef),
      (storeData, reaction) => {
        this.updateStoreValues(storeData)
      }
    )
  }

  // Set local data to match store data
  @action
  updateStoreValues = async store => {
    try {
      await AsyncStorage.setItem(store.storeName, JSON.stringify(store))
    } catch (e) {
      console.log(e)
    }
  }

  // Refreshes store values to match local data
  @action
  refreshStore = async store => {
    try {
      const localStore = await this.getStore(toJS(store))

      Object.keys(localStore).forEach(key => {
        if (store[key]) {
          store[key] = localStore[key]
        }
      })
    } catch (e) {
      console.log(e)
    }
  }

  // Returns stored data for a MobX store if stored data exists.  Otherwise returns the input store data
  @action
  getStore = async store => {
    try {
      const localStore = (await AsyncStorage.getItem(store.storeName)) || JSON.stringify(store)
      return JSON.parse(localStore)
    } catch (e) {
      console.log(e)
    }
  }
}

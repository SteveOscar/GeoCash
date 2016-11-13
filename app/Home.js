import React, { Component } from 'react'
import styles from './styles/styles'
import Scheme from './styles/colorScheme.js'
import * as firebase from 'firebase'
import { Router, Scene, Actions } from 'react-native-router-flux'
const StatusBar = require('./components/StatusBar')
const ActionButton = require('./components/ActionButton')
const Login = require('./components/Login')
const Main = require('./components/Main')
const ListItem = require('./components/ListItem')
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  AlertIOS,
  AsyncStorage
} from 'react-native'

export default class GroceryApp extends Component {
  constructor(props) {
    super(props)
    this.state = {
      user: null,
    }
  }

  componentDidMount() {
    AsyncStorage.getItem("user").then((user) => {
      if(user) {
        this.setState({ user: user })
        console.log("USER: ", user)
        Actions.MAIN()
      }
    })

    var user = firebase.auth().currentUser
    this.setState({ user: user })
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user })
        AsyncStorage.setItem('user', JSON.stringify(user))
        console.log("USER: ", user)
        Actions.MAIN()
      } else {
        this.setState({ user: null })
        console.log('No User!')
        Actions.LOGIN()
      }
    })
  }

  _setUser(response) {
    this.setState({ currentUser: response })
  }

  renderListPage() {
    return (
      <View>
        <StatusBar title="Grocery List" />
        <ListView dataSource={this.state.dataSource} renderRow={this._renderItem.bind(this)} style={styles.listview}/>
        <ActionButton title="Add" onPress={this._addItem.bind(this)}/>
      </View>
    )
  }

  renderLoginPage() {
    return (
      <Login setUser={this._setUser}/>
    )
  }

  render() {
    return (
      <Router>
        <Scene key="root">
          <Scene key="LOGIN" component={Login} title="Login" setUser={this._setUser} initial={true}/>
          <Scene key="MAIN" component={Main} title="SomeApp"/>
        </Scene>
      </Router>
    )
  }
}

AppRegistry.registerComponent('GroceryApp', () => GroceryApp)

import React, { Component } from 'react'
import styles from './styles/styles'
import Scheme from './styles/colorScheme.js'

import * as firebase from 'firebase'
const StatusBar = require('./components/StatusBar')
const ActionButton = require('./components/ActionButton')
const Login = require('./components/Login')
const ListItem = require('./components/ListItem')
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  AlertIOS
} from 'react-native'

const firebaseConfig = {
  apiKey: "AIzaSyC0lYpQBtg9XObd6b9tedmhiQmQRObVDLY",
  authDomain: "groceryapp-acfa4.firebaseapp.com",
  databaseURL: "https://groceryapp-acfa4.firebaseio.com",
  storageBucket: "groceryapp-acfa4.appspot.com",
  messagingSenderId: "45316330250"
}
const firebaseApp = firebase.initializeApp(firebaseConfig)

export default class GroceryApp extends Component {
  constructor(props) {
    super(props)
    this.itemsRef = firebaseApp.database().ref(),
    this.state = {
      dataSource: new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      })
    }
  }

  componentDidMount() {
    // this.setState({
    //   dataSource: this.state.dataSource.cloneWithRows([{ title: 'Pizza' }])
    // })
    this.listenForItems(this.itemsRef)
  }

  listenForItems(itemsRef) {
    itemsRef.on('value', (snap) => {

      // get children as an array
      var items = []
      snap.forEach((child) => {
        items.push({
          title: child.val().title,
          _key: child.key
        })
      })

      this.setState({
        dataSource: this.state.dataSource.cloneWithRows(items)
      })

    })
  }

  _addItem() {
    AlertIOS.prompt(
      'Add an Item',
      null,
      [
        {
          text: 'Add',
          onPress: (text) => { this.itemsRef.push({ title: text }) }
        },
      ],
      'plain-text'
    )
  }

  _setUser(response) {
    this.setState({ currentUser: response })
  }

  _renderItem(item) {
    const onPress = () => {
      AlertIOS.prompt(
        'Gots It',
        null,
        [
          {text: 'Complete', onPress: (text) => this.itemsRef.child(item._key).remove()},
          {text: 'Cancel', onPress: (text) => console.log('Cancel')}
        ],
        'default'
      )
    }

    return (
      <ListItem item={item} onPress={onPress}/>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <Login setUser={this._setUser}/>
        {/*<StatusBar title="Grocery List" />*/}
        {/*<ListView dataSource={this.state.dataSource} renderRow={this._renderItem.bind(this)} style={styles.listview}/>*/}
        {/*<ActionButton title="Add" onPress={this._addItem.bind(this)}/>*/}
      </View>
    )
  }
}

AppRegistry.registerComponent('GroceryApp', () => GroceryApp)
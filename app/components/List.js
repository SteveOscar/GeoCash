import React, { Component } from 'react'
import styles from '../styles/styles'
import Scheme from '../styles/colorScheme.js'
import * as firebase from 'firebase'
import { Actions } from 'react-native-router-flux'
import firebaseConfig, { itemsRef } from '../firebase'
const StatusBar = require('./StatusBar')
const ActionButton = require('./ActionButton')
const Login = require('./Login')
const ListItem = require('./ListItem')
import {
  StyleSheet,
  Text,
  View,
  ListView,
  AlertIOS,
  AsyncStorage
} from 'react-native'


class List extends Component {
  constructor(props) {
    super(props)
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
    this.listenForItems(itemsRef)
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
          onPress: (text) => { itemsRef.push({ title: text }) }
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
          {text: 'Complete', onPress: (text) => itemsRef.child(item._key).remove()},
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
        <StatusBar title="Grocery List" />
        <ListView dataSource={this.state.dataSource} renderRow={this._renderItem.bind(this)} style={styles.listview}/>
        <ActionButton title="Add" onPress={this._addItem.bind(this)}/>
      </View>
    )
  }
}

module.exports = List

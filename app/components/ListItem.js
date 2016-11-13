import React, {Component} from 'react'
import ReactNative from 'react-native'
import styles from '../styles/styles'
const { View, TouchableHighlight, Text } = ReactNative

class ListItem extends Component {
  render() {
    return (
      <TouchableHighlight onPress={this.props.onPress}>
        <View style={styles.li}>
          <Text style={styles.liText}>{this.props.item.title}</Text>
        </View>
      </TouchableHighlight>
    )
  }
}

module.exports = ListItem

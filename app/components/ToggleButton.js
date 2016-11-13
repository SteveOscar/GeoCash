'use strict'

import React, {Component} from 'react'
import ReactNative from 'react-native'
import styles from '../styles/styles'
const constants = styles.constants
const { StyleSheet, Text, View, TouchableHighlight} = ReactNative

class ToggleButton extends Component {
  render() {
    const { selected } = this.props
    let backgroundColor = selected ? 'teal' : 'white'
    let textColor = selected ? 'white' : 'teal'
    return (
      <View style={[styles.toggleButton, {backgroundColor: backgroundColor}]}>
        <TouchableHighlight
          underlayColor={constants.actionColor}
          onPress={this.props.onPress}>
          <Text style={{fontSize: 16, textAlign: 'center', color: textColor}}>{this.props.title}</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

module.exports = ToggleButton

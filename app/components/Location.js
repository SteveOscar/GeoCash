'use strict'

import React, {Component} from 'react'
import ReactNative from 'react-native'
import styles from '../styles/styles'
import locationStyles from '../styles/locationStyles'
const constants = styles.constants
const { StyleSheet, Text, View } = ReactNative

class Location extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initialPosition: 'unKnown',
    }
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        var initialPosition = JSON.stringify(position);
        this.setState({initialPosition});
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  render() {
    return (
      <View style={locationStyles.container}>
          <Text style={locationStyles.text}>Location</Text>
          <Text style={locationStyles.text}>{this.state.initialPosition}</Text>
      </View>
    )
  }
}

module.exports = Location

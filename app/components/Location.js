'use strict'

import React, {Component} from 'react'
import ReactNative from 'react-native'
import styles from '../styles/styles'
import locationStyles from '../styles/locationStyles'
const constants = styles.constants
const { StyleSheet, Text, View, DeviceEventEmitter } = ReactNative
const { Magnetometer } = require('NativeModules')
Magnetometer.setMagnetometerUpdateInterval(0.1); // in seconds

class Location extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initialPosition: 'unKnown',
      x: 0,
      y: 0,
      z: 0,
      data: ''
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
    )

    DeviceEventEmitter.addListener('MagnetometerData', function (data) {
      this.setState({ x: data.magneticField.x.toFixed(0) })
      this.setState({ y: data.magneticField.y.toFixed(0) })
      this.setState({ z: data.magneticField.z.toFixed(0) })
      this.setState({ data: data.magneticField })
    }.bind(this))
    Magnetometer.startMagnetometerUpdates(); // you'll start getting MagnetomerData events above
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchID);
  }

  render() {
    return (
      <View style={locationStyles.container}>
          <Text style={locationStyles.text}>Location</Text>
          {/*<Text style={locationStyles.text}>{this.state.initialPosition}</Text>*/}
          <Text style={locationStyles.text}>X: {this.state.x}</Text>
          <Text style={locationStyles.text}>Y: {this.state.y}</Text>
          <Text style={locationStyles.text}>Z: {this.state.z}</Text>
          {/*<Text style={locationStyles.text}>{this.state.data}</Text>*/}
      </View>
    )
  }
}

module.exports = Location

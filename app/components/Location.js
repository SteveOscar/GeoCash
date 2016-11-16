'use strict'

import React, {Component} from 'react'
import ReactNative from 'react-native'
import styles from '../styles/styles'
import locationStyles from '../styles/locationStyles'
const constants = styles.constants
const { StyleSheet, Text, View, DeviceEventEmitter } = ReactNative
const { RNLocation: Location } = require('NativeModules')

class LocationPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      long: 'unknown',
      lat: 'unknown',
      heading: 'initial'
    }
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (xy) => {
        this.setState({ long: xy.coords.longitude, lat: xy.coords.latitude })
      },
      (error) => alert(JSON.stringify(error)),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    )

    Location.requestAlwaysAuthorization()
    Location.startUpdatingHeading()
    DeviceEventEmitter.addListener(
      'headingUpdated',
      (data) => {
        this.setState({ heading: Math.round(data.heading) })
      }
    )

  }

  componentWillUnmount() {
    Location.stopUpdatingHeading()
  }

  render() {
    return (
      <View style={locationStyles.container}>
        <Text style={locationStyles.text}>Location</Text>
        <Text style={locationStyles.text}>Longitude: {this.state.long}</Text>
        <Text style={locationStyles.text}>Latitude:  {this.state.lat}</Text>
        <Text style={locationStyles.text}>* * *</Text>
        <Text style={locationStyles.text}>Heading</Text>
        <Text style={locationStyles.text}>X: {this.state.heading}</Text>
      </View>
    )
  }
}

module.exports = LocationPage

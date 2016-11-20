'use strict'

import React, {Component} from 'react'
import ReactNative from 'react-native'
import styles from '../styles/styles'
import locationStyles from '../styles/locationStyles'
const constants = styles.constants
const { StyleSheet, Text, View, DeviceEventEmitter } = ReactNative
const { RNLocation: Location } = require('NativeModules')
const { width, height } = require('Dimensions').get('window')

class LocationPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      long: 'unknown',
      lat: 'unknown',
      heading: 'initial',
      bearing: 'unknown'
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
        let bearing = this.getBearing(this.state.lat, this.state.long, 39.576640, -104.988696)
        this.setState({ heading: Math.round(data.heading), bearing: bearing })
      }
    )

  }

  componentWillUnmount() {
    Location.stopUpdatingHeading()
  }

  radians(n) {
    return n * (Math.PI / 180);
  }
  degrees(n) {
    return n * (180 / Math.PI);
  }

  getBearing(startLat,startLong,endLat,endLong){
    startLat = this.radians(startLat);
    startLong = this.radians(startLong);
    endLat = this.radians(endLat);
    endLong = this.radians(endLong);

    var dLong = endLong - startLong;

    var dPhi = Math.log(Math.tan(endLat/2.0+Math.PI/4.0)/Math.tan(startLat/2.0+Math.PI/4.0));
    if (Math.abs(dLong) > Math.PI){
      if (dLong > 0.0)
         dLong = -(2.0 * Math.PI - dLong);
      else
         dLong = (2.0 * Math.PI + dLong);
    }

    return (this.degrees(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
  }

  render() {
    let { heading, bearing } = this.state
    let colorUp = ((heading > (bearing - 90)) && (heading < (bearing + 90))) ? 'red' : 'white'
    let colorDown = (colorUp === 'red') ? 'white' : 'red'
    return (
      <View style={locationStyles.container}>
        <View style={{ flexDirection: 'column' }}>
          <View style={{ flex: 1, backgroundColor: colorUp, width: width }}>
          </View>
          <View style={{ flex: 1, backgroundColor: colorDown, alignItems: 'center' }}>
            <Text style={locationStyles.text}>Heading</Text>
            <Text style={locationStyles.text}>{this.state.heading}</Text>
            <Text style={locationStyles.text}>Bearing</Text>
            <Text style={locationStyles.text}>{this.state.bearing}</Text>
          </View>
        </View>
      </View>
    )
  }
}

module.exports = LocationPage

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
      bearing: 'unknown',
      distance: 'unknown'
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
        let distance = this.getDistance(this.state.lat, this.state.long, 39.576640, -104.988696)
        this.setState({ heading: Math.round(data.heading), bearing: bearing, distance: Math.round(distance) })
      }
    )

  }

  componentWillUnmount() {
    Location.stopUpdatingHeading()
  }

  getDistance(lat1, lon1, lat2, lon2) {
    let R = 6371; // Radius of the earth in km
    let dLat = this.deg2rad(lat2-lat1);
    let dLon = this.deg2rad(lon2-lon1);
    let a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ;
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    let d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI/180)
  }

  radians(n) {
    return n * (Math.PI / 180);
  }
  degrees(n) {
    return n * (180 / Math.PI);
  }

  getBearing(startLat, startLong, endLat, endLong){
    startLat = this.radians(startLat);
    startLong = this.radians(startLong);
    endLat = this.radians(endLat);
    endLong = this.radians(endLong);

    let dLong = endLong - startLong;

    let dPhi = Math.log(Math.tan(endLat/2.0+Math.PI/4.0)/Math.tan(startLat/2.0+Math.PI/4.0));
    if (Math.abs(dLong) > Math.PI){
      if (dLong > 0.0) {
         dLong = -(2.0 * Math.PI - dLong);
      } else {
        dLong = (2.0 * Math.PI + dLong);
      }
    }

    return (this.degrees(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
  }

  between(lower, upper, point) {
    if(upper < lower) { upper += 360 }
    if(point < lower) { point += 360 }
    return (point <= upper && point >= lower)
  }

  upPoints(bearing) {
    return [Math.round((bearing + 315) % 360), Math.round((bearing + 45) % 360)]
  }

  rightPoints(bearing) {
    return [Math.round((bearing + 225) % 360), Math.round((bearing + 315) % 360)]
  }

  downPoints(bearing) {
    return [Math.round((bearing + 135) % 360), Math.round((bearing + 225) % 360)]
  }

  leftPoints(bearing) {
    return [Math.round((bearing + 45) % 360), Math.round((bearing + 135) % 360)]
  }


  render() {
    let { heading, bearing, distance } = this.state

    const upPoints = this.upPoints(bearing)
    const rightPoints = this.rightPoints(bearing)
    const downPoints = this.downPoints(bearing)
    const leftPoints = this.leftPoints(bearing)

    let colorUp = this.between(upPoints[0], upPoints[1], heading) ? 'red' : 'grey'
    let colorRight = this.between(rightPoints[0], rightPoints[1], heading) ? 'red' : 'grey'
    let colorDown = this.between(downPoints[0], downPoints[1], heading) ? 'red' : 'grey'
    let colorLeft = this.between(leftPoints[0], leftPoints[1], heading) ? 'red' : 'grey'

    return (
      <View style={locationStyles.container}>
        <View style={{ flexDirection: 'column' }}>

          <View style={{flex: 1, width: width, alignItems: 'center'}}>
            <View style={{ backgroundColor: colorUp, width: 40, height: 40 }}></View>
          </View>

          <View style={{flex: 1, width: width, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <View style={{ backgroundColor: colorLeft, width: 40, height: 40 }}></View>
            <Text style={locationStyles.text}>Heading</Text>
            <Text style={locationStyles.text}>{this.state.heading}</Text>
            <Text style={locationStyles.text}>DISTANCE:</Text>
            <Text style={locationStyles.text}>{distance}</Text>
            <View style={{ backgroundColor: colorRight, width: 40, height: 40 }}></View>
          </View>

          <View style={{flex: 1, width: width, alignItems: 'center', justifyContent: 'flex-end'}}>
            <View style={{ backgroundColor: colorDown, width: 40, height: 40 }}></View>
          </View>

        </View>
      </View>
    )
  }
}

module.exports = LocationPage

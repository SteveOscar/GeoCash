const React = require('react-native')
const {StyleSheet} = React
const constants = {
  actionColor: '#24CE84'
}
import Scheme from './colorScheme.js'

const { width, height } = require('Dimensions').get('window')

var locationStyles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  transponder: {
    flexDirection: 'column'
  },
  segment: {
    flex: 1
  }
})

module.exports = locationStyles
module.exports.constants = constants

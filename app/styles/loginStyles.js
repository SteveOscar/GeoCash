const React = require('react-native')
const {StyleSheet} = React
const constants = {
  actionColor: '#24CE84'
}
import Scheme from './colorScheme.js'

const { width, height } = require('Dimensions').get('window')

var loginStyles = StyleSheet.create({
  loginContainer: {
    flex: 1,
    height: height * .8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f2f2f2'
  },
  inputStyle: {
    height: 40,
    borderColor: Scheme.color3,
    borderWidth: 2,
    borderRadius: 5,
    padding: 4,
    margin: 10,
    color: Scheme.color1,
    textAlign:"center",
  },
  headerText2: {
    alignSelf: 'center',
    marginBottom: 10,
    fontSize: height * .045,
    color: Scheme.color5
  },
  headerText: {
    alignSelf: 'center',
    fontSize: height * .03,
    color: Scheme.color4
  },
  loginFunctionView: {
    flexDirection: 'row'
  },
  spinner: {
  }
})

module.exports = loginStyles
module.exports.constants = constants

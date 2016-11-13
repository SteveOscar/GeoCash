'use strict'

import React, {Component} from 'react'
import * as firebase from 'firebase'
import firebaseConfig, { itemsRef } from '../firebase'
import { Actions } from 'react-native-router-flux'
import ReactNative from 'react-native'
import loginStyles from '../styles/loginStyles'
import Scheme from '../styles/colorScheme.js'

import dismissKeyboard from 'react-native/Libraries/Utilities/dismissKeyboard'
const StatusBar = require('./StatusBar')
const ActionButton = require('./ActionButton')
const ToggleButton = require('./ToggleButton')
const constants = loginStyles.constants
const { StyleSheet, Text, View, TouchableHighlight, ScrollView, Animated, TextInput} = ReactNative

const { width, height } = require('Dimensions').get('window')

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      emailText: '',
      passwordText: '',
      isLoading: false,
      message: '',
      newUser: true
    }
  }

  textInputFocused() {
    this.setState({ message: '' })
    this.refs.scroll.scrollTo({x: 0, y: 100, animated: true})
  }

  textInputBlur() {
    dismissKeyboard()
    this.refs.scroll.scrollTo({x: 0, y: 0, animated: true})
  }

  onButtonPressed() {
    if(this.state.isLoading) { return }
    this.setState({ isLoading: true })
    this._executeQuery()
  }

  onTogglePressed(type) {
    const { newUser } = this.state
    if(type === 'existing' && newUser) { this.setState({ newUser: false }) }
    if(type === 'new' && !newUser) { this.setState({ newUser: true }) }
  }

  onLoginPressed() {
    if(this.state.newUser) {
      this.signUp()
    } else {
      this.signIn()
    }
  }

  signUp() {
    const { emailText, passwordText } = this.state
    firebase.auth().createUserWithEmailAndPassword(emailText, passwordText).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
  }

  signIn() {
    const { emailText, passwordText } = this.state
    firebase.auth().signInWithEmailAndPassword(emailText, passwordText).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
  }

  render() {
    return (
      <View style={loginStyles.container}>
        {this.renderButtons()}
      </View>
    )
  }

  renderButtons() {
    const { newUser } = this.state
    const spinner = this.state.isLoading ? (<ActivityIndicator size='large' color='white'/>) : (<View style={{height: 35}} />)
    const statusText = newUser ? 'New User' : 'Existing User'
    const actionText = newUser ? 'Sign Up' : 'Login'
    return (
      <View>
        <StatusBar title={statusText} />
        <ScrollView ref='scroll'>
          <View style={loginStyles.loginContainer}>
                      {spinner}
            <View style={loginStyles.loginFunctionView}>
              <ToggleButton title={'New User'} selected={this.state.newUser} onPress={this.onTogglePressed.bind(this, 'new')}/>
              <ToggleButton title={'Existing User'} selected={!this.state.newUser} onPress={this.onTogglePressed.bind(this, 'existing')}/>
            </View>
            <Text allowFontScaling={false} style={loginStyles.headerText2}>Welcome to the app</Text>
            <Text allowFontScaling={false} style={loginStyles.headerText}>Email:</Text>
            <TextInput
              autoCapitalize={'none'}
              style={loginStyles.inputStyle}
              onChangeText={(emailText) => this.setState({emailText})}
              value={this.state.emailText}
              autoCorrect={false}
              maxLength={40}
              selectionColor={Scheme.color3}
              keyboardType={'default'}
              onFocus={this.textInputFocused.bind(this)}
              onBlur={this.textInputBlur.bind(this)}
              />
            <Text allowFontScaling={false} style={loginStyles.headerText}>Password:</Text>
            <TextInput
              autoCapitalize={'none'}
              style={loginStyles.inputStyle}
              onChangeText={(passwordText) => this.setState({passwordText})}
              value={this.state.passwordText}
              autoCorrect={false}
              maxLength={20}
              selectionColor={Scheme.color3}
              keyboardType={'default'}
              onFocus={this.textInputFocused.bind(this)}
              onBlur={this.textInputBlur.bind(this)}
              />
            <Text allowFontScaling={false} >{this.state.message}</Text>
          </View>
        </ScrollView>
        <ActionButton title={actionText} onPress={this.onLoginPressed.bind(this)}/>
      </View>
    )
  }
}

module.exports = Login

/**
 * Imports React Native
 */
import React, { Component } from 'react';
import { ActivityIndicator, Animated, AsyncStorage, Dimensions, Image, Keyboard, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AwesomeAlert from 'react-native-awesome-alerts';
import KeyboardSpacer from 'react-native-keyboard-spacer';

import OfflineNotice from '../components/OfflineNotice';
import { _getProps, screen } from '../config';
import { loginCards } from '../config/constantes';
import Styles from '../styles';

/**
 * Imports local
 */
/**
 * Variables
 */
var DeviceInfo = require('react-native-device-info');
const ANIMATION_DURATION = 400;
const ROW_HEIGHT = screen.height;

/**
 * Classe principale
 */
export default class Login extends Component {
  static navigationOptions = {
    title: 'Guide Taureaux',
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      message: 'message',
      username: '',
      password: '',
      showAlert: false,
      showLogin: false,
      showLoading: false,
      DeviceIMEI: '',
    };
    this._animated = new Animated.Value(0);
  }
  showAlert = () => {
    this.setState({
      showAlert: true,
    });
  };

  hideAlert = () => {
    this.setState({
      showAlert: false,
    });
  };

  componentDidMount() {
    Animated.timing(this._animated, {
      toValue: 1,
      duration: ANIMATION_DURATION,
    }).start();
    this._loadInitialState().done();
  }

  /**
   * récupération du dernier login saisi (via AsyncStorage)
   */
  _loadInitialState = async () => {
    var value = await AsyncStorage.getItem('user');
    if (value !== null) {
      this.setState({ username: value });
    }
  };

  /**
   * CHARGEMENT DES VARIABLES DE STOCKAGE A RAPPELER DANS certains ou TOUS LES ECRANS
   */
  _storeData = async saveUser => {
    AsyncStorage.clear();
    try {
      await AsyncStorage.setItem('user', saveUser);
    } catch (error) {
      console.log('ERROR STORE-DATA');
      console.log(error);
    }
  };

  _storeMinMax = async minMaxSort => {
    try {
      await AsyncStorage.setItem('MinMax', minMaxSort);
    } catch (error) {
      console.log('ERROR _storeMinMax');
      console.log(error.message);
      // Error saving data
    }
  };

  _handleLoading = async () => {
    this.setState({ alertUser: false, showLogin: false, showLoading: true });
    this._handleLogin();
  };

  _handleLogin = () => {
    var _this = this;
    Keyboard.dismiss();
    var found = loginCards.filter(obj => {
      return obj.username === _this.state.username;
    });

    if (found.length !== 0) {
      this._storeData(this.state.username);

      this.props.navigation.navigate('Menu', {
        //this.props.navigation.navigate('Tbvw', {
        username: this.state.username,
        userdata: found,
      });
      this.setState({ showLoading: false });
    } else {
      this.setState({ showLoading: false });
      this.showAlert();
    }
  };

  _onSubmitUsername = () => {
    this.passwordInput.focus();
  };

  _getDeviceIMIE = () => {
    const IMEI = require('react-native-imei');
    this.setState({
      DeviceIMEI: IMEI.getImei(),
    });
  };

  render() {
    let { alertUser, showAlert, showLogin, username } = this.state;
    let props = _getProps('Login adhérent', 'Code erroné!');
    const rowStyles = [
      styles.row,
      {
        height: this._animated.interpolate({
          inputRange: [0, 1],
          outputRange: [0, ROW_HEIGHT],
          extrapolate: 'clamp',
        }),
      },
      { opacity: this._animated },
      {
        transform: [
          { scale: this._animated },
          {
            rotate: this._animated.interpolate({
              inputRange: [0, 1],
              outputRange: ['35deg', '0deg'],
              extrapolate: 'clamp',
            }),
          },
        ],
      },
    ];
    const { width, height } = screen;
    const backgroundColor = this.state.showLogin
      ? '#336191'
      : 'rgba(22, 130, 208,0.2)';
    const color = this.state.showLogin ? '#fff' : 'rgba(255, 255, 255,0.4)';
    if (this.state.showLoading) {
      return (
        <View style={{ flex: 1, backgroundColor: 'transparent' }}>
          <View>
            <Animated.View style={[rowStyles]}>
              <Image
                style={{
                  height: height,
                  width: width,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                }}
                source={require('../images/gtrx-fond-accueil-200.png')}
              />
            </Animated.View>
          </View>
          <ScrollView style={{ flex: 1 }}>
            <View style={styles.container}>
              <OfflineNotice />
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <ActivityIndicator size="large" color="#fed330" />
              </View>
            </View>
          </ScrollView>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1, backgroundColor: 'transparent' }}>
          <View>
            <Image
              style={{
                height: height,
                width: width,
                position: 'absolute',
                top: 0,
                left: 0,
              }}
              source={require('../images/gtrx-fond-accueil.png')}
            />
          </View>
          <OfflineNotice />
          <Animated.View style={[rowStyles]}>
            <ScrollView style={{ flex: 1 }}>
              <View behavior="padding" style={styles.container}>
                <AwesomeAlert
                  show={showAlert}
                  onConfirmPressed={() => this.hideAlert()}
                  {...props}
                />
                <View style={styles.formContainer}>
                  <StatusBar barStyle="light-content" />
                  <View style={{ height: height / 4 }} />
                  <TextInput
                    placeholder="Code adhérent"
                    placeholderTextColor="rgba(255,255,255,0.7)"
                    returnKeyType="next"
                    onFocus={() => this.setState({ showLogin: true })}
                    onBlur={() => this.setState({ showLogin: false })}
                    onSubmitEditing={() => this._onSubmitUsername()}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    // autoFocus={true}
                    onChangeText={username => this.setState({ username })}
                    underlineColorAndroid="transparent"
                    ref={input => (this.usernameInput = input)}
                    style={[
                      styles.input,
                      { color: color, backgroundColor: backgroundColor },
                    ]}
                    defaultValue={username} //{defaultUsername}
                  />
                  <TextInput
                    placeholder="mot de passe"
                    placeholderTextColor="rgba(255,255,255,0.7)"
                    onFocus={() => this.setState({ showLogin: true })}
                    onBlur={() => this.setState({ showLogin: false })}
                    secureTextEntry
                    style={[
                      styles.input,
                      { color: color, backgroundColor: backgroundColor },
                    ]}
                    returnKeyType="go"
                    onChangeText={password => this.setState({ password })}
                    underlineColorAndroid="transparent"
                    onSubmitEditing={() => this.setState({ showLogin: false })}
                    ref={input => (this.passwordInput = input)}
                  />

                  <TouchableOpacity
                    style={Styles.buttonContainer}
                    onPress={this._handleLoading}
                  >
                    <Text
                      ref={loginButton => (this.touchable = loginButton)}
                      style={[Styles.buttonText]}
                    >
                      Connexion
                    </Text>
                  </TouchableOpacity>
                </View>
                <KeyboardSpacer />
              </View>
            </ScrollView>
          </Animated.View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  alertContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#8faecb',
  },
  color: {
    fontStyle: 'italic',
  },
  container: {
    flex: 1,
    paddingTop: Platform.OS == 'ios' ? 20 : 0,
  },
  formContainer: {
    padding: 15,
  },
  input: {
    height: 40,
    marginBottom: 10,
    color: '#FFF',
    fontSize: 18,
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: 'center',
    flexGrow: 1,
    justifyContent: 'center',
  },
  logo: {
    width: '80%',
    height: '90%',
  },
  modal: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    color: 'black',
    fontSize: 22,
  },
  title: {
    justifyContent: 'center',
    color: 'white',
    textAlign: 'center',
    marginTop: 10,
    width: 300,
    opacity: 0.6,
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    alignItems: 'center',
    height: ROW_HEIGHT,
  },
});

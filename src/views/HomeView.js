import React, { Component, PureComponent } from 'react';
import { Image, ImageBackground, View } from 'react-native';

import HeaderComponent from '../components/Header';
import OfflineNotice from '../components/OfflineNotice';
import { BackgroundImage } from '../config';
import Styles from '../styles';

const backgroundColor = 'transparent'; //'#0a3d62'////'#0067a7';

export default class HomeView extends PureComponent {
  static navigationOptions = ({ navigation }) => {
    let drawerLabel = 'Menu';
    let drawerIcon = () => (
      <View>
        <ImageBackground
          source={require('../images/home.png')}
          style={{ width: 26, height: 26, tintColor: backgroundColor }}
        />
      </View>
    );
    return { drawerLabel, drawerIcon };
  };
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <BackgroundImage>
        <HeaderComponent {...this.props} title="Accueil" />
        <View style={{ flex: 1, alignItems: 'stretch' }}>
          <OfflineNotice />
          <Image
            resizeMode="contain"
            style={{
              flex: 1,
              width: null,
            }}
            source={require('../images/construction2.png')}
          />
        </View>
      </BackgroundImage>
    );
  }
}

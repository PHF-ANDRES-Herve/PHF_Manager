import React, { PureComponent } from 'react';
import { Dimensions, Image, NetInfo, StyleSheet, Text, View } from 'react-native';

import { screen } from '../config';

/**
 * PREVOIR DE DETECTER LE WIFI POUR CHARGEMENT DES DONNEES + IMPORTANTES
 */
// utiliser la méthode getConnexionInfo : return Object 'connection Type', propriété 'none', 'cellular', 'wifi'
// ouvrir fenêtre de dialogue Ok pas OK +> OUVRIR FEN SYSTEME CONNEXION pour activation 'Wifi', android Natif

const { width } = screen;

function MiniOfflineSign() {
  return (
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineText}>No Internet Connection</Text>
    </View>
    // <View>
    //   <Image
    //     style={styles.image}
    //     source={require('./images/noConnection.png')} />
    // </View>
  );
}

class OfflineNotice extends PureComponent {
  state = {
    isConnected: true,
  };

  componentDidMount() {
    NetInfo.isConnected.addEventListener(
      'connectionChange',
      this.handleConnectivityChange
    );
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      'connectionChange',
      this.handleConnectivityChange
    );
  }

  handleConnectivityChange = isConnected => {
    if (isConnected) {
      this.setState({ isConnected });
    } else {
      this.setState({ isConnected });
    }
  };

  render() {
    if (!this.state.isConnected) {
      return <MiniOfflineSign />;
    }
    return null;
  }
}

const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: '#b52424',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    position: 'absolute',
    top: 50,
    zIndex: 5,
  },
  offlineText: { color: '#fff' },
  image: {
    width: '50%',
    height: '50%',
    // paddingLeft:0,
  },
});

export default OfflineNotice;

import React, { Component } from 'react';
import { Image, Linking, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';

/** Mr Nguyen Duc Hoang


https://www.youtube.com/c/nguyenduchoang
Email: sunlight4d@gmail.com
HeaderComponent => used for both Home, Info, Cloud, Settings
**/

// import Button from 'react-native-button';
export default class HeaderComponent extends Component {
  render() {
    return (
      <View
        style={{
          height: 50,
          flexDirection: 'row',
          // justifyContent: 'flex-start',
          alignItems: 'center',
          backgroundColor: '#0a3d62',
        }}
      >
        <TouchableOpacity
          style={{ marginLeft: 10, marginTop: 10 }}
          onPress={() => {
            const { navigate } = this.props.navigation;
            this.props.navigation.openDrawer();
          }}
        >
          <View style={{ flex: 1, flexDirection: 'row', paddingBottom: 10 }}>
            <Image
              style={{ width: 60, height: 26, flexGrow: 1, flexBasis: '15%' }}
              source={require('../images/phf.jpg')}
            />
            <Text
              style={{
                marginLeft: 40,
                fontSize: 20,
                fontWeight: 'bold',
                textAlign: 'left',
                flexGrow: 1,
                flexBasis: '55%',
                textAlignVertical: 'center',
                color: '#de7022',
              }}
            >
              {this.props.title}
            </Text>
            {/* <TouchableOpacity style={{flexGrow: 1, flexBasis: '100%',padding:0, }} onPress={() => Linking.openURL(urlPHF)}>
                        <Image
                            style={{ height: '100%', width: '15%', flexGrow: 1, resizeMode: 'stretch' }}
                            source={require('../images/phf.jpg')}
                        />
                    </TouchableOpacity> */}
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

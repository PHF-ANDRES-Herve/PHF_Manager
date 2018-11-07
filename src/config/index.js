import React, { Component, PureComponent } from 'react';
import { BackHandler, Dimensions, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableHighLight, View } from 'react-native';

import { percentColors1, percentColors2, percentColors3, percentColors4 } from './constantes';

const colorIndex = {
  '-0.1': '#ffe6e6',
  '-0.2': '#ffe6e6',
  '-0.3': '#ffe6e6',
  '-0.4': '#ffcccc',
  '-0.5': '#ffcccc',
  '-0.6': '#ffcccc',
  '-0.7': '#ffb3b3',
  '-0.8': '#ffb3b3',
  '-0.9': '#ffb3b3',
  '-1.0': '#ffb3b3',
  '-1': '#ffb3b3',
  '-1.1': '#ff9999',
  '-1.2': '#ff9999',
  '-1.3': '#ff9999',
  '-1.4': '#ff9999',
  '-1.5': '#ff9999',
  '-1.6': '#ff8080',
  '-1.7': '#ff8080',
  '-1.8': '#ff8080',
  '-1.9': '#ff8080',
  '-2.0': '#ff8080',
  '-2': '#ff8080',
  '-2.1': '#ff6666',
  '-2.2': '#ff6666',
  '-2.3': '#ff6666',
  '-2.4': '#ff6666',
  '-2.5': '#ff6666',
};
const config = {
  alert: {
    cancelText: 'Cancel',
    confirmText: 'Confirm',
  },
  colors: {
    title: '#626262',
    msg: '#7b7b7b',
    cancel: '#D0D0D0',
    confirm: '#AEDEF4',
    confirmWarning: '#DD6B55',
  },
  size: {
    title: 18,
    msg: 14,
    actionButtonBorderRadius: 5,
    actionButtonFontSize: 13,
  },
  spacing: {
    alertContainerPadding: 10,
    alertContentPadding: 5,
    titlePadding: 5,
    titlePaddingSides: 15,
    msgPadding: 5,
    msgPaddingSides: 10,
    actionButtonPaddingHorizontal: 10,
    actionButtonPaddingVertical: 7,
    actionButtonMargin: 5,
    actionButtonMarginTop: 5,
  },
  type: {
    progress: 'Progress',
    warning: 'Warning',
    error: 'error',
    action: 'Action',
  },
};
export default config;

export const screen = Dimensions.get('window');

export function _getProps(title, message) {
  let alertProps = {};
  let show2 = false;
  return (alertProps = {
    title: title,
    message: message,
    showConfirmButton: true,
    confirmText: 'Retour',
    confirmButtonColor: config.colors.confirm,
    showProp: show2,
    // onConfirmPressed: () => {
    //   show2=true;
    // },
    overlayStyle: {
      backgroundColor: 'rgba(152,152,152,0.5)',
    },
    contentContainerStyle: {
      zIndex: 5,
      backgroundColor: 'white',
    },
    titleStyle: {
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 18,
    },
    messageStyle: {
      fontSize: 18,
    },
  });
}
export function getColorForPercentage(pct, percentColors) {
  if (pct > percentColors[4].pct) {
    pct = percentColors[4].pct;
  } else if (pct < percentColors[0].pct) {
    pct = percentColors[0].pct;
  }

  for (var i = 1; i < percentColors.length - 1; i++) {
    if (pct < percentColors[i].pct) {
      break;
    }
  }
  var lower = percentColors[i - 1];
  var upper = percentColors[i];
  var range = upper.pct - lower.pct;
  var rangePct = (pct - lower.pct) / range;
  var pctLower = 1 - rangePct;
  var pctUpper = rangePct;

  var color = {
    r: Math.floor(lower.color.r * pctLower + upper.color.r * pctUpper),
    g: Math.floor(lower.color.g * pctLower + upper.color.g * pctUpper),
    b: Math.floor(lower.color.b * pctLower + upper.color.b * pctUpper),
  };

  return 'rgb(' + [color.r, color.g, color.b].join(',') + ')';
}

export function getColor(value) {
  // value < -2.4 ? { return 'rgb(255, 245, 215)'} :{}  }
  return colorIndex[value];
}
export class BackgroundImage extends Component {
  render() {
    return (
      <ImageBackground
        source={require('../images/fond-bleu-PHF-200.jpg')}
        style={styles.backgroundImage}
      >
        {this.props.children}
      </ImageBackground>
    );
  }
}
const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
  },
});

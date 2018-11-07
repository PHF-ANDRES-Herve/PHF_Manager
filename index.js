/**
 * import REACT NATIVE
 */
import { Animated, AppRegistry, YellowBox } from 'react-native';

import App from './App';

/* console.disableYellowBox = true;
YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated',
  'Module RCTImageLoader',
]);
YellowBox.ignoreWarnings(['Warning: Each']); */

AppRegistry.registerComponent('PHF_Manager', () => App);

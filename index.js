/**
 * import REACT NATIVE
 */
import { Animated, AppRegistry, Dimensions, YellowBox } from 'react-native';
import { DrawerNavigator, StackNavigator } from 'react-navigation';

import App from './App';
import { Info, Menu } from './src/views';
import HomeComponent from './src/views/HomeComponent';
import Apropos from './src/views/Info';
import Login from './src/views/Login';

//import Liste from './src/components/Liste';

var { height, width } = Dimensions.get('window');

// Drawer Navigator
export const Drawer = DrawerNavigator(
	{
		Menu: {
			screen: HomeComponent
		},
		Info: {
			screen: Apropos
		}
	},
	{
		initialRouteName: Menu,
		drawerWidth: width / 2,
		drawerPosition: 'left',
		drawerOpenRoute: 'DrawerOpen',
		drawerCloseRoute: 'DrawerClose',
		drawerToggleRoute: 'DrawerToggle',
		contentOptions: {
			activeTintColor: 'orange'
		}
	}
);

// Main App Navigation
export const AppStack = StackNavigator(
	{
		Login: {
			screen: Login,
			navigationOptions: {
				header: null,
				gesturesEnabled: false
			}
		},
		Drawer: {
			screen: Drawer,
			navigationOptions: {
				header: null,
				gesturesEnabled: false
			}
		}
	},
	{ headerMode: 'none' }
);

console.disableYellowBox = true;
YellowBox.ignoreWarnings([
	'Warning: isMounted(...) is deprecated',
	'Module RCTImageLoader'
]);
YellowBox.ignoreWarnings(['Warning: Each']);

AppRegistry.registerComponent('PHF_Manager', () => App);

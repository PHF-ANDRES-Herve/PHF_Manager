import React from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import { createDrawerNavigator, createStackNavigator } from 'react-navigation';

import { screen } from '../config';
import { Decl, Info, Menu } from '../views';
import { Declaration, DeclarationEntry, DeclarationExit, DeclarationPregnancyDiagnostic, DeclarationReproductionAct } from '../views/Declaration';
import HomeView from '../views/HomeView';
import Apropos from '../views/Info';
import ListTest from '../views/ListTestView';
import Login from '../views/Login';

//import Liste from './src/components/Liste';

const { width } = screen;

// Declaration Stack Navigation
const DeclarationStackNavigator = createStackNavigator(
	{
		Declaration: {
			screen: Declaration,
			navigationOptions: {
				title: 'Déclarations',
				header: null,
				gesturesEnabled: false
			}
		},
		DeclarationEntry: {
			screen: DeclarationEntry,
			navigationOptions: {
				title: 'Entrée',
				header: null,
				gesturesEnabled: false
			}
		},
		DeclarationExit: {
			screen: DeclarationExit,
			navigationOptions: {
				title: 'Sortie',
				header: null,
				gesturesEnabled: false
			}
		},
		DeclarationReproductionAct: {
			screen: DeclarationReproductionAct,
			navigationOptions: {
				title: 'Acte de reproduction',
				header: null,
				gesturesEnabled: false
			}
		},
		DeclarationPregnancyDiagnostic: {
			screen: DeclarationPregnancyDiagnostic,
			navigationOptions: {
				title: 'Constat de gestation',
				header: null,
				gesturesEnabled: false
			}
		}
	},
	{
		initialRouteName: 'Declaration'
	}
);

// Drawer Navigator
const Drawer = createDrawerNavigator(
	{
		Menu: {
			screen: HomeView
		},
		Declaration: {
			screen: DeclarationStackNavigator,
			navigationOptions: {
				drawerLabel: 'Déclarations',
				drawerIcon: () => (
					<View>
						<Icon name="edit" type="font-awesome" />
					</View>
				)
			}
		},
		ListTest: {
			screen: ListTest,
			navigationOptions: {
				drawerLabel: 'Liste test',
				drawerIcon: () => (
					<View>
						<Icon name="list" type="font-awesome" />
					</View>
				)
			}
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
const AppStack = createStackNavigator(
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
export default AppStack;

/**
 * IMPORT
 */
import React, { PureComponent } from 'react';
import { AsyncStorage, Dimensions, Image, ImageBackground, Linking, ScrollView, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from 'react-native';

import HeaderComponent from '../components/Header';
import { BackgroundImage } from '../config';
import { loginCards } from '../config/constantes';
import Styles from '../styles';

/**
 * VARIABLES
 */

var screen = Dimensions.get('window');
const backgroundColor = 'transparent';

class GoBack extends PureComponent {
	constructor(props) {
		super(props);
		this.navigation = this.props.navi;
	}
	render() {
		return (
			<TouchableHighlight
				style={{
					// margin: 20,
					width: 200,
					height: 45,
					// backgroundColor: "#9400d3",
					// padding: 10,
					alignItems: 'center'
				}}
				onPress={() => {
					this.navigation.goBack();
				}}
			>
				<Text
					style={[
						Styles.buttonText,
						{
							height: 40,
							fontSize: 16,
							backgroundColor: '#de7022',
							alignSelf: 'center',
							width: screen.width / 2
						}
					]}
				>
					Retour
				</Text>
			</TouchableHighlight>
		);
	}
}

export default class Apropos extends PureComponent {
	static navigationOptions = ({ navigation }) => {
		let drawerLabel = 'A propos';
		let drawerIcon = () => (
			<View>
				<ImageBackground
					source={require('../images/info2.png')}
					style={{ width: 26, height: 26 }} //, tintColor: backgroundColor
				/>
			</View>
		);
		return { drawerLabel, drawerIcon };
	};
	constructor(props) {
		super(props);
		this.state = {
			username: ''
		};
		console.log(loginCards);
	}

	componentDidMount() {
		this._loadInitialState().done();
	}
	_loadInitialState = async () => {
		var value = await AsyncStorage.getItem('user');
		console.log('VALUE = ' + value);
		if (value !== null) {
			this.setState({ username: value });
		}
	};
	_storeData = async saveUser => {
		AsyncStorage.clear();
		try {
			await AsyncStorage.setItem('user', saveUser);
		} catch (error) {
			// Error saving data
		}
	};

	render() {
		const { navigation } = this.props;

		var userData = loginCards.filter(obj => {
			return obj.username === this.state.username;
		});
		if (userData.length !== 0) {
			const [
				{
					id,
					username,
					name,
					email,
					address: { city, suite, street, zipcode }
				}
			] = userData;
			const urlPHF = 'https://primholstein.com/';

			return (
				<View
					style={{
						flex: 1,
						flexDirection: 'column'
					}}
				>
					<BackgroundImage>
						<HeaderComponent {...this.props} />
						<ScrollView>
							<View
								style={{
									flex: 1,
									backgroundColor: backgroundColor,
									alignItems: 'center',
									justifyContent: 'center'
								}}
							>
								<TouchableOpacity
									style={{ flexGrow: 1, flexBasis: '100%', padding: 0 }}
									onPress={() => Linking.openURL(urlPHF)}
								>
									<Image
										style={{ flexGrow: 1, resizeMode: 'stretch' }}
										source={require('../images/phf.jpg')}
									/>
								</TouchableOpacity>

								<Text
									style={{ fontWeight: 'bold', fontSize: 22, color: '#fff' }}
								>
									A propos
								</Text>
								<View style={styles.container}>
									<Text style={styles.text}>Fiche Adhérent</Text>
									{/* <Text>{user}</Text> */}
									{userData !== undefined ? (
										<View>
											<Text style={styles.username}>{username}</Text>
											<Text style={styles.adherent}>{name}</Text>
											<Text style={styles.adherent}>{street}</Text>
											<Text style={styles.adherent}>{suite}</Text>
											<Text style={styles.adherent}>{zipcode}</Text>
											<Text style={styles.adherent}>{city}</Text>
										</View>
									) : null}
								</View>
								<GoBack navi={navigation} />
							</View>
						</ScrollView>
					</BackgroundImage>
				</View>
			);
		} else
			return (
				<View>
					<GoBack />
				</View>
			);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center'
	},

	backGroundImage: {
		flex: 1,
		width: null,
		height: null,
		resizeMode: 'cover'
	},
	adherent: {
		fontSize: 18,
		textAlign: 'center'
	},
	username: {
		fontSize: 36,
		color: '#eb2f06',
		textAlign: 'center'
	}
});

import React, { Component } from 'react';
import { View } from 'react-native';

import PhfAccordion from '../../components/Accordion/PhfAccordion';
import HeaderComponent from '../../components/Header';
import OfflineNotice from '../../components/OfflineNotice';
import { BackgroundImage, screen } from '../../config';
import { DECLARATIONS_ACCORDION } from '../../config/accordionSettings';
import Styles from '../../styles';

export default class DeclarationView extends Component {

	constructor(props) {
		super(props);
		this.state = {};
	}

	_callAction = action => {
		switch (action) {
			case '1a':
				this.props.navigation.navigate('DeclarationEntry', { type: 1 });
				break;
			case '1b':
				this.props.navigation.navigate('DeclarationEntry', { type: 2 });
				break;
			case '1c':
				this.props.navigation.navigate('DeclarationEntry', { type: 3 });
				break;
			case '2a':
				this.props.navigation.navigate('DeclarationExit', { type: 1 });
				break;
			case '2b':
				this.props.navigation.navigate('DeclarationExit', { type: 2 });
				break;
			case '2c':
				this.props.navigation.navigate('DeclarationExit', { type: 3 });
				break;
			case '2d':
				this.props.navigation.navigate('DeclarationExit', { type: 4 });
				break;
			case '2e':
				this.props.navigation.navigate('DeclarationExit', { type: 5 });
				break;
			case '3a':
				this.props.navigation.navigate('DeclarationReproductionAct', {
					type: 1,
				});
				break;
			case '3b':
				this.props.navigation.navigate('DeclarationReproductionAct', {
					type: 2,
				});
				break;
			case '3c':
				this.props.navigation.navigate('DeclarationReproductionAct', {
					type: 3,
				});
				break;
			case '3d':
				this.props.navigation.navigate('DeclarationReproductionAct', {
					type: 4,
				});

				break;
			case '4':
				this.props.navigation.navigate(
					'DeclarationPregnancyDiagnostic'
				);
				break;
			default:
				break;
		}
	};

	render() {
		return (
			<BackgroundImage>
				<HeaderComponent {...this.props} title="Déclarations" />
				<View style={{ flex: 1, marginTop: 10 }}>
					<OfflineNotice />
					<PhfAccordion
						sections={DECLARATIONS_ACCORDION}
						callAction={this._callAction}
						headerColor="#346598"
						headerBorderColor="#4C7ABA"
						headerFocusBorderColor="#FF9900"
						buttonBorderColor="#DE7022"
						color="transparent"
						buttonWidth={(2 * screen.width) / 3}
						borderRadius={10}
					/>
				</View>
			</BackgroundImage>
		);
	}
}

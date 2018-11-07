import React, { Component } from 'react';
import { View } from 'react-native';

import HeaderComponent from '../../components/Header';
import OfflineNotice from '../../components/OfflineNotice';
import UnderHeader from '../../components/UnderHeader';
import { BackgroundImage, screen } from '../../config';

export default class DeclarationPregnancyDiagnosticView extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<BackgroundImage>
				<HeaderComponent {...this.props} title="Déclarations" />
				<UnderHeader title="Diagnostic de gestation" />
				<View style={{ flex: 1 }}>
					<OfflineNotice />
				</View>
			</BackgroundImage>
		);
	}
}

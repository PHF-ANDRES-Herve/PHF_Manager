import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text, View } from 'react-native';

import HeaderComponent from '../../components/Header';
import OfflineNotice from '../../components/OfflineNotice';
import UnderHeader from '../../components/UnderHeader';
import { BackgroundImage, screen } from '../../config';

const EXIT_TYPE = {
	1: 'Sortie - Vente Élevage',
	2: 'Sortie - Vente Boucherie',
	3: 'Sortie - Mort',
	4: 'Sortie - Prêt/Pension',
	5: 'Sortie - Autoconsommation',
};

export default class DeclarationExitView extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const { type } = this.props.navigation.state.params;
		return (
			<BackgroundImage>
				<HeaderComponent {...this.props} title="Déclarations" />
				<UnderHeader title={EXIT_TYPE[type]} />
				<View style={{ flex: 1 }}>
					<OfflineNotice />
				</View>
			</BackgroundImage>
		);
	}
}

DeclarationExitView.propTypes = {
	navigation: PropTypes.shape({
		state: PropTypes.shape({
			params: PropTypes.shape({
				type: PropTypes.oneOf([1, 2, 3, 4, 5]),
			}).isRequired,
		}).isRequired,
	}).isRequired,
};

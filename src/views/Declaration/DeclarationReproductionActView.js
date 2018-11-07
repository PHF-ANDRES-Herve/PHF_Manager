import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text, View } from 'react-native';

import HeaderComponent from '../../components/Header';
import OfflineNotice from '../../components/OfflineNotice';
import UnderHeader from '../../components/UnderHeader';
import { BackgroundImage, screen } from '../../config';

const REPRODUCTION_ACT_TYPE = {
	1: 'Reproduction - Saillie naturelle',
	2: 'Reproduction - I.A.',
	3: 'Reproduction - Collecte',
	4: 'Reproduction - Transfert embryonnaire',
};

export default class DeclarationReproductionActView extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const { type } = this.props.navigation.state.params;
		return (
			<BackgroundImage>
				<HeaderComponent {...this.props} title="Déclarations" />
				<UnderHeader title={REPRODUCTION_ACT_TYPE[type]} />
				<View style={{ flex: 1 }}>
					<OfflineNotice />
				</View>
			</BackgroundImage>
		);
	}
}

DeclarationReproductionActView.propTypes = {
	navigation: PropTypes.shape({
		state: PropTypes.shape({
			params: PropTypes.shape({
				type: PropTypes.oneOf([1, 2, 3, 4]),
			}).isRequired,
		}).isRequired,
	}).isRequired,
};

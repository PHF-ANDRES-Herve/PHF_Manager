import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Text, View } from 'react-native';

import HeaderComponent from '../../components/Header';
import OfflineNotice from '../../components/OfflineNotice';
import UnderHeader from '../../components/UnderHeader';
import { BackgroundImage, screen } from '../../config';

const ENTRY_TYPE = {
	1: 'Entrée - Achat',
	2: 'Entrée - Naissance',
	3: 'Entrée - Prêt/Pension',
};
export default class DeclarationEntryView extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const { type } = this.props.navigation.state.params;
		return (
			<BackgroundImage>
				<HeaderComponent {...this.props} title="Déclarations" />
				<UnderHeader title={ENTRY_TYPE[type]} />
				<View style={{ flex: 1 }}>
					<OfflineNotice />
				</View>
			</BackgroundImage>
		);
	}
}

DeclarationEntryView.propTypes = {
	navigation: PropTypes.shape({
		state: PropTypes.shape({
			params: PropTypes.shape({
				type: PropTypes.oneOf([1, 2, 3]),
			}).isRequired,
		}).isRequired,
	}).isRequired,
};

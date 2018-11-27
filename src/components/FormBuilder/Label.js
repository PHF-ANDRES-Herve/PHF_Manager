import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Badge } from 'react-native-elements';

import { Color } from '../../styles/Styles';

export default class Label extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<View style={styles.labelView}>
				<Text style={styles.labelText}>{this.props.label}</Text>
			</View>
		);
	}
}

Label.propTypes = {
	label: PropTypes.string
};

/**
 * Styles
 */
const styles = StyleSheet.create({
	labelView: {
		margin: 5,
		paddingHorizontal: 5,
		borderRadius: 45,
		height: 60,
		backgroundColor: Color.labelColor
	},
	labelText: {
		flex: 1,
		textAlign: 'center',
		textAlignVertical: 'center',
		color: Color.black,
		fontSize: 16
	}
});

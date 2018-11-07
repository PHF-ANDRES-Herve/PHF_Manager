import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default class UnderHeader extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<View style={styles.mainContainer}>
				<View style={styles.container}>
					<Text style={styles.text}>{this.props.title}</Text>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	mainContainer: {
		backgroundColor: '#336191',
		height: 45,
	},
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		fontSize: 22,
		color: '#fff',
		textAlign: 'center',
		textAlignVertical: 'center',
	},
});

UnderHeader.propTypes = {
	title: PropTypes.string.isRequired,
};

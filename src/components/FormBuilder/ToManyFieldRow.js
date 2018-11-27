import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';

import { Color } from '../../styles/Styles';
import { genericStylesForm } from './FormBuilder';

export default class ToManyFieldRow extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		const { deleteRow, row, text, disabled, isValidated, isValid } = this.props;
		return (
			<View style={styles.toManyRow}>
				<View style={styles.toManyRowText}>
					<Text
						onPress={() => this.props.onPress(row)}
						style={
							disabled
								? {
										...styles.visibleTextRowStandard,
										...genericStylesForm.fieldDisabled
								  }
								: isValidated === false && !isValid
								? {
										...styles.visibleTextRowStandard,
										...genericStylesForm.fieldError
								  }
								: isValid !== null
								? isValid
									? {
											...styles.visibleTextRowStandard,
											...genericStylesForm.fieldSuccess
									  }
									: {
											...styles.visibleTextRowStandard,
											...genericStylesForm.fieldError
									  }
								: styles.visibleTextRowStandard
						}
					>
						{text}
					</Text>
				</View>
				<View style={styles.toManyRowIcon}>
					<Icon
						component={TouchableOpacity}
						raised
						type="font-awesome"
						name="trash"
						color={Color.white}
						containerStyle={styles.iconTrash}
						size={18}
						onPress={() => deleteRow(row)}
					/>
				</View>
			</View>
		);
	}
}

ToManyFieldRow.propTypes = {
	row: PropTypes.number.isRequired,
	deleteRow: PropTypes.func.isRequired,
	text: PropTypes.string.isRequired,
	parentName: PropTypes.string.isRequired,
	isValidated: PropTypes.bool,
	disabled: PropTypes.bool,
	isValid: PropTypes.bool,
	onPress: PropTypes.func.isRequired
};

export const styles = StyleSheet.create({
	toManyRow: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	},
	toManyRowText: {
		flex: 7
	},
	toManyRowIcon: {
		flex: 1
	},
	visibleTextRowStandard: {
		borderRadius: 45,
		height: 50,
		backgroundColor: Color.inputBackGroundColor,
		borderWidth: 2,
		borderColor: Color.inputBorderColor,
		textAlign: 'center',
		textAlignVertical: 'center',
		color: Color.white,
		fontSize: 18
	},
	iconTrash: {
		backgroundColor: Color.errorColor
	}
});

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Color } from '../../styles/Styles';

export default class BooleanField extends Component {
	constructor(props) {
		super(props);
		this.state = {
			optionChecked: null
		};
	}

	/**
	 * On set la valeur par défaut dans le field si elle est définit
	 * Ou la value dans le cas d'une édition
	 */
	componentDidMount() {
		if (this.props.value !== undefined) {
			this._booleanValidator(this.props.value);
		} else {
			if (this.props.defaultValue) {
				this._booleanValidator(this.props.defaultValue);
			}
		}
	}

	/**
	 * Fonction qui renvoie le texte à afficher sur les boutons du field
	 */
	_renderBooleanField() {
		const { options } = this.props;
		if (typeof options == 'string') {
			if (options == 'gender') {
				return [{ id: 0, value: 'Mâle' }, { id: 1, value: 'Femelle' }];
			} else if (options == 'boolean') {
				return [{ id: 0, value: 'Non' }, { id: 1, value: 'Oui' }];
			}
		} else {
			return [
				{ id: 0, value: options.option1 },
				{ id: 1, value: options.option2 }
			];
		}
	}

	/**
	 * Fonction qui valide et convertit les valeurs
	 */
	_booleanValidator = id => {
		let { optionChecked } = this.state;
		let value = {
			name: this.props.name
		};
		if (id === 0) {
			if (optionChecked !== 0) {
				optionChecked = 0;
			} else {
				optionChecked = null;
			}
		} else if (id === 1) {
			if (optionChecked !== 1) {
				optionChecked = 1;
			} else {
				optionChecked = null;
			}
		}

		this.setState({ optionChecked }, () => {
			if (this.props.onChange) {
				value.data = optionChecked;
				this.props.onChange(value);
			}
		});
	};
	render() {
		const options = this._renderBooleanField();
		const { name, disabled, value, readOnly } = this.props;
		const { optionChecked } = this.state;
		return (
			<View style={styles.booleanField} name={name}>
				{options.map(option => {
					return readOnly && value !== undefined ? (
						<View
							style={
								value !== option.id
									? disabled
										? {
												...styles.booleanInactive,
												...styles.booleanDisabled
										  }
										: {
												...styles.booleanInactive
										  }
									: disabled
									? {
											...styles.booleanInactive,
											...styles.booleanActive,
											...styles.booleanDisabled
									  }
									: {
											...styles.booleanInactive,
											...styles.booleanActive
									  }
							}
							key={option.id}
						>
							<Text style={styles.booleanText}>{option.value}</Text>
						</View>
					) : (
						<TouchableOpacity
							disabled={disabled}
							style={
								optionChecked === null || optionChecked !== option.id
									? disabled
										? {
												...styles.booleanInactive,
												...styles.booleanDisabled
										  }
										: {
												...styles.booleanInactive
										  }
									: disabled
									? {
											...styles.booleanInactive,
											...styles.booleanActive,
											...styles.booleanDisabled
									  }
									: {
											...styles.booleanInactive,
											...styles.booleanActive
									  }
							}
							onPress={() => this._booleanValidator(option.id)}
							key={option.id}
						>
							<Text style={styles.booleanText}>{option.value}</Text>
						</TouchableOpacity>
					);
				})}
			</View>
		);
	}
}

BooleanField.propTypes = {
	options: PropTypes.oneOfType([
		PropTypes.oneOf(['gender', 'boolean']),
		PropTypes.shape({
			option1: PropTypes.string.isRequired,
			option2: PropTypes.string.isRequired
		})
	]).isRequired,
	readOnly: PropTypes.bool,
	isValidated: PropTypes.bool,
	name: PropTypes.string.isRequired,
	defaultValue: PropTypes.oneOf([0, 1]),
	value: PropTypes.oneOf([0, 1]),
	disabled: PropTypes.bool,
	onChange: PropTypes.func
};

/**
 * Styles
 */
const styles = StyleSheet.create({
	booleanField: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center'
	},
	booleanInactive: {
		flex: 1,
		backgroundColor: Color.mainBackgrounColor,
		padding: 10,
		borderWidth: 3,
		borderColor: Color.headerBorderColor,
		borderRadius: 5,
		height: 50,
		marginHorizontal: 2
	},
	booleanDisabled: {
		opacity: 0.65
	},
	booleanActive: {
		borderColor: Color.buttonBorderColor
	},
	booleanText: {
		fontSize: 16,
		color: Color.white,
		textAlign: 'center'
	}
});

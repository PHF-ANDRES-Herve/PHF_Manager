import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Color } from '../../styles/Styles';
import { genericStylesForm } from './FormBuilder';

export default class NumberField extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isValid: null,
			value: ''
		};
	}

	/**
	 * On set la valeur par défaut dans le field si elle est définit
	 * Ou la value dans le cas d'une édition
	 */
	componentDidMount() {
		if (this.props.value !== undefined) {
			this._numberValidator(this.props.value);
		} else {
			if (this.props.defaultValue) {
				this._numberValidator(this.props.defaultValue);
			}
		}
	}

	/**
	 * Validateur du champs nombre
	 * Application de validators spécifiques au champs nombre si besoin
	 */
	_numberValidator = value => {
		const { decimal, min, max, regexValidator, functionValidator } = this.props;
		let tooHigh = false,
			tooLow = false,
			valueValidated = {
				name: this.props.name,
				message: false
			},
			isValid = true;

		value = value.toString().replace(/\,/, '.');
		//on test si on a bien un nombre
		// si c'est un decimal ou non
		if (decimal) {
			if (/^-?[0-9]+(\.[0-9]+)?$/.test(value)) {
				isValid = true;
				valueValidated.data = value;
			} else {
				isValid = false;
				valueValidated.data = false;
				valueValidated.message = "La valeur saisie n'est pas un nombre valide";
			}
		} else {
			if (/^-?[0-9]+$/.test(value)) {
				isValid = true;
				valueValidated.data = value;
			} else {
				isValid = false;
				valueValidated.data = false;
				valueValidated.message =
					'La valeur saisie doit être un nombre non décimal';
			}
		}

		//on test les min max si nécessaire
		if (isValid && typeof max === 'number' && value > max) {
			isValid = false;
			valueValidated.data = false;
			valueValidated.message = 'Valeur maximale : ' + max;
		}
		if (isValid && typeof min === 'number' && value < min) {
			isValid = false;
			valueValidated.data = false;
			valueValidated.message = 'Valeur minimale : ' + min;
		}

		//on test la props regex si nécessaire
		if (isValid && regexValidator) {
			if (regexValidator.regex.test(value)) {
				isValid = true;
				valueValidated.data = value;
			} else {
				isValid = false;
				valueValidated.data = false;
				if (regexValidator.message) {
					valueValidated.message = regexValidator.message;
				} else {
					valueValidated.message = 'Format spécifique non valide';
				}
			}
		}

		//on test la props fonction de validation si nécessaire
		if (isValid && functionValidator) {
			const customValidator = functionValidator();
			if (
				typeof customValidator === 'object' ||
				typeof customValidator.result !== 'undefined'
			) {
				if (customValidator.result) {
					isValid = true;
					valueValidated.data = value;
				} else {
					isValid = false;
					valueValidated.data = false;
					if (customValidator.message) {
						customValidator.message = customValidator.message;
					} else {
						customValidator.message = 'Format spécifique non valide';
					}
				}
			}
		}
		this.setState({ value, isValid }, () => {
			if (this.props.onChange) {
				this.props.onChange(valueValidated);
			}
		});
	};

	render() {
		const { placeHolder, length, isValidated, disabled } = this.props;
		const { isValid, value } = this.state;
		return (
			<View
				style={
					disabled
						? {
								...genericStylesForm.fieldStandard,
								...genericStylesForm.fieldDisabled
						  }
						: isValidated === false && !isValid
						? {
								...genericStylesForm.fieldStandard,
								...genericStylesForm.fieldError
						  }
						: isValid !== null
						? isValid
							? {
									...genericStylesForm.fieldStandard,
									...genericStylesForm.fieldSuccess
							  }
							: {
									...genericStylesForm.fieldStandard,
									...genericStylesForm.fieldError
							  }
						: genericStylesForm.fieldStandard
				}
			>
				<TextInput
					editable={!disabled}
					placeholder={placeHolder}
					placeholderTextColor={Color.white}
					maxLength={length ? length : 255}
					keyboardType={'number-pad'}
					style={styles.numberText}
					onChangeText={value => this._numberValidator(value)}
					value={value}
				/>
			</View>
		);
	}
}
NumberField.propTypes = {
	name: PropTypes.string.isRequired,
	isValidated: PropTypes.bool,
	require: PropTypes.bool,
	onChange: PropTypes.func,
	defaultValue: PropTypes.number,
	value: function(props, propName, componentName) {
		if (props[propName] && !/^-?[0-9]+(\.[0-9]+)?$/.test(props[propName])) {
			return new Error(
				'Invalid prop `' +
					propName +
					'` supplied to' +
					' `' +
					componentName +
					'`. Validation failed. Format of number is not valid'
			);
		}
	},
	placeHolder: PropTypes.string,
	decimal: PropTypes.bool,
	min: PropTypes.number,
	max: PropTypes.number,
	length: PropTypes.number,
	regexValidator: PropTypes.shape({
		regex: PropTypes.instanceOf(RegExp).isRequired,
		message: PropTypes.string
	}),
	functionValidator: PropTypes.func,
	disabled: PropTypes.bool
};

export const styles = StyleSheet.create({
	numberText: {
		color: Color.white,
		fontSize: 16,
		textAlign: 'center'
	}
});

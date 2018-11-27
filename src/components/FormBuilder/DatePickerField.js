import moment from 'moment';
import { DatePicker } from 'native-base';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Color } from '../../styles/Styles';
import { genericStylesForm } from './FormBuilder';

export default class DatePickerField extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isValid: null
		};
	}

	/**
	 * On set la valeur par défaut dans le field si elle est définit
	 * Ou la value dans le cas d'une édition
	 */
	componentDidMount() {
		if (this.props.value !== undefined) {
			this._datePickerValidator(this.props.value);
		} else {
			if (this.props.defaultValue) {
				this._datePickerValidator(this.props.defaultValue);
			}
		}
	}

	/**
	 * Fonction qui set le statut du field, formatte la date et la renvoie
	 * @param {string} text
	 */
	_datePickerValidator(text) {
		let date,
			valueValidated = {
				name: this.props.name
			},
			isValid = true;

		//on verifie qu'on a bien soit un format de date americain soir français
		if (/^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/.test(text)) {
			date = moment(text);
		} else if (
			/^((0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/([12]\d{3}))$/.test(text)
		) {
			date = moment(text, 'DD/MM/YYYY');
		}
		const { regexValidator, functionValidator } = this.props;

		if (date.isValid()) {
			isValid = true;
			valueValidated.data = date.format('DD/MM/YYYY');
		} else {
			isValid = false;
			valueValidated.data = false;
			valueValidated.message = 'Format de date non valide';
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

		this.setState({ isValid }, () => {
			if (this.props.onChange) {
				this.props.onChange(valueValidated);
			}
		});
	}

	render() {
		const { isValid } = this.state;
		const { isValidated, disabled } = this.props;
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
				<DatePicker
					defaultDate={
						this.props.defaultValue && new Date(this.props.defaultValue)
					}
					minimumDate={
						this.props.minimumDate && new Date(this.props.minimumDate)
					}
					maximumDate={
						this.props.maximumDate && new Date(this.props.maximumtDate)
					}
					locale={'fr'}
					timeZoneOffsetInMinutes={undefined}
					modalTransparent={true}
					animationType={'fade'}
					androidMode={'default'}
					placeHolderText={
						this.props.defaultValue
							? undefined
							: this.props.placeHolder
							? this.props.placeHolder
							: 'Sélectionner une date'
					}
					placeHolderTextStyle={styles.datePickerTextPlaceholder}
					textStyle={styles.datePickerTextSelected}
					onDateChange={text => this._datePickerValidator(text)}
				/>
			</View>
		);
	}
}
DatePickerField.propTypes = {
	value: function(props, propName, componentName) {
		if (
			props[propName] &&
			(!/^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/.test(
				props[propName]
			) &&
				!/^((0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/([12]\d{3}))$/.test(
					props[propName]
				))
		) {
			return new Error(
				'Invalid prop `' +
					propName +
					'` supplied to' +
					' `' +
					componentName +
					'`. Validation failed. Format of date is not valid'
			);
		}
	},
	defaultValue: function(props, propName, componentName) {
		if (
			props[propName] &&
			(!/^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/.test(
				props[propName]
			) &&
				!/^((0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/([12]\d{3}))$/.test(
					props[propName]
				))
		) {
			return new Error(
				'Invalid prop `' +
					propName +
					'` supplied to' +
					' `' +
					componentName +
					'`. Validation failed. Format of date is not valid'
			);
		}
	},
	minimumDate: function(props, propName, componentName) {
		if (
			props[propName] &&
			(!/^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/.test(
				props[propName]
			) &&
				!/^((0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/([12]\d{3}))$/.test(
					props[propName]
				))
		) {
			return new Error(
				'Invalid prop `' +
					propName +
					'` supplied to' +
					' `' +
					componentName +
					'`. Validation failed. Format of date is not valid'
			);
		}
	},
	maximumDate: function(props, propName, componentName) {
		if (
			props[propName] &&
			(!/^([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))$/.test(
				props[propName]
			) &&
				!/^((0[1-9]|[12]\d|3[01])\/(0[1-9]|1[0-2])\/([12]\d{3}))$/.test(
					props[propName]
				))
		) {
			return new Error(
				'Invalid prop `' +
					propName +
					'` supplied to' +
					' `' +
					componentName +
					'`. Validation failed. Format of date is not valid'
			);
		}
	},
	placeHolder: PropTypes.string,
	name: PropTypes.string,
	isValidated: PropTypes.bool,
	onChange: PropTypes.func,
	disabled: PropTypes.bool,
	require: PropTypes.bool
};

/**
 * Styles
 */
const styles = StyleSheet.create({
	datePickerTextPlaceholder: {
		color: Color.white,
		fontSize: 16,
		textAlign: 'center'
	},
	datePickerTextSelected: {
		color: Color.white,
		fontSize: 16
	}
});

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Picker, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';

import { Color } from '../../styles/Styles';
import BooleanField from './BooleanField';
import DatePickerField from './DatePickerField';
import Label from './Label';
import ListeDetailledField from './ListDetailledField';
import NumberField from './NumberField';
import SelectField from './SelectField';
import TextField, { styles } from './TextField';
import ToManyField from './ToManyField';

export default class FormBuilder extends Component {
	constructor(props) {
		super(props);
		this.state = {
			values: {},
			messages: {},
			isValidated: {},
			isValid: true,
			step: null,
			formWithStep: false
		};
		this._validatorPattern();
	}

	/**
	 * Fonction de validation de la structure du pattern dans le cas d'un formulaire à étapes
	 */
	_validatorPattern() {
		const { pattern } = this.props;
		let stepCheck = 1;
		let testEmptyGroup = [];
		if (pattern.groupTitles !== undefined) {
			//on verifie la cohérence entre les groupes définis et les groupes attribués aux fields
			if (pattern.fields !== undefined) {
				pattern.fields.map(field => {
					if (!field.hasOwnProperty('group')) {
						console.error(
							'Le champs ' +
								field.name +
								' doit posséder un groupe car un formulaire par étapes est requis'
						);
					} else {
						let test = pattern.groupTitles.filter(group => {
							return group.step === field.group;
						});
						if (test.length < 1) {
							console.error(
								'Le champs ' +
									field.name +
									' a été définit avec un groupe non référencé'
							);
						}
					}
				});
				//on verifie que les étapes du formulaires se suivent bien numériquement
				pattern.groupTitles.map(item => {
					if (item.step !== stepCheck) {
						console.error(
							'Les étapes définies doivent être des entiers qui se suivent et donc la première valeur est 1'
						);
					}
					stepCheck++;
					testEmptyGroup = pattern.fields.filter(field => {
						return field.group === item.step;
					});
					if (!testEmptyGroup || testEmptyGroup.length < 1) {
						console.error(
							'Le groupe ' +
								item.name +
								' doit obligatoirement contenir un champs au minimum'
						);
					}
				});
			} else {
				console.error(
					'La propriété fields dans la props pattern est obligatoire'
				);
			}
		}
	}

	componentDidMount() {
		let { values } = this.state;
		const { pattern, type, data } = this.props;
		let step = null,
			formWithStep = false;

		if (pattern.groupTitles !== undefined && pattern.groupTitles.length >= 1) {
			step = 1;
			formWithStep = true;
		}

		pattern.fields.map(field => {
			values[field.name] = '';
		});

		if (type === 'edit' && data.id !== 0) {
			values['id'] = data.id;
		}
		if (type === 'create') {
			values['id'] = 0;
		}

		this.setState({ values, step, formWithStep });
	}

	/**
	 * Fonction qui va validé le formulaire avant d'exécuter la fonction callback
	 */
	_checkIfFormIsValid = () => {
		const { values, isValidated, formWithStep } = this.state;
		let { step, messages } = this.state;
		const { pattern, navigation, callback } = this.props;
		let isValid = true;
		if (formWithStep) {
			let group = pattern.groupTitles.filter(group => {
				return group.step === step;
			});
			if (group && group.length > 0) {
				const valuesToCheckForGroup = pattern.fields.filter(item => {
					return item.group === step;
				});
				valuesToCheckForGroup.map(item => {
					if (values[item.name] === false) {
						isValidated[item.name] = false;
						isValid = false;
					} else {
						if (
							item.hasOwnProperty('require') &&
							(values[item.name] === '' ||
								values[item.name] === null ||
								(Array.isArray(values[item.name]) &&
									values[item.name].length === 0))
						) {
							isValidated[item.name] = false;
							messages[item.name] = 'Ce champs est requis';
							isValid = false;
						} else {
							isValidated[item.name] = true;
							delete messages[item.name];
						}
					}
				});
			} else {
				console.warn("L'étape " + step + "n'appartient à ce formulaire");
			}
		} else {
			pattern.fields.map(field => {
				if (values[field.name] === false) {
					isValidated[field.name] = false;
					isValid = false;
				} else {
					if (
						field.hasOwnProperty('require') &&
						(values[field.name] === '' ||
							values[field.name] === null ||
							(Array.isArray(values[field.name]) &&
								values[field.name].length === 0))
					) {
						isValidated[field.name] = false;
						messages[field.name] = 'Ce champs est requis';
						isValid = false;
					} else {
						isValidated[field.name] = true;
						delete messages[field.name];
					}
				}
			});
		}
		if (isValid) {
			if (formWithStep) {
				let newStep = step + 1;
				let nextGroup = pattern.groupTitles.filter(group => {
					return group.step === newStep;
				});

				if (!nextGroup || nextGroup.length === 0) {
					this.setState({ isValidated, messages }, () => {
						callback(values, navigation);
					});
					return;
				} else {
					step = newStep;
				}
			} else {
				this.setState({ isValidated, messages }, () => {
					callback(values, navigation);
					return;
				});
			}
		}
		this.setState({ isValidated, messages, step });
	};

	/**
	 * Fonction qui stocke la valeurs des fields lors de leur modification
	 * Peut renvoyer des messages d'erreurs si nécessaire
	 * Function flêchée pour bind le this
	 */
	_getFieldValue = value => {
		let { values, messages, formWithStep, step } = this.state;
		const { pattern } = this.props;
		if (formWithStep) {
			let group = pattern.groupTitles.filter(group => {
				return group.step === step;
			});
			if (!group || group.length === 0) {
				console.warn("L'étape " + step + "n'appartient à ce formulaire");
			} else {
				if (values[value.name] !== undefined) {
					values[value.name] = value.data;
				} else {
					console.warn(
						'Le champs ' + value.name + " n'est pas référencé dans cette étape"
					);
				}
			}
		} else {
			values[value.name] = value.data;
		}
		if (value.message) {
			messages[value.name] = value.message;
		} else {
			messages[value.name] = false;
		}
		this.setState({ values, messages });
	};

	/**
	 * Fonction chargée de retourner le bon composant avec les bonne props en fonction de la définition du field
	 * @param {object} field
	 */
	_displayField(field) {
		const { values, isValidated, messages } = this.state;
		const { data } = this.props;
		switch (field.type) {
			case 'text':
				return (
					<TextField
						disabled={field.disabled}
						isValidated={isValidated[field.name]}
						name={field.name}
						placeHolder={field.label ? field.label : undefined}
						require={field.require ? true : false}
						defaultValue={field.defaultValue ? field.defaultValue : undefined}
						regexValidator={
							field.regexValidator ? field.regexValidator : undefined
						}
						length={typeof field.min === 'number' ? field.min : undefined}
						onChange={this._getFieldValue}
						value={
							data && data[field.name] !== undefined
								? data[field.name]
								: undefined
						}
						functionValidator={
							field.functionValidator ? field.functionValidator : undefined
						}
					/>
				);
				break;
			case 'number':
				return (
					<NumberField
						disabled={field.disabled}
						isValidated={isValidated[field.name]}
						name={field.name}
						placeHolder={field.label ? field.label : undefined}
						require={field.require ? true : false}
						decimal={field.require ? true : false}
						defaultValue={field.defaultValue ? field.defaultValue : undefined}
						min={typeof field.min === 'number' ? field.min : undefined}
						max={typeof field.max === 'number' ? field.max : undefined}
						regexValidator={
							field.regexValidator ? field.regexValidator : undefined
						}
						length={typeof field.length === 'number' ? field.length : undefined}
						onChange={this._getFieldValue}
						functionValidator={
							field.functionValidator ? field.functionValidator : undefined
						}
						value={
							data && data[field.name] !== undefined
								? data[field.name]
								: undefined
						}
					/>
				);
				break;
			case 'date':
				return (
					<DatePickerField
						disabled={field.disabled}
						isValidated={isValidated[field.name]}
						name={field.name}
						placeHolder={field.label ? field.label : false}
						require={field.require ? true : false}
						defaultValue={field.defaultValue ? field.defaultValue : undefined}
						minimumDate={field.minimumDate ? field.minimumDate : undefined}
						maximumDate={field.maximumDate ? field.maximumDate : undefined}
						onChange={this._getFieldValue}
						value={
							data && data[field.name] !== undefined
								? data[field.name]
								: undefined
						}
					/>
				);
				break;
			case 'boolean':
				return (
					<BooleanField
						disabled={field.disabled}
						isValidated={isValidated[field.name]}
						name={field.name}
						options={field.options}
						defaultValue={field.defaultValue ? field.defaultValue : undefined}
						onChange={this._getFieldValue}
						value={
							data && data[field.name] !== undefined
								? data[field.name]
								: undefined
						}
					/>
				);
				break;
			case 'select':
				return (
					<SelectField
						disabled={field.disabled}
						isValidated={isValidated[field.name]}
						options={field.options}
						name={field.name}
						defaultValue={field.defaultValue ? field.defaultValue : undefined}
						onChange={this._getFieldValue}
						require={field.require ? true : false}
						value={
							data && data[field.name] !== undefined
								? data[field.name]
								: undefined
						}
					/>
				);
				break;
			case 'listDetailled':
				return (
					<ListeDetailledField
						label={field.label ? field.label : undefined}
						disabled={field.disabled}
						isValidated={isValidated[field.name]}
						detailsTooDisplay={field.detailsTooDisplay}
						textToDisplay={field.textToDisplay}
						placeHolder={field.label ? field.label : false}
						name={field.name}
						defaultValue={field.defaultValue ? field.defaultValue : undefined}
						onChange={this._getFieldValue}
						require={field.require ? true : false}
						message={messages[field.name] ? messages[field.name] : undefined}
						firstColumn={
							field.firstColumn !== undefined ? field.firstColumn : undefined
						}
						labelColumns={
							field.labelColumns !== undefined ? field.labelColumns : undefined
						}
						datasList={
							field.datasList !== undefined ? field.datasList : undefined
						}
						value={
							data && data[field.name] !== undefined
								? data[field.name]
								: undefined
						}
					/>
				);
				break;
			case 'toMany':
				return (
					<ToManyField
						disabled={field.disabled}
						isValidated={isValidated[field.name]}
						name={field.name}
						onChange={this._getFieldValue}
						require={field.require ? true : false}
						message={messages[field.name] ? messages[field.name] : undefined}
						value={
							data && data[field.name] !== undefined
								? data[field.name]
								: undefined
						}
						label={field.label !== undefined ? field.label : undefined}
						formModal={
							field.formModal !== undefined ? field.formModal : undefined
						}
						navigation={this.props.navigation}
						fieldToDisplay={
							field.fieldToDisplay !== undefined
								? field.fieldToDisplay
								: undefined
						}
						functionFieldToDisplay={
							field.functionFieldToDisplay !== undefined
								? field.functionFieldToDisplay
								: undefined
						}
					/>
				);
				break;
			default:
				return <Text>Erreur</Text>;
				break;
		}
	}

	render() {
		const { pattern } = this.props;
		const { messages, isValid, step, formWithStep } = this.state;
		let groupTitle = [];
		if (formWithStep) {
			groupTitle = pattern.groupTitles.filter(group => {
				return step === group.step;
			});
		}
		return (
			<View style={{ flex: 1 }}>
				{formWithStep &&
					groupTitle !== undefined &&
					groupTitle.length === 1 &&
					groupTitle[0].name !== undefined &&
					groupTitle[0].name !== '' && (
						<Text style={genericStylesForm.under_title}>
							{groupTitle[0].name.toUpperCase()}
						</Text>
					)}
				<ScrollView>
					{formWithStep
						? pattern.fields.map(field => {
								return (
									field.group === step &&
									(field.type === 'listDetailled' ? (
										<View key={field.name} style={genericStylesForm.rowField}>
											{this._displayField(field)}
										</View>
									) : field.type === 'toMany' ? (
										<View key={field.name} style={genericStylesForm.toManyBloc}>
											{this._displayField(field)}
										</View>
									) : (
										<View key={field.name} style={genericStylesForm.rowField}>
											<View style={genericStylesForm.labelBloc}>
												{field.label && <Label label={field.label} />}
											</View>
											<View style={genericStylesForm.fieldBloc}>
												{this._displayField(field)}
												{messages[field.name] && (
													<Text style={genericStylesForm.errorText}>
														{messages[field.name]}
													</Text>
												)}
											</View>
										</View>
									))
								);
						  })
						: pattern.fields.map(field => {
								return field.type === 'listDetailled' ? (
									<View key={field.name} style={genericStylesForm.rowField}>
										{this._displayField(field)}
									</View>
								) : field.type === 'toMany' ? (
									<View key={field.name}>{this._displayField(field)}</View>
								) : (
									<View key={field.name} style={genericStylesForm.rowField}>
										<View style={genericStylesForm.labelBloc}>
											{field.label && <Label label={field.label} />}
										</View>
										<View style={genericStylesForm.fieldBloc}>
											{this._displayField(field)}
											{messages[field.name] && (
												<Text style={genericStylesForm.errorText}>
													{messages[field.name]}
												</Text>
											)}
										</View>
									</View>
								);
						  })}
				</ScrollView>
				<Icon
					component={TouchableOpacity}
					raised
					type="font-awesome"
					name="check"
					color={Color.white}
					containerStyle={
						isValid
							? genericStylesForm.buttonForm
							: {
									...genericStylesForm.buttonForm,
									...genericStylesForm.disabledButtonForm
							  }
					}
					disabled={!isValid}
					onPress={this._checkIfFormIsValid}
				/>
			</View>
		);
	}
}

FormBuilder.propTypes = {
	type: PropTypes.oneOf(['create', 'edit']).isRequired,
	callback: PropTypes.func.isRequired,
	navigation: PropTypes.object.isRequired,
	pattern: PropTypes.shape({
		groupTitles: PropTypes.arrayOf(
			PropTypes.shape({
				name: PropTypes.string.isRequired,
				step: PropTypes.number.isRequired,
				require: PropTypes.bool.isRequired
			})
		),
		fields: PropTypes.arrayOf(
			function(propValue, key, componentName, location, propFullName) {
				const testUniqueValue = propValue.filter(field => {
					return propValue[key].name === field.name;
				});
				if (testUniqueValue.length > 1) {
					console.error(
						'La propriété name ' +
							propValue[key].name +
							' est utilisée plusieurs fois'
					);
				}
			},
			PropTypes.shape({
				type: PropTypes.oneOf([
					'text',
					'number',
					'date',
					'longText',
					'boolean',
					'select',
					'listDetailled',
					'toMany'
				]).isRequired,
				name: PropTypes.string.isRequired,
				label: PropTypes.string,
				length: PropTypes.number,
				min: PropTypes.number,
				max: PropTypes.number,
				high_rank: PropTypes.bool,
				require: PropTypes.bool,
				decimal: PropTypes.bool,
				regexValidator: PropTypes.shape({
					regex: PropTypes.instanceOf(RegExp).isRequired,
					message: PropTypes.string
				}),
				functionValidator: PropTypes.func,
				disabled: PropTypes.bool,
				group: PropTypes.number,
				textToDisplay: PropTypes.string,
				datasList: PropTypes.arrayOf(
					PropTypes.shape({
						id: PropTypes.number.isRequired
					})
				),
				firstColumn: PropTypes.string,
				labelColumns: PropTypes.objectOf(
					PropTypes.oneOfType([PropTypes.string, PropTypes.number])
				),
				detailsTooDisplay: PropTypes.arrayOf(
					PropTypes.shape({
						name: PropTypes.string.isRequired,
						type: PropTypes.oneOf(['text', 'boolean']),
						options: PropTypes.string,
						label: PropTypes.string
					})
				)
			})
		).isRequired
	}).isRequired,
	data: function(props, propName, componentName) {
		if (props.type !== undefined && props.type === 'edit') {
			let missingData = [];
			if (
				props[propName] === undefined ||
				props[propName].id === undefined ||
				typeof props[propName].id !== 'number' ||
				!Number.isInteger(props[propName].id) ||
				props[propName].id < 1
			) {
				console.error(
					'Le champs id est obligatoire et doit être un entier supérieur à 0'
				);
			}
			props.pattern.fields.map(field => {
				if (
					props[propName] === undefined ||
					(field.require && props[propName][field.name] === undefined)
				) {
					missingData.push(field.name);
				}
			});
			if (missingData.length > 0) {
				console.warn(
					"Les champs suivant sont obligatoires et aucune donnée n'a été chargée : " +
						missingData.join(', ')
				);
			}
		}
	}
};

export const genericStylesForm = StyleSheet.create({
	fieldStandard: {
		borderRadius: 45,
		height: 60,
		backgroundColor: Color.inputBackGroundColor,
		borderWidth: 2,
		borderColor: Color.inputBorderColor,
		justifyContent: 'center',
		alignItems: 'center',
		flex: 3
	},
	fieldDisabled: {
		backgroundColor: Color.headerColor,
		opacity: 0.65
	},
	fieldSuccess: {
		borderColor: Color.validColor
	},
	fieldError: {
		borderColor: Color.errorColor
	},
	rowField: { flex: 1, flexDirection: 'row', marginVertical: 10 },
	labelBloc: { flex: 2 },
	fieldBloc: { flex: 4, margin: 5 },
	actionBloc: { flex: 1, alignItems: 'center', justifyContent: 'center' },
	errorText: { fontSize: 16, color: Color.errorColor, textAlign: 'center' },
	buttonForm: {
		marginHorizontal: 30,
		marginVertical: 10,
		alignSelf: 'flex-end',
		backgroundColor: Color.validColor
	},
	disabledButtonForm: { opacity: 0.5 },
	under_title: {
		textAlign: 'center',
		textAlignVertical: 'center',
		backgroundColor: Color.headerFocusBorderColor,
		color: Color.black,
		fontSize: 18,
		borderColor: Color.underTitleBorderColor,
		borderWidth: 2,
		paddingVertical: 5
	}
});

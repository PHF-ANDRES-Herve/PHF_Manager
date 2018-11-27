import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';

import { loginCards } from '../../config/constantes';
import { Color } from '../../styles/Styles';
import BooleanField from './BooleanField';
import { genericStylesForm } from './FormBuilder';
import Label from './Label';
import ListDetailledFieldModal from './ListDetailledFieldModal';
import TextField from './TextField';

export default class ListeDetailledField extends Component {
	constructor(props) {
		super(props);
		this.state = {
			valueToDisplay: null,
			isValid: null,
			modalVisible: false,
			cleanedDatas: []
		};
	}

	/**
	 * On set la valeur par défaut dans le field si elle est définit
	 * Ou la value dans le cas d'une édition
	 * Clean des datas du fait de l'utilisation de NAME dans le composant PHFList
	 * Et pour gérer les colonnes à afficher avec leur label
	 */
	componentDidMount() {
		let { datasList, firstColumn, labelColumns } = this.props;
		let cleanedDatas = [],
			tmp = {};
		if (datasList !== undefined && datasList.length > 1) {
			if (firstColumn !== undefined) {
				datasList.map(data => {
					if (data[firstColumn] !== undefined) {
						tmp = {};
						for (const key in data) {
							if (labelColumns[key] !== undefined && labelColumns[key] !== '') {
								if (key === firstColumn) {
									tmp.NAME = data[key];
								} else {
									tmp[key] = data[key];
								}
							} else if (key === 'id') {
								tmp[key] = data[key];
							}
						}
						cleanedDatas.push(tmp);
					} else {
						console.error(
							'Clé ' + firstColumn + ' inéxistante dans un des objets de datas'
						);
					}
				});
			} else {
				console.error(
					"La props firstColumn est obligatoire pour l'exécution de ce composant"
				);
			}
		} else {
			console.error(
				"La props datasList est obligatoire pour l'exécution de ce composant"
			);
		}
		this.setState({ cleanedDatas }, () => {
			if (this.props.value !== undefined) {
				this._listDetailledValidator(this.props.value);
			} else {
				if (this.props.defaultValue) {
					this._listDetailledValidator(this.props.defaultValue);
				}
			}
		});
	}

	/**
	 * Toggle la modal et réinitialise la vue
	 * @param {boolean} visible
	 */
	_setModalVisible(visible) {
		this.setState({
			modalVisible: visible
		});
	}

	_listDetailledValidator = result => {
		const { detailsTooDisplay, name, textToDisplay, datasList } = this.props;
		let value = {
				name: this.props.name
			},
			isValid = true,
			valueToDisplay = null,
			cleanResult = {},
			missingKey = false;
		if (!result) {
			value.data = false;
			value.message = 'Valeur sélectionnée non valide';
			isValid = false;
			valueToDisplay = 'Erreur sur la sélection';
		} else {
			cleanResult = datasList.filter(data => {
				return result === data.id;
			});
			cleanResult = cleanResult[0];

			if (cleanResult.hasOwnProperty(textToDisplay)) {
				value.data = cleanResult.id;
				isValid = true;

				valueToDisplay = {};
				valueToDisplay[name] = cleanResult[textToDisplay].toString();
				detailsTooDisplay.map(detail => {
					if (cleanResult.hasOwnProperty(detail.name)) {
						if (detail.type === 'boolean') {
							valueToDisplay[detail.name] = cleanResult[detail.name] ? 1 : 0;
						} else {
							valueToDisplay[detail.name] = cleanResult[detail.name].toString();
						}
					} else {
						valueToDisplay[detail.name] = '-';
						console.warn(
							'La clé secondaire ' +
								detail.name +
								" n'est pas présente dans le résultat"
						);
					}
				});
			} else {
				value.data = false;
				value.message =
					"La clé principale de la valeur sélectionnée n'existe pas";
				isValid = false;
				valueToDisplay = 'Erreur sur la sélection';
			}

			this.setState(
				{
					isValid,
					modalVisible: false,
					valueToDisplay
				},
				() => {
					if (this.props.onChange) {
						this.props.onChange(value);
					}
				}
			);
		}
	};

	render() {
		const {
			placeHolder,
			disabled,
			isValidated,
			detailsTooDisplay,
			label,
			name,
			message,
			labelColumns,
			firstColumn
		} = this.props;
		const { valueToDisplay, isValid, cleanedDatas } = this.state;

		return cleanedDatas.length >= 1 ? (
			<View style={{ flex: 1 }}>
				<Modal
					animationType="slide"
					transparent={false}
					visible={this.state.modalVisible}
					onRequestClose={() => {
						this._setModalVisible(!this.state.modalVisible);
					}}
				>
					<ListDetailledFieldModal
						datasList={cleanedDatas}
						labelColumns={labelColumns}
						firstColumn={firstColumn}
						onSelect={item => {
							this._listDetailledValidator(item);
						}}
					/>
				</Modal>
				<View style={genericStylesForm.rowField}>
					<View style={genericStylesForm.labelBloc}>
						{label && <Label label={label} />}
					</View>
					<View style={genericStylesForm.fieldBloc}>
						<View
							disabled={disabled}
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
								name={name}
								editable={false}
								style={styles.fieldText}
								value={
									valueToDisplay === null
										? placeHolder
											? placeHolder
											: label
											? label
											: undefined
										: typeof valueToDisplay === 'string'
										? valueToDisplay
										: valueToDisplay[name]
								}
							/>
						</View>
						{message && (
							<Text style={genericStylesForm.errorText}>{message}</Text>
						)}
					</View>
					<View style={genericStylesForm.actionBloc}>
						<Icon
							component={TouchableOpacity}
							raised
							name="hand-o-up"
							type="font-awesome"
							color="#fff"
							containerStyle={styles.buttonModal}
							onPress={() => {
								this._setModalVisible(true);
							}}
						/>
					</View>
				</View>
				<View>
					{detailsTooDisplay &&
						detailsTooDisplay.map((detail, index) => {
							return (
								<View key={detail.name} style={genericStylesForm.rowField}>
									<View style={genericStylesForm.labelBloc}>
										{detail.label && <Label label={detail.label} />}
									</View>
									<View style={genericStylesForm.fieldBloc}>
										{detail.type === 'text' ? (
											<TextField
												key={index.toString()}
												disabled={true}
												name={detail.name}
												placeHolder={
													valueToDisplay === null
														? detail.label
															? detail.label
															: undefined
														: typeof valueToDisplay === 'string'
														? '-'
														: valueToDisplay[detail.name]
												}
											/>
										) : (
											<BooleanField
												key={index.toString()}
												disabled={true}
												name={detail.name}
												options={detail.options}
												value={
													valueToDisplay === null
														? undefined
														: valueToDisplay[detail.name] !== undefined
														? valueToDisplay[detail.name]
														: undefined
												}
												readOnly={true}
											/>
										)}
									</View>
									<View style={genericStylesForm.actionBloc} />
								</View>
							);
						})}
				</View>
			</View>
		) : (
			<View style={{ flex: 1, alignItems: 'center' }}>
				<ActivityIndicator size="large" color={Color.buttonBorderColor} />
			</View>
		);
	}
}

ListeDetailledField.propTypes = {
	name: PropTypes.string.isRequired,
	defaultValue: PropTypes.number,
	placeHolder: PropTypes.string,
	datasList: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number.isRequired
		})
	).isRequired,
	firstColumn: PropTypes.string.isRequired,
	labelColumns: PropTypes.objectOf(
		PropTypes.oneOfType([PropTypes.string, PropTypes.number])
	).isRequired,
	label: PropTypes.string,
	disabled: PropTypes.bool,
	isValidated: PropTypes.bool,
	require: PropTypes.bool,
	value: PropTypes.number,
	message: PropTypes.string,
	onChange: PropTypes.func,
	textToDisplay: PropTypes.string.isRequired,
	detailsTooDisplay: PropTypes.arrayOf(
		PropTypes.shape({
			name: PropTypes.string.isRequired,
			label: PropTypes.string,
			type: PropTypes.oneOf(['text', 'boolean']),
			options: function(props, propName, componentName) {
				if (props.type === 'boolean') {
					if (props.options === undefined) {
						return new Error('Props options is missing');
					} else {
						if (typeof props.options === 'string') {
							if (props.options !== 'gender' && props.options !== 'boolean') {
								return new Error(
									'The string value for props options is only boolean or gender'
								);
							}
						} else if (typeof props.options === 'object') {
							if (
								props.options.option1 === undefined ||
								props.options.option2 === undefined
							) {
								return new Error(
									'Props options description is not valid. The object must have the keys option1 and option2'
								);
							}

							if (
								typeof props.options.option1 !== 'string' ||
								typeof props.options.option2 !== 'string'
							) {
								return new Error(
									'Props options description is not valid. The value of the twice options must be a string'
								);
							}
						} else {
							return new Error('Props options format is not valid');
						}
					}
				}
			}
		})
	)
};

/**
 * Styles
 */
const styles = StyleSheet.create({
	fieldText: {
		color: Color.white,
		fontSize: 16
	},
	buttonModal: {
		backgroundColor: Color.buttonBorderColor
	}
});

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Animated, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button, Icon } from 'react-native-elements';

import { BackgroundImage } from '../../config';
import { Color } from '../../styles/Styles';
import FormBuilder, { genericStylesForm } from './FormBuilder';
import ToManyFieldRow from './ToManyFieldRow';

export default class ToManyField extends Component {
	constructor(props) {
		super(props);
		this.state = {
			rowsArray: [],
			disabledButton: false,
			modalVisible: false,
			isValid: null,
			values: [],
			dataFormModal: undefined
		};
		this.index = 0;
		this.animatedRow = new Animated.Value(0);
	}

	/**
	 * On set la valeur par défaut dans le field si elle est définit
	 * Ou la value dans le cas d'une édition
	 */
	componentDidMount() {
		if (this.props.value !== undefined) {
			this._toManyValidator(this.props.value);
		} else {
			if (this.props.defaultValue) {
				this._toManyValidator(this.props.defaultValue);
			}
		}
	}

	/**
	 * Gestion de la suppression d'une ligne d'un toMany
	 * Gestation dans le states de l'index et des values
	 * Possibilité d'intégrer par la suite la suppression en base de données
	 */
	_deleteRow = id => {
		let rowsArray = [];
		const { name } = this.props;
		let values = [],
			valuesToDelete = null,
			isValid = null;
		//On recrée un nouveau nouveau en retirant celui qui doit être supprimé
		this.state.rowsArray.map(row => {
			if (row.index !== id) {
				rowsArray.push(row);
			}
		});

		//idem pour les values
		this.state.values.map(value => {
			if (id === value.indexToMany) {
				if (
					value.id !== undefined &&
					typeof value.id === 'number' &&
					value.id > 0
				) {
					valuesToDelete = value;
				}
			} else {
				values.push(value);
			}
		});

		if (values.length > 0) {
			isValid = true;
		}

		if (valuesToDelete !== null) {
			/*********************************************************/
			/* gérer la suppression en base de données si nécessaire */
			/*********************************************************/
		}

		this.setState({ rowsArray, isValid, values }, () => {
			if (this.props.onChange) {
				this.props.onChange({ name: name, data: values });
			}
		});
	};

	/**
	 * Fonction event sur le onPress du bouton add Row ou sur le onPress d'une ligne du toMany
	 * @param {integer} item
	 */
	_manageToManyRow = item => {
		let dataFormModal = undefined;

		if (typeof item === 'number') {
			let rowSlected = this.state.values.filter(rowValues => {
				return item === rowValues.indexToMany;
			});

			if (rowSlected.length !== 1) {
				if (rowSlected.length === 0) {
					console.warn('La ligne sélectionnée ne correspond a aucune donnée');
				} else {
					console.warn(
						'La ligne sélectionnée ne correspond a plusieurs jeux de données'
					);
				}
			} else {
				dataFormModal = rowSlected[0];
			}
		}

		this.setState({
			modalVisible: true,
			dataFormModal
		});
	};

	/**
	 * Fonction render dynamique des ligne du toMany avec ou sans animation
	 */
	_returnToManyRows = () => {
		const { rowsArray, isValid } = this.state;
		const { label, disabled, isValidated } = this.props;
		const animationValue = this.animatedRow.interpolate({
			inputRange: [0, 1],
			outputRange: [-59, 0]
		});
		return rowsArray.map((item, key) => {
			if (key == this.index) {
				return (
					<Animated.View
						key={key}
						style={[
							{
								opacity: this.animatedRow,
								transform: [{ translateY: animationValue }]
							}
						]}
					>
						<ToManyFieldRow
							key={key}
							row={item.index}
							deleteRow={this._deleteRow}
							text={item.valueToDisplay}
							parentName={label}
							isValidated={isValidated}
							disabled={disabled}
							isValid={isValid}
							onPress={this._manageToManyRow}
						/>
					</Animated.View>
				);
			} else {
				return (
					<ToManyFieldRow
						key={key}
						row={item.index}
						deleteRow={this._deleteRow}
						text={item.valueToDisplay}
						parentName={label}
						isValidated={isValidated}
						disabled={disabled}
						isValid={isValid}
						onPress={this._manageToManyRow}
					/>
				);
			}
		});
	};

	/**
	 * Factorisation de la partie gérant la donnée à afficher sur le toManyFieldRow
	 * @param {object} data
	 * @param {integer} index
	 */
	_returnNewAddedRowData(data, index) {
		const { functionFieldToDisplay, fieldToDisplay } = this.props;
		let newAddedRow = { index: index, valueToDisplay: null };

		if (functionFieldToDisplay !== undefined) {
			let tmpValue = functionFieldToDisplay(data);
			if (typeof tmpValue !== 'string') {
				console.warn(
					'La fonction functionFieldToDisplay passée en props, doit obligatoirement retourner une string'
				);
			} else {
				newAddedRow.valueToDisplay = tmpValue;
			}
		}
		if (newAddedRow.valueToDisplay === null && fieldToDisplay !== undefined) {
			if (data[fieldToDisplay] === undefined) {
				console.warn(
					'La props fieldToDisplay correspond à un champs non retourné'
				);
			} else {
				newAddedRow.valueToDisplay = data[fieldToDisplay];
			}
		}
		if (newAddedRow.valueToDisplay === null) {
			newAddedRow.valueToDisplay = Object.values(data)
				.join(' - ')
				.substring(0, 26);
		}

		return newAddedRow;
	}

	/**
	 * Validateur du champs toMany
	 * Gestion spécifique de modifications des lignes du toMany
	 * Gestion spécifique dans le cas ou on doit précharger des valeurs
	 */
	_toManyValidator = data => {
		const { name } = this.props;
		const { dataFormModal } = this.state;
		let values = [],
			isValid = true,
			index = this.index,
			newAddedRow = [...this.state.rowsArray],
			tmpValues = [];
		this.animatedRow.setValue(0);

		values = [...this.state.values];
		if (Array.isArray(data)) {
			data.map(row => {
				newAddedRow.push(this._returnNewAddedRowData(row, index));
				row.indexToMany = index;
				values.push(row);
				index++;
			});
		} else {
			if (dataFormModal !== undefined) {
				const addedRowsUpdated = newAddedRow.map(row => {
					if (dataFormModal.indexToMany === row.index) {
						return this._returnNewAddedRowData(data, dataFormModal.indexToMany);
					} else {
						return row;
					}
				});
				newAddedRow = [...addedRowsUpdated];

				data.indexToMany = dataFormModal.indexToMany;

				const valuesUpdated = values.map(value => {
					if (dataFormModal.indexToMany === value.indexToMany) {
						return data;
					} else {
						return value;
					}
				});
				values = [...valuesUpdated];
			} else {
				data.indexToMany = index;
				newAddedRow.push(this._returnNewAddedRowData(data, index));
				dataFormModal;
				values.push(data);
				index++;
			}
		}

		this.setState(
			{
				disabledButton: true,
				rowsArray: [...newAddedRow],
				modalVisible: false,
				values,
				isValid,
				dataFormModal: undefined
			},
			() => {
				if (this.props.onChange) {
					this.props.onChange({ name, data: values });
				}
				if (Array.isArray(data)) {
					this.index = index;
					this.setState({ disabledButton: false });
				} else {
					Animated.timing(this.animatedRow, {
						toValue: 1,
						duration: 500,
						useNativeDriver: true
					}).start(() => {
						this.index = index;
						this.setState({ disabledButton: false });
					});
				}
			}
		);
	};

	/**
	 * Toggle la modal et réinitialise la vue
	 * @param {boolean} visible
	 */
	_setModalVisible(visible) {
		this.setState({
			modalVisible: visible
		});
	}

	render() {
		const {
			name,
			label,
			formModal,
			disabled,
			message,
			isValidated
		} = this.props;
		const {
			modalVisible,
			disabledButton,
			isValid,
			values,
			dataFormModal
		} = this.state;
		let type;
		if (dataFormModal !== undefined) {
			if (dataFormModal.id !== undefined && dataFormModal.id > 0) {
				type = 'edit';
			} else {
				type = 'create';
			}
		} else {
			type = 'create';
		}

		return (
			<View
				style={styles.toManyBloc}
				style={
					isValidated === false && !isValid
						? {
								...styles.toManyBloc,
								...genericStylesForm.fieldError
						  }
						: isValid !== null
						? isValid
							? {
									...styles.toManyBloc,
									...genericStylesForm.fieldSuccess
							  }
							: {
									...styles.visibleTextRowStandard,
									...genericStylesForm.fieldError
							  }
						: styles.toManyBloc
				}
			>
				<Text style={styles.toManyName}>{label}</Text>
				<Modal
					animationType="slide"
					transparent={false}
					visible={modalVisible}
					onRequestClose={() => {
						this._setModalVisible(!modalVisible);
					}}
				>
					<BackgroundImage>
						<Text style={styles.toManyName}>{label}</Text>
						<FormBuilder
							type={type}
							pattern={formModal}
							callback={this._toManyValidator}
							navigation={this.props.navigation}
							data={dataFormModal}
						/>
					</BackgroundImage>
				</Modal>
				<Button
					disabled={disabledButton || disabled}
					disabledStyle={styles.disabledNewRowButton}
					small
					icon={{ name: 'plus', type: 'font-awesome' }}
					backgroundColor={Color.validColor}
					buttonStyle={styles.newRowButton}
					onPress={() => {
						this._manageToManyRow(false);
					}}
				/>
				{message && <Text style={genericStylesForm.errorText}>{message}</Text>}
				<View style={styles.rowsContainer}>{this._returnToManyRows()}</View>
			</View>
		);
	}
}

ToManyField.propTypes = {
	disabled: PropTypes.bool,
	isValidated: PropTypes.bool,
	name: PropTypes.string.isRequired,
	label: PropTypes.string.isRequired,
	onChange: PropTypes.func,
	require: PropTypes.bool,
	message: PropTypes.string,
	value: PropTypes.arrayOf(function(
		propValue,
		key,
		componentName,
		location,
		propFullName
	) {
		if (propValue[key].name === 'indexToMany') {
			console.error(
				'Le nom de champs indexToMany est une valeur réservée. Merci de changer le nom du champs'
			);
		}
	}),
	navigation: PropTypes.object.isRequired,
	formModal: PropTypes.shape({
		groupTitles: PropTypes.arrayOf(PropTypes.object.isRequired),
		fields: PropTypes.arrayOf(function(
			propValue,
			key,
			componentName,
			location,
			propFullName
		) {
			if (propValue[key].name === 'indexToMany') {
				console.error(
					'Le nom de champs indexToMany est une valeur réservée. Merci de changer le nom du champs'
				);
			}
		}).isRequired
	}).isRequired,
	fieldToDisplay: function(props, propName, componentName) {
		if (
			props[propName] !== undefined &&
			props.formModal !== undefined &&
			props.formModal.fields !== undefined
		) {
			let fieldToDisplay = props.formModal.fields.filter(field => {
				return field.name === props[propName];
			});
			if (!fieldToDisplay || fieldToDisplay.length !== 1) {
				console.warn(
					'La props fieldToDisplay ne renvoie pas un champs définit dans la props formModal[fields]'
				);
			}
		}
	},
	functionFieldToDisplay: PropTypes.func
};

export const styles = StyleSheet.create({
	toManyName: {
		textAlign: 'center',
		textAlignVertical: 'center',
		backgroundColor: Color.headerFocusBorderColor,
		borderColor: Color.underTitleBorderColor,
		padding: 3,
		borderWidth: 1,
		borderRadius: 5,
		marginBottom: 5,
		fontSize: 18,
		color: Color.black,
		fontWeight: '900'
	},
	newRowButton: {
		borderRadius: 5,
		marginBottom: 5
	},
	disabledNewRowButton: {
		backgroundColor: Color.validColor,
		opacity: 0.5
	},
	toManyBloc: {
		backgroundColor: Color.buttonColorLight,
		borderColor: Color.buttonColorLight,
		borderWidth: 2,
		borderRadius: 5,
		margin: 5,
		padding: 5
	}
});

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { BackgroundImage } from '../../config';
import { Color } from '../../styles/Styles';
import PhfList from '../Liste/PhfListe';
import OfflineNotice from '../OfflineNotice';

/* CONSTANTES */
const maxLines = 24;

export default class ListDetailledFieldModal extends Component {
	constructor(props) {
		super(props);
		this.prevDataRender = {};
		this.nextDataRender = {};
		this.state = {
			dataRender: [],
			stopLoading: true,
			page: 0,
			orderBy: '',
			dataRenderSorted: [],
			headFirstColumn: [],
			headAllColumns: []
		};
	}

	componentDidMount() {
		const headFirstColumn = this._constructArrayHeadFirstCol();
		const headAllColumns = this._constructArrayAllColumns();
		this.setState({ headFirstColumn, headAllColumns });

		let { orderBy } = this.state;
		orderBy = !orderBy ? 'id' : orderBy;
		this._sortDatarender(orderBy);
	}

	_constructArrayHeadFirstCol() {
		const { labelColumns, firstColumn } = this.props;
		return [
			{
				column: labelColumns[firstColumn],
				orderBy: 'NAME',
				style: [styles.textHeadFirstColumn],
				keyIndex: ''
			}
		];
	}

	_constructArrayAllColumns() {
		const { labelColumns, firstColumn } = this.props;
		let headAllColumns = [];
		if (labelColumns !== undefined && firstColumn !== undefined) {
			for (const key in labelColumns) {
				if (key !== firstColumn) {
					headAllColumns.push({
						column: labelColumns[key],
						orderBy: key,
						style: [styles.textHeadAllColumns],
						keyIndex: ''
					});
				}
			}
			return headAllColumns;
		} else {
			console.error('Les props labelColumns et firstColumn sont obligatoires');
		}
	}

	/**
	 * Fonction flêchée pour bind le this
	 * @param {*} item
	 */
	_layoutItem(item) {
		let layoutItem = {};
		for (const key in item) {
			if (key !== 'id' && key !== 'NAME') {
				layoutItem[key] = { style: styles.textCell, val: item[key] };
			}
		}

		return layoutItem;
	}

	/**
	 * Fonction qui effectue le tri des données selon les paramètres reçues
	 * @param {string} param1
	 * @param {string} param2
	 */
	_sortDatarender(param1, param2) {
		let datas = this.props.datasList;

		let orderBy;
		if (param1 === 'id') {
			orderBy = 'id';
		} else {
			orderBy = param2.replace(/^[1,2]/, '');
		}

		if (datas[0].hasOwnProperty(orderBy)) {
			datas.sort(function(a, b) {
				if (a[orderBy] > b[orderBy]) {
					return 1;
				}
				if (a[orderBy] < b[orderBy]) {
					return -1;
				}
				return 0;
			});
			this.setState({ dataRenderSorted: datas }, () => {
				this._loadInit();
			});
		} else {
			console.warn('La clé de tri ' + orderBy + " n'est pas une clé valide");
			this.setState({ dataRenderSorted: datas });
		}
	}

	/**
	 * Fonction factorisée qui charges les données selon le scroll effectuée
	 * @param {boolean} positif
	 */
	_handleLoad(positif) {
		let { page, dataRenderSorted } = this.state;
		let newPage, firstRow, lastRow, cow_datas_render;
		const lengthMax = dataRenderSorted.length;
		//on gère les datas précédentes
		if (page === 0) {
			firstRow = 0;
			lastRow = maxLines;
			newPage = page;
		} else {
			newPage = page - 1;
			firstRow = newPage * maxLines;
			lastRow = newPage * maxLines + maxLines;
			if (lastRow > lengthMax) {
				lastRow = lengthMax;
			}
		}
		cow_datas_render = dataRenderSorted.slice(firstRow, lastRow);
		this.prevDataRender = {
			dataRender: cow_datas_render,
			page: newPage
		};

		//on gère les datas suivantes
		newPage = page + 1;
		firstRow = newPage * maxLines;
		lastRow = newPage * maxLines + maxLines;
		if (firstRow >= lengthMax) {
			this.nextDataRender = {
				dataRender: this.state.dataRender,
				page: page
			};
		} else {
			if (lastRow >= lengthMax) {
				lastRow = lengthMax;
			}
			cow_datas_render = dataRenderSorted.slice(firstRow, lastRow);
			this.nextDataRender = {
				dataRender: cow_datas_render,
				page: newPage
			};
		}
	}

	/**
	 * Fonction de chargement des données initiales
	 * Également utilisé lors d'un tri
	 */
	_loadInit = () => {
		let initDataRender,
			initDataRenderName = {};
		if (this.state.dataRenderSorted.length > 0) {
			initDataRender = this.state.dataRenderSorted.slice(0, maxLines);
			this.setState(
				{
					dataRender: initDataRender,
					stopLoading: false,
					page: 0
				},
				() => {
					if (!this.state.stopLoading) {
						this._handleLoad();
					}
				}
			);
		}
	};

	/**
	 * Function qui recharge les données suivantes sur un scroll vers le bas
	 */
	_handleLoadMore = () => {
		if (!this.state.stopLoading) {
			this.setState(
				{
					stopLoading: true
				},
				() => {
					this.setState(
						{
							dataRender: this.nextDataRender.dataRender,
							stopLoading: false,
							page: this.nextDataRender.page
						},
						() => {
							if (!this.state.stopLoading) {
								this._handleLoad();
							}
						}
					);
				}
			);
		}
	};

	/**
	 * Function qui recharge les données précédentes sur un scroll vers le haut
	 */
	_handleLoadBack = () => {
		if (!this.state.stopLoading) {
			this.setState(
				{
					stopLoading: true
				},
				() => {
					this.setState(
						{
							dataRender: this.prevDataRender.dataRender,
							stopLoading: false,
							page: this.prevDataRender.page
						},
						() => {
							if (!this.state.stopLoading) {
								this._handleLoad();
							}
						}
					);
				}
			);
		}
	};

	/**
	 * Fonction sur l'event clique sur les cellules de la première colonne
	 * @param {object} item
	 */
	_onPressItem(datas) {
		let { dataRenderSorted } = this.state;
		let result = dataRenderSorted.filter(item => {
			return datas.id === item.id;
		});
		if (!result || result.length !== 1) {
			result = false;
			console.warn("La valeur retournée n'est pas valide");
			this.props.onSelect(false);
		} else {
			this.props.onSelect(result[0].id);
		}
	}

	render() {
		const {
			dataRender,
			stopLoading,
			dataRenderSorted,
			headFirstColumn,
			headAllColumns
		} = this.state;
		return (
			<BackgroundImage>
				<View style={{ flex: 1 }}>
					<OfflineNotice />
					{headFirstColumn.length < 1 && headAllColumns.length < 1 ? (
						<View style={{ flex: 1, alignItems: 'center' }}>
							<ActivityIndicator size="large" color={Color.buttonBorderColor} />
						</View>
					) : (
						dataRenderSorted.length > 0 && (
							<PhfList
								firstColumn={headFirstColumn}
								allColumns={headAllColumns}
								data={dataRender}
								dataName={dataRender}
								layoutItem={this._layoutItem}
								maxLines={maxLines}
								handleSortColumn={(param1, param2) => {
									this._sortDatarender(param1, param2);
								}}
								onPressItem={item => {
									this._onPressItem(item);
								}}
								layoutOnPress={item => {
									//this._onPressItem(item);
									console.log('on clique sur la ligne');
								}}
								layoutOnLongPress={() => {
									console.log('onLongPress lign');
								}}
								loadInit={this._loadInit}
								loadMore={this._handleLoadMore}
								loadBack={this._handleLoadBack}
								stopLoading={stopLoading}
							/>
						)
					)}
				</View>
			</BackgroundImage>
		);
	}
}

const styles = StyleSheet.create({
	textCell: {
		paddingHorizontal: 5,
		width: 80,
		textAlignVertical: 'center',
		textAlign: 'center'
	},
	textHeadFirstColumn: {
		paddingHorizontal: 5,
		width: 110,
		textAlignVertical: 'center',
		textAlign: 'center'
	},
	textHeadAllColumns: {
		paddingHorizontal: 5,
		width: 80,
		textAlignVertical: 'center',
		textAlign: 'center'
	}
});

ListDetailledFieldModal.propTypes = {
	onSelect: PropTypes.func.isRequired,
	firstColumn: PropTypes.string.isRequired,
	labelColumns: PropTypes.objectOf(
		PropTypes.oneOfType([PropTypes.string, PropTypes.number])
	).isRequired,
	datasList: PropTypes.arrayOf(
		PropTypes.shape({
			id: PropTypes.number.isRequired
		})
	).isRequired
};

import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { ALL_DATAS_COWS, HEAD_ALL_COLUMNS, HEAD_FIRST_COLUMN, layoutItem } from '.';
import HeaderComponent from '../../components/Header';
import PhfList from '../../components/Liste/PhfListe';
import OfflineNotice from '../../components/OfflineNotice';
import { BackgroundImage } from '../../config';
import Styles from '../../styles';

/* CONSTANTES */
const maxLines = 24;

export default class ListTestView extends Component {
	constructor(props) {
		super(props);
		this.prevDataRender = {};
		this.nextDataRender = {};
		this.state = {
			dataRender: [],
			stopLoading: true,
			page: 0,
			orderBy: '',
			dataRenderSorted: []
		};
	}

	componentDidMount() {
		let { orderBy } = this.state;
		orderBy = !orderBy ? 'id' : orderBy;
		this._sortDatarender(orderBy);
	}

	_sortDatarender(param1, param2) {
		let datas = ALL_DATAS_COWS;

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
	 * {boolean} positif
	 */
	_handleLoad(positif) {
		//console.log('on execute _handleLoad dans listTest');
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
	_handleLoadMore = () => {
		//console.log('execution _handleLoadMore dans ListTest');
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
	_handleLoadBack = () => {
		//console.log('execution _handleLoadBack dans ListTest');
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

	render() {
		const { dataRender, stopLoading, dataRenderSorted } = this.state;
		return (
			<BackgroundImage>
				<HeaderComponent {...this.props} title="Liste test" />

				<View style={{ flex: 1 }}>
					<OfflineNotice />
					{dataRenderSorted.length > 0 && (
						<PhfList
							firstColumn={HEAD_FIRST_COLUMN}
							allColumns={HEAD_ALL_COLUMNS}
							data={dataRender}
							dataName={dataRender}
							layoutItem={layoutItem}
							maxLines={maxLines}
							handleSortColumn={(param1, param2) => {
								this._sortDatarender(param1, param2);
								console.log('handleSortColumn');
							}}
							layoutOnPress={() => {
								console.log('onPress lign');
							}}
							layoutOnLongPress={() => {
								console.log('onLongPress lign');
							}}
							loadInit={this._loadInit}
							loadMore={this._handleLoadMore}
							loadBack={this._handleLoadBack}
							stopLoading={stopLoading}
						/>
					)}
				</View>
			</BackgroundImage>
		);
	}
}

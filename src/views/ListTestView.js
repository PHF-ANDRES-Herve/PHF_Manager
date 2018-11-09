import React, { Component } from 'react';
import { Text, View } from 'react-native';

import HeaderComponent from '../components/Header';
import PhfList from '../components/Liste/PhfListe';
import OfflineNotice from '../components/OfflineNotice';
import { BackgroundImage } from '../config';
import { cowDatas } from '../config/';
import Styles from '../styles';

export default class ListTestView extends Component {
	constructor(props) {
		super(props);
		this.dataFirstColumn = this._dataFirstColumn();
		this.state = {};
	}

	_loadInit() {}
	_dataFirstColumn() {
		let cows = [];
		cowDatas.map(cow => {
			cows.push({
				id: cow.id,
				name: cow.name
			});
		});

		return cows;
	}
	/**
	 * Création de la première colonne de la liste
	 */
	_firstColumn() {
		return [
			{
				column: 'Nom',
				orderyBy: 'name',
				style: [],
				keyIndex: ''
			}
		];
	}

	_allColumns() {
		return [
			{ column: 'Référence', orderyBy: 'ref', style: [], keyIndex: '' },
			{ column: 'Père', orderyBy: 'father', style: [], keyIndex: '' },
			{ column: 'GPM', orderyBy: 'gpm', style: [], keyIndex: '' },
			{ column: 'Éleveur', orderyBy: 'farmer', style: [], keyIndex: '' },
			{
				column: 'Département',
				orderyBy: 'department',
				style: [],
				keyIndex: ''
			},
			{ column: 'ISU', orderyBy: 'isu', style: [], keyIndex: '' },
			{
				column: 'Date de naissance',
				orderyBy: 'birth_date',
				style: [],
				keyIndex: ''
			},
			{ column: 'INEL', orderyBy: 'inel', style: [], keyIndex: '' },
			{ column: 'TP', orderyBy: 'tp', style: [], keyIndex: '' },
			{ column: 'TB', orderyBy: 'tb', style: [], keyIndex: '' },
			{ column: 'Lait', orderyBy: 'milk', style: [], keyIndex: '' },
			{ column: 'MO', orderyBy: 'mo', style: [], keyIndex: '' },
			{ column: 'MA', orderyBy: 'ma', style: [], keyIndex: '' },
			{ column: 'CC', orderyBy: 'cc', style: [], keyIndex: '' },
			{ column: 'ME', orderyBy: 'me', style: [], keyIndex: '' },
			{ column: 'STMA', orderyBy: 'stma', style: [], keyIndex: '' },
			{ column: 'Reproduction', orderyBy: 'repro', style: [], keyIndex: '' },
			{ column: 'Type', orderyBy: 'type', style: [], keyIndex: '' }
		];
	}

	render() {
		return (
			<BackgroundImage>
				<HeaderComponent {...this.props} title="Liste test" />
				<View style={{ flex: 1 }}>
					<OfflineNotice />
					<PhfList
						data={cowDatas}
						firstColumn={this._firstColumn}
						allColumns={this._allColumns}
						dataName={this.dataFirstColumn}
						maxLines={30}
						handleSortColumn={() => {
							console.log('handleSortColumn');
						}}
						layoutOnPress={() => {
							console.log('layoutOnPress');
						}}
						layoutOnLongPress={() => {
							console.log('layoutOnLongPress');
						}}
						loadInit={(data) => {
							console.log(dazt)
						}}
						layoutItem={item => {
							return {
								ref: { val: item.ref },
								father: { val: item.father },
								gpm: { val: item.gpm },
								farmer: { val: item.farmer },
								department: { val: item.department },
								isu: { val: item.isu },
								birth_date: { val: item.birth_date },
								inel: { val: item.inel },
								tp: { val: item.tp },
								tb: { val: item.tb },
								milk: { val: item.milk },
								mo: { val: item.mo },
								ma: { val: item.ma },
								cc: { val: item.cc },
								me: { val: item.me },
								stma: { val: item.stma },
								repro: { val: item.repro },
								type: { val: item.type }
							};
						}}
					/>
				</View>
			</BackgroundImage>
		);
	}
}

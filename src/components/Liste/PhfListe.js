import { Flex, SearchBar, WhiteSpace } from 'antd-mobile-rn';
import React, { Component, PureComponent } from 'react';
import {
    ActivityIndicator,
    Alert,
    Animated,
    AsyncStorage,
    BackHandler,
    Dimensions,
    FlatList,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    ToastAndroid,
    TouchableHighlight,
    TouchableOpacity,
    View,
} from 'react-native';
import SideMenu from 'react-native-side-menu';

import { _getNoboviJson, BackgroundImage } from '../config';
import { _getBaseData, AccueilSQLiteToJSON } from '../config/BddSqlite';
import { _formJSONrange, _getAllValues } from '../config/Filtrage';
import { isLandscape, isPhone, isPortrait, isTablet } from '../config/Platform';
import Styles from '../styles';
import HeaderComponent from './Header';

/* VARIABLES */
var dataNextSet = [];
var dataPrevSet = {};
var dataNameNextSet = [];
var dataNamePrevSet = {};
var stopLoading = true;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

/**
 * Nombres de lignes affichées
 */
const linesToRender = isPhone ? 24 : isTablet ? 34 : 34;

class ClickColumn extends PureComponent {
	_onPress = () => {
		/**
		 * on a besoin d'une clé unique dans le cas où le libellé affiché est différent
		 */
		const columnKey =
			this.props.keyIndex !== '' // si présent dans les props: indique que la clé de tri et le libellé affichés sont différents
				? this.props.keyIndex
				: this.props.column;
		const orderByString =
			this.props.orderBy !== '' // si présent dans les props: indique un tri alphanumérique
				? '1' + this.props.orderBy
				: '2' + columnKey; //1 = string (ex:Name), 2 = numeric (ex:MO_CD)
		this.props.onPressColumn(columnKey, orderByString);
	};

	render() {
		const column = this.props.column;
		const style = this.props.style;
		return (
			<TouchableHighlight onPress={this._onPress}>
				<View>
					<Text
						key={column}
						style={[
							styles.GridViewInsideTextItemStyle,
							styles.itemName,
							style,
							styles.TitleColumn
						]}
					>
						{column}
					</Text>
				</View>
			</TouchableHighlight>
		);
	}
}

class ClickName extends PureComponent {
	_onPress = () => {
		this.props.onPressItem(this.props.item);
	};
	render() {
		const item = this.props.item;
		const styleBold = this.props.bold ? 'bold' : 'normal';
		const colName = item.NAME;
		return (
			<TouchableOpacity onPress={this._onPress} underlayColor="#dddddd">
				<View>
					<Text
						key={colName}
						style={[
							styles.username,
							{
								marginLeft: 4,
								textAlignVertical: 'center',
								fontWeight: styleBold
							}
						]}
					>
						{colName}
					</Text>
				</View>
			</TouchableOpacity>
		);
	}
}

export default class PhfTable extends PureComponent {
	constructor(props, context) {
		super(props, context);
		this.state = {
			/**
			 * BDD SQlite
			 */
			dataRender: [], //les data à afficher
			dataRenderName: [],
			dataLoad: [], // les data à charger pour le dataRender
			data: [],
			maxLines: linesToRender,
			refreshing: false,
			SQLFirstElement: 0,
			SQLLastElement: 0,
			SQLRefreshElement: 0,
			/**
			 * autres states
			 */
			isLoading: true,
			isFirstLoad: true,
			/**
			 * scroll
			 */
			scrollX: new Animated.Value(0),
			directionScroll: true // true= scroll data suivant, false= refresh
		};
		this._animated = new Animated.Value(0);
	}

	componentWillMount() {
		// TABLEAUX DE DATASET : initialisation
		dataNextSet.length = 0;
		dataPrevSet = {};
		dataNameNextSet.length = 0;
		dataNamePrevSet = {};
		this._handleLoadRefresh();
	}

	/* Séparateur de lignes */
	_renderSeparator = () => {
		return (
			<View
				style={{
					height: 0.5,
					width: '100%',
					backgroundColor: '#fdcb6e'
				}}
			/>
		);
	};

	/**
	 * Le contenu de la Liste hormis la 1ère colonne ClickName
	 * item : Objet Json
	 */
	_layoutItem(item) {
		return (
			<TouchableOpacity
				onPress={() => this.props.layoutOnPress(item)}
				onLongPress={() => this.props.layoutOnLongPress(item)}
			>
				<View style={styles.GridViewBlockStyle}>
					const keyColumn = Object.keys(item);
					{item.forEach(column => {
						<Text
							key={column.key}
							style={[styles.GridViewInsideTextItemStyle, column.style]}
						>
							{column.val}
						</Text>;
					})}
				</View>
			</TouchableOpacity>
		);
	}
	/* Header = Titres ClickColumn*/

	_renderHeader = Columns => {
		return (
			<View style={styles.viewTitle}>
				{Columns.forEach(column => {
					<ClickColumn
						keyIndex={column.keyIndex}
						column={column.column}
						orderBy={column.orderBy}
						onPressColumn={this._onPressColumn}
						style={column.style}
					/>;
				})}
			</View>
		);
	};

	/* Click pour mode Fiche : à paramétrer*/
	_onPressItem = param => {
		this.props.onPressItem(param);
	};

	_onPressColumn = (param, param1) => {
		this.props.handleSortColumn(param, param1);

		ToastAndroid.showWithGravity(
			param,
			ToastAndroid.SHORT,
			ToastAndroid.CENTER
		);
	};

	/**
	 * _handle BDD SQLite / Chargement INITIAL
	 */
	_handleLoadRefresh() {
		let { dataRender, SQLFirstElement, maxLines } = this.state;

		/// on passe uniquement quand on avance vers le bas, dans le cas du 'recul' de données (vers le haut), on s'arrête au '0';
		if (SQLFirstElement === 0 && dataRender.length === 0) {
			/**
			 * l'index de démarrage de la liste, elle-même contenant maxLines éléments
			 */
			var StartElementIndex =
				SQLFirstElement === 0 ? 0 : SQLFirstElement - (maxLines - 2); //- (maxLines * 0.5).toFixed(0));

			this.state.SQLFirstElement = StartElementIndex;

			/**
			 * appel getBaseData
			 */
			this._callDatabase(this._FlatTestCallback);
		}
	}
	/**
	 * Fonction qui lance getBaseData
	 */
	_callDatabase(_BDDCallback) {
		this.props.getBaseData(this.props.parameters);
	}
	_onLoadDatarender = async () => {
		try {
			var events = await this._FlatTestCallback(dataNextSet);
		} catch (e) {
			console.error(e);
		}
	};
	/**
	 * CHARGEMENT SUIVANT
	 */
	_handleLoadMore() {
		let { isFirstLoad, isLoading, maxLines, SQLFirstElement } = this.state;

		this.state.directionScroll = true;

		if (isFirstLoad !== true && !isLoading) {
			stopLoading = true;
			var StartElementIndex = SQLFirstElement + (maxLines - 2); //(maxLines - 2);

			this.state.SQLFirstElement = StartElementIndex;

			this._onLoadDatarender();
		}
	}

	/**
	 * CHARGEMENT PRECEDENT
	 */
	_handleLoadBack() {
		let { isFirstLoad, isLoading, maxLines, SQLFirstElement } = this.state;

		this.state.directionScroll = false;

		// Récupération des prochaines valeurs pour le Dataload
		if (isFirstLoad !== true && !isLoading) {
			stopLoading = true;
			var StartElementIndex = SQLFirstElement - (maxLines - 2); //(maxLines - 2);
			this.state.SQLFirstElement = StartElementIndex;
			this._onLoadDatarender();
		}
	}
	/**
	 * Fin de chargement : MAJ des state & appel du Render
	 */
	_isLoadingSetState(result) {
		stopLoading = false;
		this.setState({ isLoading: false });
	}

	/**
	 * Récupération des libellés pour la 1ère colonne/1ère table
	 */
	_handleDataRenderName = results => {
		this.props.handleDataRenderName(results);
	};

	/**
	 * CallBack pour affichage ( cas chargement précédent, suivant)
	 * result : au format JSon
	 */
	_FlatTestCallback2 = async result => {
		var result1 = this._handleDataRenderName(result);
		dataNextSet = result;
		dataNameNextSet = result1;
		dataPrevSet[this.state.SQLFirstElement] = dataNextSet;
		dataNamePrevSet[this.state.SQLFirstElement] = dataNameNextSet;

		this._isLoadingSetState();
	};

	/**
	 * Mise à jour du DATARENDER
	 * result : au format Json
	 */
	_FlatTestCallback = result => {
		let {
			isLoading,
			maxLines,
			SQLFirstElement,
			dataRender,
			dataRenderName
		} = this.state;

		//affichage rechargement des données dans la vue
		var dataToRender = [];
		var dataNameToRender = [];
		if (SQLFirstElement - (maxLines - 2) > 0) {
			if (this.state.directionScroll === true) {
				// LOAD MORE
				dataToRender = dataNextSet;
				dataNameToRender = dataNameNextSet;
			} else {
				// REFRESH

				// cas particulier: index=0
				if (SQLFirstElement - (maxLines - 2) > 0) {
					//
					dataToRender = dataPrevSet[SQLFirstElement - (maxLines - 2)];
					dataNameToRender = dataNamePrevSet[SQLFirstElement - (maxLines - 2)];
				} else {
					dataToRender = dataRender;
					dataNameToRender = dataRenderName;
				}
			}
			this.setState(
				{ dataRender: dataToRender, dataRenderName: dataNameToRender },
				() => {
					if (isLoading !== true) {
						this._callDatabase(this._FlatTestCallback2);
						this.mainScroll.scrollTo({ y: 0, animated: true });
					}
				}
			);
		} else {
			//1er chargement
			var result1 = this._handleDataRenderName(result);

			if (this.state.directionScroll === true) {
				// first load
				dataPrevSet[0] = result;
				dataNamePrevSet[0] = result1;
				dataToRender = result;
				dataNameToRender = result1;
			} else {
				//loadBack
				dataToRender = dataPrevSet[0];
				dataNameToRender = dataNamePrevSet[0];
				this.state.SQLFirstElement = 0;
			}
			this.setState(
				{
					dataRender: dataToRender,
					dataRenderName: dataNameToRender,
					refreshing: false
				},
				() => {
					this.state.SQLFirstElement += maxLines - 2;
					this.state.isFirstLoad = false;
					this._callDatabase(this._FlatTestCallback2);
				}
			);
		}
	};

	/**
	 * TRI DES COLONNES : à re-paramétrer
	 */
	_handleSortColumn(param, param1) {
		this.props.handleSortColumn(param, param1);

		/* Appel de la requète SQl et reset des variable SQLFirstElement, SQLLastElement, SQLRefreshElement */
		this.state.dataRender = [];
		this.state.SQLFirstElement = 0;
		this.state.SQLLastElement = maxLines;
		this.state.refreshing = false;
		this.state.loadingNext = false;

		/**
		 * appel getBaseData
		 */
		this._callDatabase(this._FlatTestCallback);
	}

	/* info popup : ici, on signale le tri effectué */
	_handleToastAndroid = texte => {
		ToastAndroid.showWithGravity(
			texte,
			ToastAndroid.SHORT,
			ToastAndroid.CENTER
		);
	};

	isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
		const paddingToBottom = 20;
		return (
			layoutMeasurement.height + contentOffset.y >=
			contentSize.height - paddingToBottom
		);
	};

	isCloseToTop = ({ contentOffset }) => {
		return contentOffset.y <= 1;
	};

	/* RENDER GLOBAL */
	render() {
		return (
			<View style={styles.container2}>
				<View style={{ marginTop: 10, flex: 1, flexDirection: 'column' }}>
					{/* TITRES */}
					<View
						style={{
							// flex: 1,
							flexDirection: 'row',
							backgroundColor: '#fff'
						}}
					>
						<View style={{ width: 110 }}>
							<AnimatedFlatList
								ListHeaderComponent={this._renderHeader(this.props.firstColumn)}
							/>
						</View>

						<View style={{ flex: 1, flexDirection: 'row' }}>
							<ScrollView
								horizontal
								showsHorizontalScrollIndicator={false}
								ref={instance => {
									this.checkScroll = instance;
								}}
							>
								<AnimatedFlatList
									data={null}
									keyExtractor={(item, index) => index.toString()}
									initialNumToRender={0}
									ListHeaderComponent={this._renderHeader(
										this.props.allColumns
									)}
									showsHorizontalScrollIndicator={false}
								/>
							</ScrollView>
						</View>
					</View>

					{/* DATA */}
					<ScrollView
						ref={instance => {
							this.mainScroll = instance;
						}}
						scrollEventThrottle={16}
						onScroll={Animated.event(
							[
								{
									nativeEvent: { contentOffset: { y: this.state.scrollY } }
								}
							],
							{
								listener: event => {
									if (this.isCloseToBottom(event.nativeEvent)) {
										this._handleLoadMore();
									} else {
										if (
											stopLoading !== true &&
											this.state.SQLFirstElement !== 0 &&
											this.isCloseToTop(event.nativeEvent)
										) {
											this._handleLoadBack();
										}
									}
								}
							}
						)}
					>
						<View
							style={{
								flex: 1,
								flexDirection: 'row',
								backgroundColor: '#fff'
							}}
						>
							{/* 1ERE COLONNE */}
							<View style={{ width: 110 }}>
								<AnimatedFlatList
									data={this.state.dataRenderName}
									ItemSeparatorComponent={this._renderSeparator}
									keyExtractor={(item, index) => index.toString()}
									maxToRenderPerBatch={linesToRender / 2}
									ref={instance => {
										this.nameScroll = instance;
									}}
									renderItem={({ item, index }) => (
										<ClickName
											item={item}
											bold
											onPressItem={this._onPressItem}
										/>
									)}
									scrollEnabled={false}
									showsVerticalScrollIndicator={false}
								/>
							</View>

							{/* 2è TABLE A DROITE */}
							<View style={{ flex: 1, flexDirection: 'row' }}>
								<ScrollView
									horizontal
									scrollEventThrottle={16}
									onScroll={e => {
										var scrollX = e.nativeEvent.contentOffset.x;
										this.checkScroll.scrollTo({
											x: scrollX,
											animated: false
										});
									}}
								>
									<AnimatedFlatList
										data={this.state.dataRender}
										getItemLayout={this.getItemLayout}
										initialNumToRender={linesToRender / 2}
										ItemSeparatorComponent={this._renderSeparator}
										keyExtractor={(item, index) => index.toString()}
										ref={instanceData => {
											this.dataScroll = instanceData;
										}}
										renderItem={({ item }) => this._layoutItem(item)}
										scrollEnabled={false}
									/>
								</ScrollView>
							</View>
						</View>
					</ScrollView>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container2: {
		flex: 1
	},
	username: {
		width: 115,
		height: 30,
		margin: 5,
		justifyContent: 'center',
		alignItems: 'center',
		fontSize: 12,
		color: '#0984e3'
	},
	itemName: {
		fontWeight: '600',
		paddingTop: 10
	},
	viewTitle: {
		flex: 1,
		flexDirection: 'row'
	},
	GridViewBlockStyle: {
		flex: 1,
		flexDirection: 'row',
		alignItems: 'center',
		height: 30,
		margin: 5
	},
	GridViewInsideTextItemStyle: {
		alignSelf: 'flex-start',
		paddingTop: 7,
		fontSize: 12,
		justifyContent: 'center'
	},
	TitleColumn: {
		backgroundColor: '#0a3d62',
		color: 'white',
		height: 40,
		paddingLeft: 5
	}
});

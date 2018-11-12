import React, { Component, PureComponent } from 'react';
import { Animated, FlatList, ScrollView, StyleSheet, Text, ToastAndroid, TouchableHighlight, TouchableOpacity, View } from 'react-native';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class ClickColumn extends PureComponent {
	_onPress = () => {
		/**
		 * on a besoin d'une clé unique dans le cas où le libellé affiché est différent
		 */
		const columnKey =
			(this.props.keyIndex !== '') // si présent dans les props: indique que la clé de tri et le libellé affichés sont différents
				? this.props.keyIndex
				: this.props.column;
		const orderByString =
			(this.props.orderBy !== '') // si présent dans les props: indique un tri alphanumérique
				? ('1' + this.props.orderBy)
				: ('2' + columnKey); //1 = string (ex:Name), 2 = numeric (ex:MO_CD)
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
						numberOfLines={2}
						ellipsizeMode="tail"
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
						numberOfLines={2}
						ellipsizeMode="tail"
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
			scrollX: new Animated.Value(0),
			stopLoading: false,
		};
		this._animated = new Animated.Value(0);
	}

	componentWillMount() {
		this.props.loadInit();
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
	_layoutItem(Item) {
		const item = this.props.layoutItem(Item);

		return ((item !== undefined) && (item !== null)) ? (
			<TouchableOpacity
				onPress={() => this.props.layoutOnPress(item)}
				onLongPress={() => this.props.layoutOnLongPress(item)}
			>
				<View style={styles.GridViewBlockStyle}>
					{Object.keys(item).map((objectKey, value) => {
						return (
							<Text
								key={objectKey}
								style={[
									styles.GridViewInsideTextItemStyle,
									item[objectKey].style
								]}
								numberOfLines={2}
								ellipsizeMode="tail"
							>
								{item[objectKey].val}
							</Text>
						);
					})}
				</View>
			</TouchableOpacity>
		) : null;
	}

	/* Header = Titres ClickColumn*/
	_renderHeader = Columns => {
		//console.log(Columns);
		return (
			<View style={styles.viewTitle}>
				{Object.keys(Columns).map((column, index) => {
					return (
						<ClickColumn
							key={index}
							keyIndex={Columns[column].keyIndex}
							column={Columns[column].column}
							orderBy={Columns[column].orderBy}
							onPressColumn={this._onPressColumn}
							style={Columns[column].style}
						/>
					);
				})}
			</View>
		);
	};

	/* Click pour mode Fiche : à paramétrer */
	_onPressItem = param => {
		this.props.onPressItem(param);
	};

	_onPressColumn = (param, param1) => {
		this._handleSortColumn(param, param1);

		ToastAndroid.showWithGravity(
			param,
			ToastAndroid.SHORT,
			ToastAndroid.CENTER
		);
	};

	/**
	 * CHARGEMENT SUIVANT
	 */
	_handleLoadMore = async () => {
		console.log("liste _handleLoadMore");
		this.state.stopLoading = true;
		this.props.loadMore();
		this.mainScroll.scrollTo({ y: 1, animated: true });
	};

	/**
	 * CHARGEMENT PRECEDENT
	 */
	_handleLoadBack() {
		console.log("liste _handleLoadBack");
		this.state.stopLoading = true;
		this.props.loadBack();
		//this.mainScroll.scrollTo({ y: 1, animated: true });
	}

	/**
	 * TRI DES COLONNES
	 */
	_handleSortColumn(param, param1) {
		this.state.stopLoading = true;
		this.props.handleSortColumn(param, param1);
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
			(layoutMeasurement.height + contentOffset.y) >=
			(contentSize.height - paddingToBottom)
		);
	};

	isCloseToTop = ({ contentOffset }) => {
		return (contentOffset.y <= 1);
	};

	componentWillReceiveProps(nextProps) {
		if(nextProps.stopLoading !== this.state.stopLoading){
			this.setState({ stopLoading: nextProps.stopLoading });
		}
	}

	/* RENDER GLOBAL */
	render() {
		return (
			<View style={styles.container2}>
				<View style={{ marginTop: 10, flex: 1, flexDirection: 'column' }}>
					{/* TITRES */}
					<View
						style={{
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
								onScroll={e => {
									if (!this.layoutIsScrolling) {
										this.titleIsScrolling = true;
										var scrollX = e.nativeEvent.contentOffset.x;
										this.checkScroll.scrollTo({
											x: scrollX,
											animated: false
										});
									}
									this.layoutIsScrolling = false;
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
									nativeEvent: {
										contentOffset: {
											y: this.state.scrollY
										}
									}
								}
							],
							{
								listener: event => {
									if (
										(this.props.stopLoading !== true) &&
										(this.state.stopLoading !== true) &&
										this.isCloseToBottom(event.nativeEvent)
									) {
										this._handleLoadMore();
									} else {
										if (
											(this.props.stopLoading !== true) &&
											(this.state.stopLoading !== true) &&
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
									data={this.props.dataName}
									ItemSeparatorComponent={this._renderSeparator}
									keyExtractor={(item, index) => index.toString()}
									maxToRenderPerBatch={this.props.maxLines / 2}
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
										if (!this.titleIsScrolling) {
											this.layoutIsScrolling = true;
											var scrollX = e.nativeEvent.contentOffset.x;
											this.checkScroll.scrollTo({
												x: scrollX,
												animated: false
											});
										}
										this.titleIsScrolling = false;
									}}
								>
									<AnimatedFlatList
										data={this.props.data}
										getItemLayout={this.getItemLayout}
										initialNumToRender={this.props.maxLines / 2}
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

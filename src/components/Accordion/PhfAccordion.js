/**
 * IMPORT RN
 */
import React, { PureComponent } from 'react';
import { Animated, Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Accordion from 'react-native-collapsible/Accordion';
import { Button } from 'react-native-elements';

import Styles from '../../styles/';

/**
 * VARIABLES
 */
var screen = Dimensions.get('window');
const { width: screenWidth } = Dimensions.get('window');
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

/**
 * CLASSE
 */
export default class PhfAccordion extends PureComponent {
	constructor(props) {
		super(props);
		this.state = {
			activeSections: []
		};
		// this._callAction = this._callAction.bind(this);
	}

	_callAction = action => {
		console.log("_callAction");
		this.props.callAction(action);
	};

	_renderHeader = (item, index, isActive) => {
		// détermination de l'index du header actif
		const buttonFocus =
			(this.state.activeSections.length === 0)
				? -1
				: (this.state.activeSections - index);
		console.log("buttonFocus");
		console.log(buttonFocus);
		/*
		if (buttonFocus === 0) {
			//console.log("item");
			//console.log(item);
			// cas : content absent --> action directe
			!item.content ? this._callAction(item.action[0]) : null;
			
		}
		*/
		
		// mémo de l'item
		return (
			<View>
				<Text
					style={[
						Styles.buttonText,
						{
							backgroundColor:
								(buttonFocus === 0)
									? this.props.buttonBorderColor
									: this.props.headerColor,
							height: 50,
							borderColor:
								(buttonFocus === 0)
									? this.props.headerFocusBorderColor
									: this.props.headerBorderColor,
							borderWidth: 1
						}
					]}
				>
					{item.title}
				</Text>
			</View>
		);
	};

	_renderContent = (item, index) => {
		const buttonColor = this.props.buttonBorderColor;
		return (
			<View style={{ height: 'auto', marginTop: 10, marginBottom: 10 }}>
				<AnimatedFlatList
					data={item.content}
					keyExtractor={(item, index) => index.toString()}
					renderItem={({ itemc, index }) => (
						<TouchableOpacity style={[styles.button]}>
							<Button
								onPress={() => this._callAction(item.action[index])}
								titleStyle={Styles.buttonText}
								buttonStyle={{
									height: 30,
									backgroundColor: 'transparent',
									alignSelf: 'center',
									width: this.props.buttonWidth,
									borderColor: buttonColor,
									borderWidth: 1,
									borderRadius: this.props.borderRadius,
									margin: 10
								}}
								large
								loadingRight
								title={item.content[index]}
							/>
						</TouchableOpacity>
					)}
				/>
			</View>
		);
	};

	_updateSections = activeSections => {
		const { sections } = this.props;
		console.log("PHF action");
		if (
			(sections[activeSections].content === undefined) ||
			(sections[activeSections].content.length === 0)
		) {
			this._callAction(this.props.sections[activeSections].action[0]);
		}
		this.setState({ activeSections });
	};

	render() {
		return (
			<Accordion
				sections={this.props.sections}
				activeSections={this.state.activeSections}
				renderHeader={this._renderHeader}
				renderContent={this._renderContent}
				onChange={this._updateSections}
				duration={400}
			/>
		);
	}
}
/**
 * Styles
 */
const styles = StyleSheet.create({
	button: {
		alignItems: 'center',
		flexGrow: 1,
		justifyContent: 'center'
	}
});

/**
 * IMPORT RN
 */
import React, { PureComponent } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from "react-native";
import { Button } from "react-native-elements";
import Accordion from "react-native-collapsible/Accordion";
import Styles from "../styles/Styles";

/**
 * VARIABLES
 */
var screen = Dimensions.get("window");
const { width: screenWidth } = Dimensions.get("window");
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);



/**
 * CLASSE
 */
export default class PhfAccordion extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeSections: [],
      focusHeader: -1
    };
    // this._callAction = this._callAction.bind(this);
  }

  _callAction = action => {
    this.props.callAction(action);
  };

  _renderHeader = (item, index) => {
    /* détermination de l'index du header actif */
    const buttonFocus =
      this.state.activeSections.length === 0
        ? -1
        : this.state.activeSections - index;
    if (buttonFocus === 0) {
      this.state.focusHeader = index;
    }

    return (
      <View>
        <Text
          style={[
            Styles.buttonText,
            {
              backgroundColor:
                buttonFocus === 0
                  ? this.props.buttonBorderColor
                  : this.props.headerColor,
              height: 50,
              borderColor:
              buttonFocus === 0
                  ? this.props.headerFocusBorderColor
                  : this.props.headerBorderColor,
              borderWidth:1,
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

    return item.content ? (
      <View style={{ height: "auto", marginTop: 10, marginBottom: 10 }}>
        <AnimatedFlatList
          data={item.content}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ itemc, index }) => (
            <TouchableOpacity
              style={[styles.button]}
            >
              <Button
                onPress={() => this._callAction(item.action[index])}
                buttonStyle={[
                  Styles.buttonText,
                  {
                    height: 30,
                    backgroundColor: "transparent",
                    alignSelf: "center",
                    width: this.props.buttonWidth,
                    borderColor: buttonColor,
                    borderWidth: 1,
                    borderRadius: this.props.borderRadius,
                    margin: 10
                  }
                ]}
                large
                loadingRight
                title={item.content[index]}
              />
            </TouchableOpacity>
          )}
        />
      </View>
    ) : index === this.state.focusHeader ? (
      this._callAction(item.action[0])
    ) : null;
  };

  _updateSections = activeSections => {
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
    alignItems: "center",
    flexGrow: 1,
    justifyContent: "center"
  },
});

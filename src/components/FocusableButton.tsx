import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TextStyle,
  ViewStyle,
} from 'react-native';

interface Props {
  onPress: () => void;
  containerStyle?: ViewStyle;
  textStyle?: TextStyle;
  focusStyle?: ViewStyle;
  disabled: boolean;
  title: string;
}

interface State {
  isFocused: boolean;
}

class FocusableButton extends Component<Props, State> {
  static defaultProps = {
    disabled: false,
  };

  constructor(props: Props) {
    super(props);
    this.state = { isFocused: false };
  }

  render() {
    const containerStyle = [
      styles.container,
      this.state.isFocused && this.props.focusStyle,
      this.props.containerStyle,
      this.props.disabled && styles.disabled,
    ];

    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={this.props.onPress}
        onFocus={() => this.setState({ isFocused: true })}
        onBlur={() => this.setState({ isFocused: false })}
        disabled={this.props.disabled}
      >
        <Text style={this.props.textStyle}>
          {this.props.title}
        </Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
  },
  disabled: {
    backgroundColor: '#777',
  },
});

export default FocusableButton;

import React, { Component, RefObject } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface Props {
  onChangeText: (text: string) => void;
}

interface State {
  isFocused: boolean;
  value: string;
}

class SearchBar extends Component<Props, State> {
  containerRef: RefObject<TextInput>;

  constructor(props: Props) {
    super(props);
    this.containerRef = React.createRef();
    this.state = {
      isFocused: false,
      value: '',
    };
  }

  getValue = () => {
    return this.state.value;
  };

  onChangeText = (text: string) => {
    if (this.props.onChangeText) {
      this.props.onChangeText(text);
    }
    this.setState({ value: text });
  };

  render() {
    return (
      <View
        ref={this.containerRef}
        style={[styles.container, this.state.isFocused && styles.isFocused]}
      >
        <TextInput
          style={styles.input}
          placeholder="Search"
          onChangeText={this.onChangeText}
          value={this.state.value}
          onFocus={() => this.setState({ isFocused: true })}
          onBlur={() => this.setState({ isFocused: false })}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    borderColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    height: 40,
    width: '50%',
  },
  isFocused: {
    borderColor: '#9BB8B7',
  },
  input: {
  },
});

export default SearchBar;

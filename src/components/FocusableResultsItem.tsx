import React, { Component, RefObject } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FocusManager } from '@youi/react-native-youi';
import { SearchResult } from '../types';

const NUM_COLUMNS = 4;

interface Props {
  item: SearchResult;
  onBlur?: (component: FocusableResultsItem) => void;
  onFocus?: (component: FocusableResultsItem) => void;
  onPress: () => void;
  ref?: RefObject<FocusableResultsItem>;
}

interface State {
  isFocused: boolean;
}

class FocusableResultsItem extends Component<Props, State> {
  rootContainerRef: RefObject<TouchableOpacity>;

  static defaultProps = {
    onPress: () => null,
  };

  constructor(props: Props) {
    super(props);
    this.state = { isFocused: false };
    this.rootContainerRef = React.createRef<TouchableOpacity>();
  }

  getRef = () => this.rootContainerRef;

  onBlur = () => {
    this.setState({ isFocused: false });
    this.props.onBlur && this.props.onBlur(this);
  }

  onFocus = () => {
    this.setState({ isFocused: true });
    this.props.onFocus && this.props.onFocus(this);
  }

  render() {
    const { item }: { item: SearchResult } = this.props;

    if (item && item.urls) {
      const containerStyles = [
        styles.container,
        styles.containerWithContent,
        this.state.isFocused && styles.selectedItem,
      ];

      return (
        <TouchableOpacity
          ref={this.rootContainerRef}
          style={containerStyles}
          activeOpacity={1.0}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onPress={this.props.onPress}
        >
          <View style={styles.imageContainer}>
            <Image
              source={{ uri: item.urls.thumb }}
              style={styles.image}
            />
          </View>
          <View style={styles.imageFooter}>
            <Text
              style={styles.description}
              ellipsizeMode="head"
            >
              {item.description}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    return <View style={styles.container} />;
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 4,
    flex: 1 / NUM_COLUMNS,
    aspectRatio: 1,
  },
  containerWithContent: {
    borderWidth: 2,
    borderColor: '#9BB8B7',
    borderRadius: 6,
    overflow: 'hidden',
    alignItems: 'center',
  },
  selectedItem: {
    backgroundColor: '#9BB8B7',
  },
  imageContainer: {
    width: '70%',
    aspectRatio: 1,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
  },
  imageFooter: {
    margin: 4,
    height: '14%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    maxHeight: '100%',
    fontSize: 8,
    textAlign: 'center',
  },
});

export default FocusableResultsItem;

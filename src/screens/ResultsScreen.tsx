import React, { Component, RefObject } from 'react';
import { findNodeHandle, FlatList, InteractionManager, StyleSheet, View } from 'react-native';
import { NavigationEvents, NavigationScreenProp } from 'react-navigation';

import { connect } from 'react-redux';
import { FocusManager } from '@youi/react-native-youi';
import FocusableResultsItem from '../components/FocusableResultsItem';
import { fillArray } from '../helpers';

import { SearchResult } from '../types';
import { ReduxState } from '../reducers';

const { searchResultsColumns: NUM_COLUMNS } = require('../../config');

interface Props {
  navigation: NavigationScreenProp<any>;
  results: SearchResult[];
}

interface State {
  currentlySelectedItem?: FocusableResultsItem;
}

class ResultsScreen extends Component<Props, State> {
  firstItemRef: RefObject<FocusableResultsItem>;

  constructor(props: Props) {
    super(props);
    this.firstItemRef = React.createRef<FocusableResultsItem>();
    this.state = { currentlySelectedItem: undefined };
  }

  onItemPress = () => {
    this.props.navigation.navigate('PlayerScreen');
  };

  onItemFocus = (currentlySelectedItem: FocusableResultsItem) => {
    this.setState({ currentlySelectedItem });
  };

  onScreenDidFocus = () => {
    FocusManager.setFocusRoot(findNodeHandle(this), true);
    if (this.state.currentlySelectedItem) {
      FocusManager.focus(findNodeHandle(this.state.currentlySelectedItem));
    }
  };

  onScreenWillBlur = () => {
    FocusManager.setFocusRoot(findNodeHandle(this), false);
  };

  renderItem = ({ item, index }: { item : SearchResult, index: number }) => {
    const extraProps: { ref?: RefObject<FocusableResultsItem> } = {};

    if (index === 0) {
      extraProps['ref'] = this.firstItemRef;
    }

    return (
      <FocusableResultsItem
        item={item}
        onPress={this.onItemPress}
        onFocus={this.onItemFocus}
        {...extraProps}
      />
    );
  };

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      const ref = this.firstItemRef.current;
      ref && FocusManager.focus(ref.getRef().current);
    });
  }

  render() {
    return (
      <View
        style={styles.container}
      >
        <NavigationEvents
          onDidFocus={this.onScreenDidFocus}
          onWillBlur={this.onScreenWillBlur}
        />
        <FlatList
          data={this.props.results}
          keyExtractor={item => item.id}
          renderItem={this.renderItem}
          numColumns={NUM_COLUMNS}
        />
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

const mapStateToProps = (state: ReduxState) => ({
  results: fillArray(state.photos.results, NUM_COLUMNS),
});

export default connect(mapStateToProps)(ResultsScreen);

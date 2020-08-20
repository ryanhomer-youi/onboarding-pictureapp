import React, { Component, RefObject } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NavigationScreenProp } from 'react-navigation';
import { connect } from 'react-redux';
import { FocusManager } from '@youi/react-native-youi';
import { searchPhotos, setSearchPhotoError } from '../actions/photos';
import FocusableSearchBar from '../components/FocusableSearchBar';
import FocusableButton from '../components/FocusableButton';
import { QueryOptions, SearchResult } from '../types';
import { ReduxState } from '../reducers';

const Separator = () => <View style={styles.separator} />;

interface ComponentProps {
  navigation: NavigationScreenProp<any>;
  results: SearchResult[];
  error: string;
}

interface StateProps {
  results: SearchResult[];
  error: string | null;
}

interface DispatchProps {
  searchPhotos: (query: QueryOptions) => void;
  setSearchPhotoError: (msg?: string) => void;
}

type Props = ComponentProps & StateProps & DispatchProps;

interface State {
  searchText: string;
}

class SearchScreen extends Component<Props, State> {
  searchInputRef: RefObject<FocusableSearchBar>;

  constructor(props: Props) {
    super(props);
    this.searchInputRef = React.createRef();
    this.state = { searchText: '' };
  }

  search = () => {
    console.log(this.state.searchText);
    this.props.searchPhotos({ query: this.state.searchText });
  };

  componentDidMount() {
    this.props.setSearchPhotoError();

    // Set initial focus on search bar
    FocusManager.focus(this.searchInputRef.current);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.results !== this.props.results) {
      this.props.navigation.navigate('ResultsScreen');
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <FocusableSearchBar
          ref={this.searchInputRef}
          onChangeText={text => this.setState({ searchText: text })}
        />
        <Separator />
        <FocusableButton
          containerStyle={styles.buttonContainer}
          textStyle={styles.buttonText}
          focusStyle={styles.buttonFocused}
          title="Search"
          onPress={this.search}
          disabled={!this.state.searchText}
        />
        <Separator />
        {this.props.error ? (
          <Text style={styles.error}>{this.props.error}</Text>
        ) : null}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#595B6F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {},
  separator: {
    marginVertical: 8,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 2,
    backgroundColor: '#9BB8B7',
    borderRadius: 2,
  },
  buttonText: {
    color: '#3F84E7',
  },
  buttonFocused: {
    borderColor: '#3F84E7',
    borderWidth: 2,
  },
  error: {
    color: 'red'
  }
});

const mapStateToProps = (state: ReduxState): StateProps => ({
  results: state.photos.results,
  error: state.photos.error,
});

const mapDispatchToProps = {
  searchPhotos,
  setSearchPhotoError,
};

export default connect<StateProps, DispatchProps>
  (mapStateToProps, mapDispatchToProps)(SearchScreen);

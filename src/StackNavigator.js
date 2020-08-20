import { createStackNavigator } from 'react-navigation';
import SearchScreen from './screens/SearchScreen';
import ResultsScreen from './screens/ResultsScreen';
import PlayerScreen from './screens/PlayerScreen';

export default createStackNavigator(
  {
    SearchScreen: {
      screen: SearchScreen,
    },
    ResultsScreen: {
      screen: ResultsScreen,
    },
    PlayerScreen: {
      screen: PlayerScreen,
    },
  },
  {
    headerMode: 'none',
  },
);

import React from 'react';
import { Provider } from 'react-redux';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import StackNavigator from './StackNavigator';
import reducers from './reducers';
import * as middleware from './api/';

const defaultMiddlewareStack = [
  middleware.photos,
];

const rootReducer = combineReducers(reducers);
const enhancer = composeWithDevTools({})(applyMiddleware(...defaultMiddlewareStack));
const store = createStore(rootReducer, enhancer);

export default () => (
  <Provider store={store}>
    <StackNavigator />
  </Provider>
);

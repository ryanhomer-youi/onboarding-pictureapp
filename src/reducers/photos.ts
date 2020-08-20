import { createReducerHandler } from '../helpers';
import { SearchResult } from '../types';

export interface State {
  results: SearchResult[];
  error: string | null;
}

export const initialState: State = {
  results: [],
  error: null,
};

export const setSearchResults = (state: State, action) => {
  const results = action.payload.results.map(result => ({
    id: result.id,
    description: result.description,
    urls: result.urls,
  }));

  return {
    ...state,
    results,
  };
};

const setSearchError = (state: State, action) => {
  const { msg } = action.payload;
  return {
    ...state,
    error: msg,
  };
};

const reducersMap = {
  PHOTOS_SEARCHRESULTS_SET: setSearchResults,
  PHOTOS_SEARCH_ERROR: setSearchError,
};

export default createReducerHandler(reducersMap, initialState);

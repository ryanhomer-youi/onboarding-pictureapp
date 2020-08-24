import { initialState, setSearchResults } from '../photos';
import { setSearchPhotoResults } from '../../actions/photos';

const sampleResponse = require('./sampleResponse');

describe('setSearchResults', () => {
  test('', () => {
    const action = setSearchPhotoResults(sampleResponse);
    const newState = setSearchResults(initialState, action);
    expect(newState).toBeTruthy();
    expect(newState.results).toHaveLength(10);
    expect(Object.keys(newState.results[0])).toHaveLength(3);
  });
});

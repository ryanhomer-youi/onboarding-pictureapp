import { createMiddlewareHandler } from '../helpers';
import { baseConnector as conn } from '../network/connector';
import { setSearchPhotoResults, setSearchPhotoError } from '../actions/photos';

const apiSearch = conn('search/photos');

const searchPhotos = ({ dispatch, action }) => {
  apiSearch().read({ data: action.payload }).then(response => {
    const { results } = response;
    if (results && Array.isArray(results) && results.length) {
      dispatch(setSearchPhotoResults(response));
    } else {
      dispatch(setSearchPhotoError('No Results Found'));
    }
  }).catch(error => {
    console.error(error);
    dispatch(setSearchPhotoError('Unexpected Error'));
  });
};

const actionsMap = {
  PHOTOS_SEARCH: searchPhotos,
};

export default createMiddlewareHandler(actionsMap);

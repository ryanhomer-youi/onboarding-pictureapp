import photoReducer, { State as PhotosState } from './photos';

export interface ReduxState {
  photos: PhotosState;
}

export default {
  photos: photoReducer,
};

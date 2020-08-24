import { QueryOptions, QueryResponse } from '../types';

export const searchPhotos = (queryOptions: QueryOptions) => ({
  type: 'PHOTOS_SEARCH',
  payload: queryOptions,
});

export const setSearchPhotoResults = (response: QueryResponse) => ({
  type: 'PHOTOS_SEARCHRESULTS_SET',
  payload: response,
});

export const setSearchPhotoError = (msg: string | null) => ({
  type: 'PHOTOS_SEARCH_ERROR',
  payload: { msg },
});

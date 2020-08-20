import { SearchResult } from './types';

export const createReducerHandler = (reducersMap, initialState) => {
  return function (state = initialState, action) {
    const handler = reducersMap[action.type];
    if (handler) return handler(state, action);
    return state;
  };
};

export const createMiddlewareHandler = (actionsMap) => {
  if (typeof actionsMap !== 'object') {
    console.error('API middleware handler did not receive expected map!');

    // Return a no-op handler so we don't break the processing chain
    return () => next => action => next(action);
  }

  return ({ dispatch, getState }) => next => action => {
    const fn = actionsMap[action.type];
    if (fn) {
      fn({
        dispatch,
        getState,
        action,
      });
    }
    return next(action);
  };
};

export function fillArray(arr: SearchResult[], divisibleBy: number): SearchResult[] {
  const numMissing = arr.length % divisibleBy;
  const missing = new Array(numMissing).fill({});
  return [
    ...arr,
    ...missing,
  ];
}

export function formatMsToHMS(ms: number) {
  const zeroPad = (num: number) => `${num}`.padStart(2, '0');
  const h = Math.floor(ms/36e5);
  const ms_rem = ms - h*36e5;
  const m = Math.floor(ms_rem/6e4);
  const s = Math.floor((ms_rem - m*6e4)/1e3);
  return `${zeroPad(h)}:${zeroPad(m)}:${zeroPad(s)}`;
};

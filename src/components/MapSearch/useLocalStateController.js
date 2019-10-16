import { useMemo, useReducer } from 'react';
import api from 'api';

/** @typedef {import('api/index').Parcel} */

const initialState = {
  errorMessage: '',
  isSearchInProgress: false,

  /** @type {Array<Parcel>} */
  searchResults: [],
};

/** @typedef {typeof initialState} State */

/**
 * @typedef {Object} Action
 * @property {string} type
 * @property {any} payload
 * @property {boolean} [error]
 */

/**
 * @param {State} state
 * @param {Action} action
 * @returns {State}
 */
function reducer(state, action) {
  switch (action.type) {
    case 'BEGIN_SEARCH':
      // Clear previous search results and show loading indicator
      return {
        ...state,
        isSearchInProgress: true,
        searchResults: [],
        errorMessage: '',
      };

    case 'HANDLE_RESULTS':
      if (action.error) {
        return {
          ...state,
          isSearchInProgress: false,
          errorMessage: 'An error occurred',
        };
      }

      // No error
      return {
        ...state,
        isSearchInProgress: false,
        searchResults: action.payload,
      };

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

function makeController(dispatch) {
  return {
    /**
     * Performs a parcel search with the backend
     * @param {string} queryText
     */
    doParcelSearch(queryText) {
      // Update state to indicate that there is a search in progress
      dispatch({ type: 'BEGIN_SEARCH' });

      // Perform the API request
      api.parcels.search(queryText)
        .then(results => {
          // Request was successful. Store results in state.
          dispatch({
            type: 'HANDLE_RESULTS',
            payload: results,
          });
        })
        .catch(() => {
          // Request was unsuccessful.
          dispatch({
            type: 'HANDLE_RESULTS',
            error: true,
          });
        });
    },
  };
}

/** Creates a "controller" to store and manage state */
export default function useLocalStateController() {
  const [state, dispatch] = useReducer(reducer, initialState);

  const controller = useMemo(
    () => makeController(dispatch),
    [],
  );

  return useMemo(
    () => ({
      ...controller,
      ...state,
    }),
    [controller, state],
  );
}

// @ts-check
import { useCallback, useMemo } from 'react';
import api from 'api';
import useSetState from 'hooks/useSetState';

/** @typedef {import('api').SurroundingParcel} SurroundingParcel */

const initialState = {
  errorMessage: '',
  isSearchInProgress: false,

  /** @type {Array<SurroundingParcel>} */
  searchResults: [],
};

/** @param {number | string} parcelId */
export default function useDistanceSearchStore(parcelId) {
  const [state, setState] = useSetState(initialState);

  const search = useCallback(
    /** @param {number | string} distance */
    async distance => {
      if (!parcelId) return;

      setState({
        errorMessage: '',
        isSearchInProgress: true,
        searchResults: [],
      });

      try {
        const searchResults = await api.parcels.getSurroundingParcels(parcelId, distance);

        // Store results in state
        setState({
          isSearchInProgress: false,
          searchResults,
        });
      } catch {
        // Request was unsuccessful
        setState({
          isSearchInProgress: false,
          errorMessage: 'An error occurred',
        });
      }
    },
    [parcelId, setState],
  );

  const clearSearchResults = useCallback(
    () => { setState({ searchResults: [] }); },
    [setState],
  );


  const store = useMemo(
    () => ({
      ...state,

      // Actions
      clearSearchResults,
      search,
    }),
    [clearSearchResults, search, state],
  );

  return store;
}

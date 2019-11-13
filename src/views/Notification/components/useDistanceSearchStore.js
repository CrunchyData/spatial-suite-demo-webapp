// @ts-check
import { useCallback, useMemo } from 'react';
import api from 'api';
import useSetState from 'hooks/useSetState';

/** @typedef {import('api').SurroundingParcel} SurroundingParcel */

const initialState = {
  errorMessage: '',
  isSearchInProgress: false,
  distance: '',

  /** @type {Array<SurroundingParcel>} */
  searchResults: [],
};

/** @param {number | string} parcelId */
export default function useDistanceSearchStore(parcelId) {
  const [state, setState] = useSetState(initialState);

  const search = useCallback(
    /** @param {number | string} distance */
    async () => {
      if (!parcelId) return;

      setState({
        errorMessage: '',
        isSearchInProgress: true,
        searchResults: [],
      });

      try {
        const searchResults = await api.parcels.getSurroundingParcels(parcelId, state.distance);

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
    [parcelId, setState, state.distance],
  );

  const clearSearchResults = useCallback(
    () => { setState({ searchResults: [] }); },
    [setState],
  );

  const setDistance = useCallback(
    distance => { setState({ distance }); },
    [setState],
  );

  const handleFormSubmit = useCallback(
    event => {
      event.preventDefault();
      search();
    },
    [search],
  );


  const store = useMemo(
    () => ({
      ...state,

      // Actions
      clearSearchResults,
      handleFormSubmit,
      search,
      setDistance,
    }),
    [clearSearchResults, handleFormSubmit, search, setDistance, state],
  );

  return store;
}

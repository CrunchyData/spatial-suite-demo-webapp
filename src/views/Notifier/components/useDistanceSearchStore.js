// @ts-check
import { useMemo } from 'react';
import api from 'api';
import useSetState from '../../../hooks/useSetState';

/** @typedef {import('api').Parcel} Parcel */

const initialState = {
  errorMessage: '',
  isSearchInProgress: false,

  /** @type {Array<Parcel>} */
  searchResults: [],
};

export default function useDistanceSearchStore() {
  const [state, setState] = useSetState(initialState);

  const actions = useMemo(
    () => {
      /** @param {number} parcelId */
      /** @param {number} distance */
      async function search(parcelId, distance) {
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
      }

      function clearSearchResults() {
        setState({ searchResults: [] });
      }

      return { search, clearSearchResults };
    },
    [setState],
  );

  const store = useMemo(
    () => ({
      ...state,
      ...actions,
    }),
    [actions, state],
  );

  return store;
}

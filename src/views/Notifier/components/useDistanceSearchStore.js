// @ts-check
import { useMemo } from 'react';
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

  const actions = useMemo(
    () => {
      /** @param {number} distance */
      async function search(distance) {
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
      }

      function clearSearchResults() {
        setState({ searchResults: [] });
      }

      return {
        clearSearchResults,
        search,
      };
    },
    [parcelId, setState],
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

// @ts-check
import { useMemo } from 'react';
import api from 'api';
import useSetState from '../../hooks/useSetState';

/** @typedef {import('api').ParcelCoords} ParcelCoords */

const initialState = {
  errorMessage: '',
  isLoading: false,

  /** @type {ParcelCoords | null} */
  searchResult: null,
};

export default function useAddressSearchStore() {
  const [state, setState] = useSetState(initialState);

  const actions = useMemo(
    () => {
      /**
       * Looks up an address with the geocoder
       * @param {string} address
       */
      async function search(address) {
        if (address) {
          setState({
            errorMessage: '',
            isLoading: true,
          });

          try {
            const searchResult = await api.parcels.getParcelCoords(address);
            setState({
              isLoading: false,
              searchResult,
            });
          } catch {
            // Request was unsuccessful
            setState({
              isLoading: false,
              errorMessage: 'An error occurred',
            });
          }
        }
      }

      function clearSearchResult() {
        setState({ searchResult: null });
      }

      return { clearSearchResult, search };
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

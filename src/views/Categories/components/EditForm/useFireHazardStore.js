// @ts-check
import { useMemo, useEffect } from 'react';
import api from 'api';
import useSetState from '../../../../hooks/useSetState';

const initialState = {
  errorMessage: '',
  isFireHazard: false,
  isFetchingStatus: false,
  isSubmittingStatus: false,
};

/** @param {number | string} parcelId */
export default function useFireHazardStore(parcelId) {
  const [state, setState] = useSetState(initialState);

  useEffect(
    () => {
      if (parcelId) {
        setState({ isFetchingStatus: true });

        api.parcels.getFireHazardStatus(parcelId)
          .then(fireHazardStatus => {
            setState({
              isFireHazard: fireHazardStatus,
              isFetchingStatus: false,
            });
          });
      }
    },
    [parcelId, setState],
  );

  const actions = useMemo(
    () => {
      function submit() {
        setState({ isSubmittingStatus: true });

        return api.parcels.setFireHazardStatus(parcelId, state.isFireHazard)
          .then(() => {
            setState({
              isSubmittingStatus: false,
            });
          });
      }

      function setFireHazard(isFireHazard) {
        setState({ isFireHazard });
      }

      return { submit, setFireHazard };
    },
    [parcelId, state.isFireHazard, setState],
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

// @ts-check
import { useMemo, useEffect } from 'react';
import api from 'api';
import useSetState from '../../../../hooks/useSetState';

const initialState = {
  errorMessage: '',
  isFireHazardStr: '',
  isFetchingStatus: false,
  isSubmittingStatus: false,
};

/** @param {string} isFireHazard */
/** @param {number | string} parcelId */
export default function useFireHazardStore(isFireHazard, parcelId) {
  const [state, setState] = useSetState(initialState);

  useEffect(
    () => {
      setState({ isFetchingStatus: true });

      api.parcels.getFireHazardStatus(parcelId)
        .then(fireHazardStatus => {
          setState({
            isFireHazardStr: fireHazardStatus.firehazard,
            isFetchingStatus: false,
          });
        });
    },
    [parcelId, setState],
  );

  const actions = useMemo(
    () => {
      function submit() {
        setState({ isSubmittingStatus: true });

        api.parcels.setFireHazardStatus(isFireHazard, parcelId)
          .then(fireHazardStatus => {
            setState({
              isFireHazardStr: fireHazardStatus.firehazard,
              isSubmittingStatus: false,
            });
          });
      }

      return { submit };
    },
    [isFireHazard, parcelId, setState],
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

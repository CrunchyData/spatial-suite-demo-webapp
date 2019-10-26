import React, {
  useCallback, useEffect, useLayoutEffect, useRef,
} from 'react';
import CrunchyMap from './CrunchyMap';
import styles from './index.module.scss';

/** @typedef {import('ol/Map').default} MapInstance */
/** @typedef {import('api').Parcel} Parcel */

/**
 * Callback that gets called when the user clicks a parcel in the map
 * @callback ParcelClickHandler
 * @param {Parcel} parcel - The parcel that was clicked
 * @returns {void}
 */

/**
 * OpenLayers map component
 * @param {Object} props
 * @param {ParcelClickHandler} [props.onParcelClick]
 */
const ParcelMap = ({ onParcelClick }) => {
  const refMapContainer = useRef(null);
  const refPopupCloser = useRef(null);
  const refPopupContainer = useRef(null);
  const refPopupContent = useRef(null);

  // In case we need to access the Map instance at some point
  /** @type {React.MutableRefObject<MapInstance | null>} MapInstanceRef */
  const refMapInstance = useRef(null);

  // This is our layout effect's only dependency.
  // We'll stabilize the reference here, so the map instance's `onParcelClick` will always work.
  // This also prevents re-instantiating a map if our `onParcelClick` reference changes
  const handleParcelClick = useStabilizedCallback(onParcelClick);

  useLayoutEffect(
    () => {
      // Make sure all refs have been assigned elements before attempting instantiate the map
      const areAllRefsAssigned = [
        refMapContainer,
        refPopupCloser,
        refPopupContainer,
        refPopupContent,
      ].every(ref => ref.current);

      if (areAllRefsAssigned) {
        refMapInstance.current = CrunchyMap({
          mapContainer: refMapContainer.current,
          popupCloser: refPopupCloser.current,
          popupContainer: refPopupContainer.current,
          popupContent: refPopupContent.current,
          onParcelClick: handleParcelClick,
        });
      }
    },
    [handleParcelClick],
  );

  return (
    <>
      <div ref={refMapContainer} className={styles.container} />
      <div ref={refPopupContainer} className={styles.popupContainer}>
        <button
          type="button"
          className={styles.popupCloser}
          ref={refPopupCloser}
          aria-label="close popup"
        />
        <div ref={refPopupContent} />
      </div>
    </>
  );
};

/**
 * @param {T} callback
 * @template {Function} T
 * @returns {T} A callback with a stable reference, even if the input callback has an "unstable"
 *     reference
 */
function useStabilizedCallback(callback) {
  const handlerRef = useRef(callback);

  // Update the ref if the callback changes
  useEffect(
    () => { handlerRef.current = callback; },
    [callback],
  );

  // This callback's reference will never change since the external callback is stored in the ref
  /** @type {T} */
  const stableCallback = useCallback(
    (...params) => handlerRef.current(...params),
    [], // empty deps, so the reference never changes
  );

  return stableCallback;
}

export default ParcelMap;

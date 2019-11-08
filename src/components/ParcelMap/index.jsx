// @ts-check
import React, {
  useCallback, useEffect, useLayoutEffect, useRef,
} from 'react';
import 'ol/ol.css';
import CrunchyMap from './CrunchyMap';
import styles from './index.module.scss';

/** @typedef {ReturnType<typeof CrunchyMap>} CrunchyMapInstance */
/** @typedef {import('api').ParcelCoords} ParcelCoords */
/** @typedef {import('./CrunchyMap').ParcelFromMap} ParcelFromMap */
/** @typedef {import('api').SurroundingParcel} SurroundingParcel */

/**
 * Callback that gets called when the user clicks a parcel in the map
 * @callback ParcelClickHandler
 * @param {ParcelFromMap} parcel - The parcel that was clicked
 * @returns {void}
 */

/**
 * OpenLayers map component
 * @param {Object} props
 * @param {Array<SurroundingParcel>} [props.surroundingParcels]
 * @param {ParcelClickHandler} [props.onParcelClick]
 * @param {ParcelCoords | null} [props.parcelCoords]
 */

const ParcelMap = ({ surroundingParcels, onParcelClick = noop, parcelCoords }) => {
  const refMapContainer = useRef(null);

  // In case we need to access the Map instance at some point
  /** @type {React.MutableRefObject<CrunchyMapInstance | null>} MapInstanceRef */
  const refMapInstance = useRef(null);

  // This is our layout effect's only dependency.
  // We'll stabilize the reference here, so the map instance's `onParcelClick` will always work.
  // This also prevents re-instantiating a map if our `onParcelClick` reference changes
  const handleParcelClick = useStabilizedCallback(onParcelClick);

  useLayoutEffect(
    () => {
      const hasMapContainer = Boolean(refMapContainer.current);

      if (hasMapContainer) {
        refMapInstance.current = CrunchyMap({
          mapContainer: refMapContainer.current,
          onParcelClick: handleParcelClick,
        });
      }
    },
    [handleParcelClick],
  );

  useEffect(
    () => {
      const mapInstance = refMapInstance.current;
      if (surroundingParcels && mapInstance) {
        refMapInstance.current.selectParcels(surroundingParcels);
      }
    },
    [surroundingParcels], // Update the map when these props change
  );

  useEffect(
    () => {
      const mapInstance = refMapInstance.current;
      if (parcelCoords && mapInstance) {
        // TODO: highlight and center the parcel
      }
    },
    [parcelCoords], // Update the map when these props change
  );

  return (
    <div ref={refMapContainer} className={styles.container} />
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
  // @ts-ignore
  const stableCallback = useCallback(
    (...params) => handlerRef.current(...params),
    [], // empty deps, so the reference never changes
  );

  return stableCallback;
}

function noop() {}

export default ParcelMap;

import React, { useLayoutEffect, useRef } from 'react';
import CrunchyMap from './CrunchyMap';
import styles from './index.module.scss';

/** OpenLayers map component */
const ParcelMap = () => {
  const refMapContainer = useRef(null);
  const refPopupCloser = useRef(null);
  const refPopupContainer = useRef(null);
  const refPopupContent = useRef(null);

  // In case we need to access the Map instance at some point
  /** @typedef {import('ol/Map').default} MapInstance */
  /** @type {React.MutableRefObject<MapInstance | null>} MapInstanceRef */
  const refMapInstance = useRef(null);

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
        });
      }
    },
    [],
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

export default ParcelMap;

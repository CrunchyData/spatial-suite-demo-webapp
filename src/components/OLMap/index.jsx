import React, { useLayoutEffect, useRef } from 'react';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import TileLayer from 'ol/layer/Tile';
import View from 'ol/View';
import { fromLonLat } from 'ol/proj';
import styles from './index.module.css';

/** OpenLayers map component */
const OLMap = () => {
  /** @type {React.MutableRefObject<HTMLDivElement | null>} */
  const divRef = useRef(null);

  // In case we need to access the Map instance at some point
  /** @type {React.MutableRefObject<import('ol/Map').default | null>} */
  const mapRef = useRef(null);

  useLayoutEffect(
    () => {
      // Instantiate an OpenLayers map.
      // This is based on their quick start example, but adapted to work in our project.
      // https://openlayers.org/en/latest/doc/quickstart.html
      mapRef.current = new Map({
        target: divRef.current,

        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],

        view: new View({
          center: fromLonLat([-122.0406932, 36.9759548]),
          zoom: 13,
        }),
      });
    },
    [],
  );

  return (
    <div ref={divRef} className={styles.container} />
  );
};

export default OLMap;

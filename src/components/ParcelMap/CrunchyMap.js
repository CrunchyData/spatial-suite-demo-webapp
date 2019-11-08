import { fromLonLat } from 'ol/proj';
import Map from 'ol/Map';
import MVT from 'ol/format/MVT';
import stylefunction from 'ol-mapbox-style/stylefunction';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import WKT from 'ol/format/WKT';
import View from 'ol/View';
import {
  Fill, Stroke, Style, Text,
} from 'ol/style';
import { extend } from 'ol/extent';

/** @typedef {import('ol').MapBrowserEvent} MapBrowserEvent */
/** @typedef {import('./index').ParcelClickHandler} ParcelClickHandler */
/** @typedef {import('api').SurroundingParcel} SurroundingParcel */

/**
 * @typedef {Object} ParcelFromMap
 * @property {string} id
 * @property {string} apn
 * @property {boolean} isFireHazard
 */

const MAP_CENTER = [-122.0283, 37.0405];
const MAP_ZOOM = 16;
const ATTR_APN = 'apn';
const ATTR_FIREHAZ = 'firehazard';
const CLR = {
  selectedStroke: '#8532a8',
  selectedFill: '#8532a830'
};

const URL_BASE_SC = 'http://sc-tileserver-gl-scfire.openshift-pousty-apps.gce-containers.crunchydata.com';
const URL_DATA_SC = 'http://tegola-scfire.openshift-pousty-apps.gce-containers.crunchydata.com';

const URL = {
  base: URL_BASE_SC,
  data: URL_DATA_SC,
};

/**
 * @param {Object} props
 * @param {HTMLDivElement} props.mapContainer
 * @param {ParcelClickHandler} [props.onParcelClick]
 */
export default function CrunchyMap(props) {
  const {
    mapContainer,
    onParcelClick = noop,
  } = props;

  /** lookup for highlighted objects  - number value of id */
  let highlightID = null;

  const map = new Map({
    target: mapContainer,
    view: new View({
      center: fromLonLat(MAP_CENTER),
      zoom: MAP_ZOOM,
    }),
  });

  const layerBase = new VectorTileLayer({
    declutter: true,
    source: new VectorTileSource({
      format: new MVT(),
      url: `${URL.base}/data/v3/{z}/{x}/{y}.pbf`,
      maxZoom: 14,
    }),
  });

  fetchGlStyle().then(glStyle => {
    stylefunction(
      layerBase,
      glStyle,
      'openmaptiles',  // source id from style file - shows all layers
      // ['landuse-residential', 'park', 'water']  // can specify individual layers
    );
  });

  const layerData = new VectorTileLayer({
    className: 'dataLayer', // needed to avoid base labels disappearing?
    style: dataStyle,
    declutter: true,
    minZoom: 15,
    source: new VectorTileSource({
      format: new MVT(),
      url: `${URL.data}/maps/parcels/{z}/{x}/{y}.pbf`,
      minZoom: 16,
      maxZoom: 16,
    }),
  });
  const layerSelect = new VectorLayer({
    style: createStyleSelected,
    source: new VectorSource({
      features: []
    })
  });

  map.addLayer(layerBase);
  map.addLayer(layerData);
  map.addLayer(layerSelect);

  selectParcels();

  function dataStyle(feature) {
    if (isHighlighted(feature.id_)) {
      return createStyleHighlight(feature);
    }
    if (feature.get(ATTR_FIREHAZ) === 'Yes') {
      return createStyleFire(feature);
    }
    return createStyleParcel(feature);
  }

  map.on('singleclick', evt => {

    const features = map.getFeaturesAtPixel(evt.pixel);
    const feature = features ? features[0] : null;

    if (!feature || feature.get('layer') !== 'parcels') {
      return;
    }

    const featid = feature.getId();
    highlightParcel( featid, evt.coordinate );

    const parcelId = feature.getId().toString();
    const isFireHazard = feature.get(ATTR_FIREHAZ) === 'Yes';

    /** @type {ParcelFromMap} */
    const parcel = {
      id: parcelId,
      apn: feature.get(ATTR_APN),
      isFireHazard,
    };

    onParcelClick(parcel);
  });

  function isHighlighted(id) {
    if (! highlightID) return false;
    return id === highlightID;
  }

  // coordinate must be in map coordinate system (Web Mercator)
  function highlightParcel(id, coordinate = null) {
    // add selected feature to lookup
    highlightID = id || null;
    if (coordinate) {
      map.getView().setCenter( coordinate );
    }
    // force redraw of layer style
    layerData.setStyle(layerData.getStyle());
  }

  /** Highlights a parcel from geo coordinates */
  function highlightParcelGeo(id, coords) {
    // convert geo coords to Web Mercator
    const wmCoords = fromLonLat(coords);
    highlightParcel(id, wmCoords);
  }

  /**
   * Highlights selected parcels
   * @param {Array<SurroundingParcel>} [parcels] - Array of parcels
   */
  function selectParcels(parcels = []) {
    let features = parseParcelFeatures( parcels );
    layerSetFeatures( layerSelect, features );
    zoomToExtent( map, featuresExtent( features ));
  }

  return {
    olMap: map,
    highlightParcelGeo,
    selectParcels,
  };
}

async function fetchGlStyle() {
  const response = await fetch(`${URL.base}/styles/osm-bright/style.json`);
  return response.json();
}

const styleSelected = new Style({
  fill: new Fill({ color: CLR.selectedFill }),
  stroke: new Stroke({
      color: CLR.selectedStroke,
      width: 3
  })
});

function createStyleSelected() {
  return styleSelected;
}

function createStyleHighlight(feature) {
  return new Style({
    fill: new Fill({ color: 'rgba(200,200,20,0.2)' }),
    stroke: new Stroke({
      color: 'rgba(255,255,20,1)', width: 3,
    }),
    text: new Text({
      text: `${feature.id_}`,
      font: '14px sans-serif',
      fill: new Fill({ color: '#000000' }),
    }),
  });
}

function createStyleParcel(feature) {
  return new Style({
    // must specify fill for hit-detection
    fill: new Fill({ color: '#80ff8001' }),
    stroke: new Stroke({
      color: '#007000',
    }),
    text: new Text({
      text: `${feature.id_}`,
      fill: new Fill({ color: '#007000' }),
    }),
  });
}

function createStyleFire(feature) {
  return new Style({
    fill: new Fill({
      color: '#ff000020',
    }),
    stroke: new Stroke({
      color: '#ff0000',
      width: 2,
    }),
    text: new Text({
      text: `${feature.id_}`,
      fill: new Fill({
        color: '#000000',
      }),
    }),
  });
}

const FORMAT_WKT = new WKT();

function layerSetFeatures(lyr, features = []) {
    let source = lyr.getSource();
    source.clear();
    source.addFeatures( features );
}

function zoomToExtent( map, extent, pad = 50 ) {
    if ( ! extent ) return;
    map.getView().fit( extent, { padding: [ pad, pad, pad, pad ] } );
}

function featuresExtent( features ) {
  let extent = null;
  features.forEach(feature => {
      let ext = feature.getGeometry().getExtent();
      extent = extent ? extend(ext, extent) : ext;
  });
  return extent;
}

function parseParcelFeatures( data ) {
  return data.map( item => {
      let wkt = item.geom;
      let feat = FORMAT_WKT.readFeature(wkt, {
          dataProjection: 'EPSG:4326',
          featureProjection: 'EPSG:3857'
        });
      return feat;
  } );
}

function noop() { }

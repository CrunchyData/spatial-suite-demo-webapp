import { fromLonLat } from 'ol/proj';
import Map from 'ol/Map';
import MVT from 'ol/format/MVT';
import stylefunction from 'ol-mapbox-style/stylefunction';
import Overlay from 'ol/Overlay';
import VectorTileLayer from 'ol/layer/VectorTile';
import VectorTileSource from 'ol/source/VectorTile';
import View from 'ol/View';
import {
  Fill, Stroke, Style, Text,
} from 'ol/style';

/** @typedef {import('ol').MapBrowserEvent} MapBrowserEvent */
/** @typedef {import('api').Parcel} Parcel */
/** @typedef {import('./index').ParcelClickHandler} ParcelClickHandler */

const MAP_CENTER = [ -122.0283, 37.0405 ];
const MAP_ZOOM = 16;
const ATTR_APN = 'apn';
const ATTR_FIREHAZ = 'firehazard';

const URL_BASE_SC = 'http://sc-tileserver-gl-scfire.openshift-pousty-apps.gce-containers.crunchydata.com';
const URL_DATA_SC = 'http://tegola-scfire.openshift-pousty-apps.gce-containers.crunchydata.com';

const URL = {
  base: URL_BASE_SC,
  data: URL_DATA_SC,
};

/**
 * @param {Object} props
 * @param {HTMLDivElement} props.mapContainer
 * @param {HTMLButtonElement} props.popupCloser
 * @param {HTMLDivElement} props.popupContainer
 * @param {HTMLDivElement} props.popupContent
 * @param {ParcelClickHandler} [props.onParcelClick]
 */
export default function CrunchyMap(props) {
  const {
    mapContainer,
    popupCloser,
    popupContainer,
    popupContent,
    onParcelClick = noop,
  } = props;

  /** lookup for highlighted objects */
  let highlighted = null;

  /** layer for popups */
  const overlay = new Overlay({
    element: popupContainer,
    autoPan: true,
    autoPanAnimation: {
      duration: 250,
    },
  });

  const map = new Map({
    target: mapContainer,
    overlays: [overlay],
    view: new View({
      center: fromLonLat( MAP_CENTER ),
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
    minZoom: 14,
    source: new VectorTileSource({
      format: new MVT(),
      url: `${URL.data}/maps/parcels/{z}/{x}/{y}.pbf`,
      minZoom: 16,
      maxZoom: 16,
    }),
  });

  map.addLayer(layerBase);
  map.addLayer(layerData);

  function dataStyle(feature) {
    if (isHighlighted(feature)) {
      return createStyleSelected(feature);
    }
    if (feature.get(ATTR_FIREHAZ) === 'Yes') {
      return createStyleFire(feature);
    }
    return createStyleParcel(feature);
  }

  function isHighlighted(feature) {
    if (!highlighted) return false;
    return feature.id_ === highlighted.id_;
  }

  map.on('singleclick', evt => {
    const features = map.getFeaturesAtPixel(evt.pixel);
    const feature = features ? features[0] : null;

    highlightFeature(feature);

    if (! feature || feature.get('layer') !== 'parcels') {
      overlay.setPosition(undefined);
      return;
    }

    const parcelId = feature.getId().toString();
    const isFireHazard = feature.get(ATTR_FIREHAZ) === 'Yes';

    /** @type {Parcel} */
    const parcel = {
      id: parcelId,
      address: `${parcelId} Example St.`,
      apn: feature.get(ATTR_APN),
      isFireHazard,
    };

    showParcelPopup(evt, parcel);
    onParcelClick(parcel);
  });

  function highlightFeature(feature) {
    // add selected feature to lookup
    highlighted = feature || null;

    // force redraw of layer style
    layerData.setStyle(layerData.getStyle());
  }

  // ==================================================
  // Popup
  // see https://openlayers.org/en/latest/examples/popup.html
  // ==================================================

  /**
   * Add a click handler to hide the popup.
   * @return {boolean} Don't follow the href.
   */
  popupCloser.onclick = () => {
    overlay.setPosition(undefined);
    popupCloser.blur();
    return false;
  };

  /**
   * @param {MapBrowserEvent} evt
   * @param {Parcel} parcel
   */
  function showParcelPopup(evt, parcel) {
    const { coordinate } = evt;
    const { id, apn } = parcel;
    popupContent.innerHTML = `<p><b>Parcel ${id}</b></p> <p>APN: ${apn}</p>`;
    overlay.setPosition(coordinate);
  }

  /**
   * Highlights selected parcels
   * @param {Array<Parcel>} [parcels] - Array of parcels
   */
  function highlightParcels(parcels = []) {
    // 1. Clear previously-selected parcels
    // 2. Iterate through the `parcels` array and highlight them?

    // clearHighlightedParcels();
    // parcels.forEach(parcel => {
    //   highlightSingleParcel(parcel);
    // })
  }

  return {
    olMap: map,
    highlightParcels,
  };
}

async function fetchGlStyle() {
  const response = await fetch(`${URL.base}/styles/osm-bright/style.json`);
  return response.json();
}

function createStyleSelected(feature) {
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

function noop() { }

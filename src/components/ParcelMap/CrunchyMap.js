import { fromLonLat } from 'ol/proj';
import Map from 'ol/Map';
import MVT from 'ol/format/MVT';
import stylefunction from 'ol-mapbox-style/stylefunction';
import Overlay from 'ol/Overlay';
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

  /** lookup for highlighted objects  - number value of id */
  let highlightID = null;

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

  highlightParcels();

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
      closePopup();
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

    showParcelPopup( evt.coordinate, parcel );
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

  // ==================================================
  // Popup
  // see https://openlayers.org/en/latest/examples/popup.html
  // ==================================================

  /**
   * Add a click handler to hide the popup.
   * @return {boolean} Don't follow the href.
   */
  popupCloser.onclick = () => {
    closePopup();
    highlightParcel();
    return false;
  };

  /**
   * @param {MapBrowserEvent} evt
   * @param {Parcel} parcel
   */
  function showParcelPopup(coordinate, parcel) {
    const { id, apn } = parcel;
    popupContent.innerHTML = `<p><b>Parcel ${id}</b></p> <p>APN: ${apn}</p>`;
    overlay.setPosition(coordinate);
  }
  function closePopup()
  {
    overlay.setPosition(undefined);
    popupCloser.blur();
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

    // TESTING ONLY
    parcels = MOCK_data;

    let features = parseParcelFeatures( parcels );
    layerSetFeatures( layerSelect, features );
    zoomToExtent( map, featuresExtent( features ));
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

var MOCK_data = [
  {"geom":"MULTIPOLYGON(((-122.009830045604 37.0047355489412,-122.010699938321 37.0046595469035,-122.010785071214 37.0046521074495,-122.01078614592 37.0046585514407,-122.010886363718 37.0052081458374,-122.010913182497 37.0053552399842,-122.011012114153 37.0054948351227,-122.010929094213 37.005512223511,-122.010926366216 37.0055127941425,-122.009917458401 37.0057240959454,-122.009956548677 37.0054405596712,-122.009857514923 37.0050665653437,-122.009830045604 37.0047355489412)))","parcelid":"70207"}
,{"geom":"MULTIPOLYGON(((-122.009748555388 37.0038673112764,-122.009772497609 37.0038666301803,-122.010648818485 37.0038416389195,-122.010734626259 37.003839192341,-122.01073792395 37.0037748220074,-122.010822807117 37.0037904155828,-122.011464043807 37.0039082226452,-122.011550543433 37.0039241128741,-122.011550996111 37.0039328088733,-122.011553943981 37.0039902457,-122.011563054758 37.0041674515735,-122.011315358212 37.0043356865632,-122.011314866431 37.0046034311441,-122.011229241084 37.0046112973175,-122.011227580062 37.004611451306,-122.010872668356 37.0046440592635,-122.010870361315 37.00464427298,-122.010785071214 37.0046521074495,-122.010699938321 37.0046595469035,-122.009830045604 37.0047355489412,-122.009886430618 37.0045565014238,-122.009903101057 37.0044794829355,-122.009911274819 37.0044015885017,-122.009910890986 37.0043234191035,-122.009901951619 37.0042455785098,-122.009884525017 37.004168667828,-122.009858746757 37.0040932809847,-122.009775732482 37.0039230413742,-122.009748555388 37.0038673112764)))","parcelid":"70213"}
,{"geom":"MULTIPOLYGON(((-122.008618510362 37.0041038878153,-122.008636728858 37.0039713985865,-122.008844915701 37.0039920427497,-122.008880032713 37.0039837690165,-122.009266671984 37.0038926932142,-122.00957073208 37.0039270285369,-122.009685274751 37.0041145614563,-122.009697298193 37.0041392200654,-122.009711124094 37.0041778498826,-122.009722358446 37.004217016094,-122.008810914322 37.0041236078289,-122.008618510362 37.0041038878153)))","parcelid":"70237"}
,{"geom":"MULTIPOLYGON(((-122.008618510362 37.0041038878153,-122.008810914322 37.0041236078289,-122.009722358446 37.004217016094,-122.009735677809 37.0042864334044,-122.009740864736 37.0043565444192,-122.009737876569 37.0044267377851,-122.009726738048 37.0044964012751,-122.008777005872 37.0043991434963,-122.008580682098 37.004379039727,-122.008618510362 37.0041038878153)))","parcelid":"70240"}
,{"geom":"MULTIPOLYGON(((-122.008919925576 37.0037715796484,-122.008747307836 37.0035957662497,-122.008866851027 37.0036106886455,-122.008985117856 37.003063235509,-122.009602736435 37.0031472860611,-122.009608639886 37.0031498519587,-122.009520857526 37.0035562072809,-122.009501242969 37.003689873654,-122.009486833975 37.003788056033,-122.009514893609 37.0038354414955,-122.009514792526 37.0038354437045,-122.009062591445 37.0039168866135,-122.008919925576 37.0037715796484)))","parcelid":"70241"}
,{"geom":"MULTIPOLYGON(((-122.005974619639 37.0041527604985,-122.005967233167 37.0031437560529,-122.009064716923 37.0026947660257,-122.008985117856 37.003063235509,-122.008866851027 37.0036106886455,-122.008747307836 37.0035957662497,-122.008919925576 37.0037715796484,-122.009062591445 37.0039168866135,-122.009514792526 37.0038354437045,-122.009514893609 37.0038354414955,-122.009550273293 37.0038935293656,-122.00957073208 37.0039270285369,-122.009266671984 37.0038926932142,-122.008880032713 37.0039837690165,-122.008844915701 37.0039920427497,-122.008636728858 37.0039713985865,-122.008618510362 37.0041038878153,-122.008580682098 37.004379039727,-122.008777005872 37.0043991434963,-122.009726738048 37.0044964012751,-122.009662722043 37.0046742218006,-122.009636687048 37.0047432074765,-122.009618213914 37.0048137444803,-122.009607442534 37.0048853011078,-122.009604453087 37.0049573374144,-122.00841132332 37.0049649514358,-122.007455334738 37.0049710550324,-122.00676812066 37.0049754374805,-122.005979196419 37.0049804645412,-122.005977252986 37.0046275940481,-122.005974664987 37.0041589402492,-122.005974619639 37.0041527604985)))","parcelid":"70242"}
];

function noop() { }

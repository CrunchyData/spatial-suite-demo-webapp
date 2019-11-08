/**
 * Parcel object props
 * @typedef {Object} Parcel
 * @property {string} id
 * @property {string} apn
 * @property {string} address
 * @property {boolean} isFireHazard
 */

/**
  * getSurroundingParcels function props
  * @typedef {Object} SurroundingParcel
  * @property {string} acres
  * @property {string} address
  * @property {string} geom
  * @property {string} parcelid
  */

/**
 * @typedef {Object} ParcelCoords
 * @property {number} lat
 * @property {number} lon
 * @property {number} parcelid
 */

/**
 * @typedef {Object} FireHazardStatus
 * @property {string} firehazard
 * @property {number} parcelid
 */

const urlBase = process.env.NODE_ENV === 'production'
  ? 'http://rest-services-scfire.openshift-pousty-apps.gce-containers.crunchydata.com'
  : '';

/** Parcel search functions */
const api = {
  parcels: {
    /**
     * Simulates an API request to search parcels by address
     * @param {string} address
     * @returns {Promise<ParcelCoords>}
     */
    async getParcelCoords(address) {
      const
        addressEncoded = encodeURI(address),
        url = `${urlBase}/geocode/${addressEncoded}`;

      const response = await fetch(url);
      const json = await response.json();
      return json;
    },
    /**
     * Sends an API request to search parcels by distance
     * @param {number | string} parcelId
     * @param {number | string} distance
     * @returns {Promise<Array<SurroundingParcel>>}
     */
    async getSurroundingParcels(parcelId, distance) {
      const url = `${urlBase}/notify/parcel-and-distance?parcelid=${parcelId}&dist=${distance}`;
      const response = await fetch(url);
      const json = await response.json();
      return json;
    },
    /**
     * Sends an API request to get the firehazard status
     * @param {number | string} parcelId
     * @returns {Promise<FireHazardStatus>}
     */
    async getFireHazardStatus(parcelId) {
      const url = `${urlBase}/parcel/firehazard/${parcelId}`;
      const response = await fetch(url);
      const json = await response.json();
      return json.firehazard;
    },
    /**
     * Sends an API request to set the firehazard status before returning the updated value
     * @param {string} fireHazardStatus
     * @param {number | string} parcelId
     * @returns {Promise<FireHazardStatus>}
     */
    async setFireHazardStatus(fireHazardStatus, parcelId) {
      const url = `${urlBase}/parcel/firehazard/${parcelId}`;
      const response = await fetch(url, {
        method: 'PUT',
        firehazard: fireHazardStatus,
      });
      const json = await response.json();
      return json;
    },
  },
};

export default api;

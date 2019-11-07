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

const urlBase = process.env.NODE_ENV === 'production'
  ? 'http://rest-services-scfire.openshift-pousty-apps.gce-containers.crunchydata.com'
  : '';

/** Parcel search functions */
const api = {
  parcels: {
    /**
     * Simulates an API request to search parcels by address
     * @param {string} queryText
     * @returns {Promise<Array<Parcel>>}
     */
    async search(queryText) { // eslint-disable-line no-unused-vars
      // Simulate an API request delay
      await new Promise(resolve => {
        setTimeout(resolve, 500);
      });

      const response = Array(4).fill(null)
        .map((_, idx) => {
          // ID will never be 0
          const id = idx + 1;

          return {
            id,
            apn: (1000 + id).toString(10),
            address: `10${id} Example St.`,
            isFireHazard: Math.random() >= 0.5,
          };
        });

      return response;
    },
    /**
     * Sends an API request to search parcels by distance
     * @param {number} parcelId
     * @param {number} distance
     * @returns {Promise<Array<SurroundingParcel>>}
     */
    async getSurroundingParcels(parcelId, distance) {
      const url = `${urlBase}/notify/parcel-and-distance?parcelid=${parcelId}&dist=${distance}`;
      const response = await fetch(url);
      const json = await response.json();
      return json;
    },
  },
};

export default api;

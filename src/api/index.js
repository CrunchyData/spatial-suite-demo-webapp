// A parcel will just be a string for now, until we implement that part
/** @typedef {string} Parcel */

const api = {
  parcels: {
    /**
     * Simulates an API request to search parcels
     * @param {string} queryText
     * @returns {Promise<Array<Parcel>>}
     */
    async search() {
      // Simulate an API request delay
      await new Promise(resolve => {
        setTimeout(resolve, 500);
      });

      return [
        'parcel1',
        'parcel2',
        'parcel3',
      ];
    },
  },
};

export default api;

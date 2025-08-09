// backend/services/ParseShipData.js

const axios = require("axios");
require("dotenv").config();
const logger = require("../logger");

// When given an array, sort it based on status
async function ParseShippoData(carriersAndTracking) {
  const grouped = {
    TRANSIT: [],
    DELIVERED: [],
    EXCEPTION: [],
    RETURNED: [],
    unknown: []
  };

  carriersAndTracking.forEach(entry => {
    /**
     * tracking_number
     * carrier
     * servicelevel.token (optional but useful)
     * address_from (city/state/zip/country)
     * address_to (city/state/zip/country)
     * eta
     * original_eta
     * test (boolean)
     * tracking_status (entire object)
     * tracking_history (array)
     */
    let track = entry.tracking.number;
    let carrier = entry.carrier;
    let token = entry.servicelevel.token;
    let address_from = entry.tracking_history.location;
    let address_to = entry.address_from;
    let eta = entry.eta;
    let original_eta = entry.original_eta;
    let testing = entry.test;
    let status = entry.tracking_history.status;
    let history = entry.tracking_history;
  });

  return grouped;

}

module.exports = ParseShippoData;

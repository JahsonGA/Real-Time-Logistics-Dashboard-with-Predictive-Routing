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
    
  });

  return grouped;

}

module.exports = ParseShippoData;

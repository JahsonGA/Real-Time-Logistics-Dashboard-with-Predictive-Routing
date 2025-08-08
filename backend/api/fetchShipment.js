// backend/services/fetchShipments.js

const axios = require("axios");
require("dotenv").config();
const logger = require("../logger");

// group data
const parseBusData = require('../utils/parseShipData');

async function fetchShipments() {
  try {
    const apiKey = process.env.GOSHIPPO_API_KEY;
    const url = "https://api.goshippo.com/tracks/";

    // Example tracking numbers (these could come from your DB)
    const carriersAndTracking = [
      //{ carrier: "usps", tracking: "9205590164917312751089" },
      //{ carrier: "ups", tracking: "1Z999AA10123456784" }
      {carrier: "shippo", tracking: "SHIPPO_TRANSIT"},
      {carrier: "shippo", tracking: "SHIPPO_DELIVERED"},
      {carrier: "shippo", tracking: "SHIPPO_EXCEPTION"},
      {carrier: "shippo", tracking: "SHIPPO_RETURNED"}
    ];

    const results = [];

    for (const { carrier, tracking } of carriersAndTracking) {
      const response = await axios.get(`${url}${carrier}/${tracking}`, {
        headers: {
          Authorization: `ShippoToken ${apiKey}`,
        },
      });

      results.push({
        carrier,
        tracking,
        status: response.data.tracking_status?.status,
        location: response.data.tracking_status?.location,
        eta: response.data.eta,
        history: response.data.tracking_history || [],
      });
    }

    logger.info(`Fetched ${results.length} shipments from Shippo`);
    return results;

  } catch (err) {
    logger.error("Error fetching shipment data:", err.message);
    return [];
  }
}

module.exports = fetchShipments;

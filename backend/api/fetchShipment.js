const axios = require("axios");
require("dotenv").config();
const { loggerRaw } = require("../logger");

async function fetchShipments() {
  const apiKey = process.env.GOSHIPPO_API_KEY;
  if (!apiKey) throw new Error("Missing GOSHIPPO_API_KEY");

  const base = "https://api.goshippo.com/tracks/";
  const carriersAndTracking = [
    { carrier: "shippo", tracking: "SHIPPO_PRE_TRANSIT" },
    { carrier: "shippo", tracking: "SHIPPO_TRANSIT" },
    { carrier: "shippo", tracking: "SHIPPO_DELIVERED" },
    { carrier: "shippo", tracking: "SHIPPO_RETURNED" },
    { carrier: "shippo", tracking: "SHIPPO_FAILURE" },
    { carrier: "shippo", tracking: "SHIPPO_UNKNOWN" },
  ];

  const results = [];

  for (const { carrier, tracking } of carriersAndTracking) {
    try {
      const resp = await axios.get(`${base}${carrier}/${tracking}`, {
        headers: { Authorization: `ShippoToken ${apiKey}` },
      });

      // log a small raw snapshot (object → JSON to file)
      loggerRaw.info({
        event: "shippo_raw",
        tracking_number: resp.data?.tracking_number,
        status: resp.data?.tracking_status?.status,
        eta: resp.data?.eta,
      });

      results.push(resp.data); // keep the full object for parsing
    } catch (err) {
      loggerRaw.error({
        event: "shippo_fetch_error",
        carrier,
        tracking,
        status: err.response?.status,
        body: err.response?.data || err.message,
      });
      // continue to next
    }
  }

  loggerRaw.info({ event: "shippo_fetch_complete", count: results.length });
  return results;
}

module.exports = fetchShipments;

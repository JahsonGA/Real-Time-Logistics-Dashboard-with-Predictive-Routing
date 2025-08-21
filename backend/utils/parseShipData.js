// backend/services/ParseShipData.js

/**
 * Normalize and group Shippo tracking responses.
 * Input: Array of raw Shippo tracking objects (one per tracking number).
 * Output: {
 *   TRANSIT: ShipmentRecord[],
 *   DELIVERED: ShipmentRecord[],
 *   EXCEPTION: ShipmentRecord[],
 *   RETURNED: ShipmentRecord[],
 *   unknown: ShipmentRecord[]
 * }
 */
function ParseShippoData(items) {
  const grouped = {
    TRANSIT: [],
    DELIVERED: [],
    EXCEPTION: [],
    RETURNED: [],
    unknown: [],
  };

  if (!Array.isArray(items)) return grouped;

  items.forEach((entry) => {
    // Extract raw fields
    const track = entry?.tracking_number || null;
    const carrier = (entry?.carrier || "").toLowerCase();
    const token = entry?.servicelevel?.token ?? null;

    const addressFrom = entry?.address_from || {};
    const addressTo = entry?.address_to || {};

    const statusObj = entry?.tracking_status || {};
    const statusRaw = statusObj?.status || "UNKNOWN";
    const status = String(statusRaw).toUpperCase();

    const statusDetails = statusObj?.status_details ?? null;
    const loc = statusObj?.location || {};
    const statusDate = statusObj?.status_date || null;
    const lastUpdate = statusObj?.object_updated || statusDate || null;

    const eta = entry?.eta || null;
    const originalEta = entry?.original_eta || null;

    const testing = Boolean(entry?.test);

    const historyArr = Array.isArray(entry?.tracking_history)
      ? entry.tracking_history
      : [];

    //  Normalize history
    const normalizedHistoryArray = historyArr.map((ev) => {
      const evLoc = ev?.location || {};
      return {
        status: ev?.status ? String(ev.status).toUpperCase() : "UNKNOWN",
        status_date: ev?.status_date || null,
        status_details: ev?.status_details ?? null,
        location_city: evLoc?.city ?? null,
        location_state: evLoc?.state ?? null,
        location_zip: evLoc?.zip ?? null,
        location_country: evLoc?.country ?? null,
      };
    });

    // Derived time fields (minutes)
    const nowMs = Date.now();

    let age_since_update_min = null;
    if (lastUpdate) {
      const t = Date.parse(lastUpdate);
      if (!Number.isNaN(t)) {
        age_since_update_min = (nowMs - t) / 60000;
      }
    }

    let time_to_eta_min = null;
    if (eta) {
      const te = Date.parse(eta);
      if (!Number.isNaN(te)) {
        time_to_eta_min = (te - nowMs) / 60000;
      }
    }

    let eta_shift_min = null;
    if (eta && originalEta) {
      const te = Date.parse(eta);
      const to = Date.parse(originalEta);
      if (!Number.isNaN(te) && !Number.isNaN(to)) {
        eta_shift_min = (te - to) / 60000;
      }
    }

    // Build normalized record ("pack")
    const pack = {
      identity: {
        id: track,
        carrier,
        service_level: token,
        is_test: testing,
      },
      current_snapshot: {
        status,
        status_details: statusDetails,
        status_location_city: loc?.city ?? null,
        status_location_state: loc?.state ?? null,
        status_location_zip: loc?.zip ?? null,
        status_location_country: loc?.country ?? null,
        status_date: statusDate,
        last_update: lastUpdate,
      },
      planned_timing: {
        eta,
        original_eta: originalEta,
      },
      addresses: {
        origin_city: addressFrom?.city ?? null,
        origin_state: addressFrom?.state ?? null,
        origin_zip: addressFrom?.zip ?? null,
        origin_country: addressFrom?.country ?? null,
        dest_city: addressTo?.city ?? null,
        dest_state: addressTo?.state ?? null,
        dest_zip: addressTo?.zip ?? null,
        dest_country: addressTo?.country ?? null,
      },
      history: normalizedHistoryArray,
      derived: {
        age_since_update_min,
        time_to_eta_min,
        eta_shift_min,
        inferred_stage: status.toLowerCase(), // simple mirror for now
      },
    };

    //  Group by current status 
    switch (status) {
      case "TRANSIT":
        grouped.TRANSIT.push(pack);
        break;
      case "DELIVERED":
        grouped.DELIVERED.push(pack);
        break;
      case "EXCEPTION":
        grouped.EXCEPTION.push(pack);
        break;
      case "RETURNED":
        grouped.RETURNED.push(pack);
        break;
      case 'PRE_TRANSIT':
        // choose one:
        // grouped.TRANSIT.push(pack);             // if you want to fold pre-transit into transit
        // or make a separate bucket if you prefer:
        grouped.unknown.push(pack);                // temporary if you don't want a new bucket
        break;
      case 'FAILURE':
        grouped.EXCEPTION.push(pack);
        break;
      default:
        grouped.unknown.push(pack);
        break;
    }
  });

  return grouped;
}

module.exports = ParseShippoData;

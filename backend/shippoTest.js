require('dotenv').config();

const fetchShipments = require('./api/fetchShipment');
const parseShipData = require('./utils/parseShipData');
const { loggerNorm } = require('./logger');

async function run() {
  const raw = await fetchShipments();
  const grouped = parseShipData(raw);

  // rollup counts
  const counts = {
    TRANSIT:   grouped.TRANSIT.length,
    DELIVERED: grouped.DELIVERED.length,
    EXCEPTION: grouped.EXCEPTION.length,
    RETURNED:  grouped.RETURNED.length,
    unknown:   grouped.unknown.length,
  };
  console.log('Counts:', counts);
  loggerNorm.info({ event: 'shippo_group_counts', counts });

  // write each normalized pack (JSON) to file
  for (const bucket of Object.values(grouped)) {
    for (const pack of bucket) {
      loggerNorm.info(pack); // pass object; file transport is json()
    }
  }

  console.log('Done. Check backend/logs/shippo_normalized.json');
}

run().catch(err => {
  console.error('Test failed:', err);
});
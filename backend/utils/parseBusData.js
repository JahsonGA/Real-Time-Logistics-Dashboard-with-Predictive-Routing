// JSON parsing, logging helpers

const isValidLocation = require('./isValidLocation');

function parseBusData(vehicleActivity) {
  const grouped = {
    direction0: [],
    direction1: [],
    unknown: []
  };

  vehicleActivity.forEach(entry => {
    const loc = entry?.MonitoredVehicleJourney?.VehicleLocation;
    const valid = isValidLocation(loc);
    if (!valid) {
      console.warn("Invalid bus location skipped:", JSON.stringify(loc, null, 2));
      return;
    }

    const bus = entry.MonitoredVehicleJourney;
    const busData = {
      id: bus.VehicleRef,
      lat: bus.VehicleLocation.Latitude,
      lng: bus.VehicleLocation.Longitude,
      direction: bus.DirectionRef,
      destination: bus.DestinationName,
      timestamp: entry.RecordedAtTime
    };

    if (bus.DirectionRef === "0") {
      grouped.direction0.push(busData);
    } else if (bus.DirectionRef === "1") {
      grouped.direction1.push(busData);
    } else {
      grouped.unknown.push(busData);
    }
  });

  return grouped;
}

module.exports = parseBusData;
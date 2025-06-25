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

    // get the data needed for ML and web
    const bus = entry.MonitoredVehicleJourney;
    const busData = {
      id: bus.VehicleRef,
      lat: bus.VehicleLocation.Latitude,
      lng: bus.VehicleLocation.Longitude,
      direction: bus.DirectionRef,
      destination: bus.DestinationName,
      timestamp: entry.RecordedAtTime
    };

    //  group data
    /*
    "Inbound" 0
    Toward the route's starting point or central terminal 
    "Outbound" 1
    Away from the central hub, toward the end of the route
    */
    const direction = String(bus.DirectionRef);

    if (direction === "0") {
      grouped.direction0.push(busData);
    } else if (direction === "1") {
      grouped.direction1.push(busData);
    } else {
      grouped.unknown.push(busData);
    }
  });

  return grouped;
}

module.exports = parseBusData;
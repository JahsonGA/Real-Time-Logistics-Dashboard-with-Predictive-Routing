// JSON parsing, logging helpers
function parseBusData(vehicleActivity) {
  return vehicleActivity
    .filter(entry => {
      // remove if GPS is missing or corrupted
      const loc = entry?.MonitoredVehicleJourney?.VehicleLocation;

      // returns 1 if long and lat exist and are valid or 0 if they do not
      return loc?.Latitude && loc?.Longitude;
    })
    .map(entry => {
      const bus = entry.MonitoredVehicleJourney;
      return {
        id: bus.VehicleRef,
        lat: bus.VehicleLocation.Latitude,
        lng: bus.VehicleLocation.Longitude,
        direction: bus.DirectionRef,
        destination: bus.DestinationName,
        timestamp: entry.RecordedAtTime
      };
    });
}

module.exports = parseBusData;

// Handles all MTA API interactions

// package imports
const axios = require('axios');

// load API key
require('dotenv').config();

// GET request
async function fetchBusData(routeId) {
  try {
    // construct the API URL using template literals
    const apiKey = process.env.MTA_API_KEY;
    const encodedRoute = encodeURIComponent(routeId); // Make it URL-safe
    const url = `https://bustime.mta.info/api/siri/vehicle-monitoring.json?key=${apiKey}&VehicleMonitoringDetailLevel=calls&LineRef=${encodedRoute}`;

    // make the GET request and wait for the response
    const response = await axios.get(url);

    // access the parsed JSON data directly from axios
    const data = response.data;

    // navigate safely to the array of vehicle activities
    const vehicleActivity = data?.Siri?.ServiceDelivery?.VehicleMonitoringDelivery?.[0]?.VehicleActivity;

    // check if any vehicles were returned
    if (!vehicleActivity || vehicleActivity.length === 0) {
      console.log(`No vehicles found for route ${routeId}.`);
      return;
    }

    // log how many vehicles were found
    console.log(`Found ${vehicleActivity.length} vehicles for route ${routeId}.`);

    // show first bus
    const busEntry = vehicleActivity[0]; // full VehicleActivity object
    const sampleBus = busEntry.MonitoredVehicleJourney;

    console.log({
    id: sampleBus.VehicleRef,
    lat: sampleBus.VehicleLocation?.Latitude,
    lng: sampleBus.VehicleLocation?.Longitude,
    destination: sampleBus.DestinationName,
    timestamp: busEntry.RecordedAtTime // display time which in one layer above sampleBus
    });

    // full bus info
    //! remove before using in full backend
    //console.log(JSON.stringify(busEntry, null, 2));

  } catch (error) {
    // catch and report any request or parsing errors
    console.error("Error fetching bus data:", error.message);
  }
}

// call the function for the B63 route
fetchBusData("MTA NYCT_B63");
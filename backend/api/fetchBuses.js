// Handles all MTA API interactions

// package imports
const axios = require('axios');

// load API key
require('dotenv').config();

// logger
const logger = require('../logger');

// parse data
const parseBusData = require('../utils/parseBusData');

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

    logger.info(`Total buses from MTA: ${vehicleActivity.length}`);

    // clean fetchBusData:
    const cleanedBuses = parseBusData(vehicleActivity);
    logger.info(`Filtered ${cleanedBuses.length} valid buses`);

    // show all bus data
    /*cleanedBuses.forEach(entry => {
      
      logger.info(JSON.stringify(entry, null, 2));

    });*/

    // grouped by direction
    // 0 inbound
    // 1 outbound
    // else unknown
    const groupedBuses = parseBusData(vehicleActivity);

    logger.info(`Inbound buses: ${groupedBuses.direction0.length}`);
    groupedBuses.direction0.forEach(bus => logger.info(JSON.stringify(bus)));

    logger.info(`Outbound buses: ${groupedBuses.direction1.length}`);
    groupedBuses.direction1.forEach(bus => logger.info(JSON.stringify(bus)));

    logger.info(`Unknown direction buses: ${groupedBuses.unknown.length}`);
    groupedBuses.unknown.forEach(bus => logger.info(JSON.stringify(bus)));

    // full bus info
    //! remove before using in full backend
    //console.log(JSON.stringify(busEntry, null, 2));

  } catch (error) {
    // catch and report any request or parsing errors
    logger.error("Error fetching bus data:", error.message);
  }
}

setInterval(()=>{
  // call the function for the B63 route
  fetchBusData("MTA NYCT_B63");
  const now = new Date().toLocaleString();

  // log data
  console.log(`[${now}] Poll executed`);
}, 5000);


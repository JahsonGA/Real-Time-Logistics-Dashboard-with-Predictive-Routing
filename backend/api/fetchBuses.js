// Handles all MTA API interactions

// package imports
const axios = require('axios');

// load API key
require('dotenv').config();
const apiKey = process.env.MTA_API_KEY;

// GET request
let url1 = 'https://bustime.mta.info/api/siri/vehicle-monitoring.json?key=';
let url2 = '&VehicleMonitoringDetailLevel=calls&LineRef=MTA%20NYCT_B63';
const url = url1.concat(apiKey, url2);
fetch(url)
    .then(response => {
        // Handle the response
        console.log("Success");
        response.json();
    })
    .then(data => {
        console.log(data); // Works in browser console

        console.log(JSON.stringify(data, null, 2)); // Pretty print
    })
    .catch(error => {
        // Handle any errors during the fetch operation
        console.log("Failed")
    });
require('dotenv').config();
const axios = require('axios');

async function testShippo() {
  const apiKey = process.env.GOSHIPPO_API_KEY;
  if (!apiKey) {
    console.error("❌ Missing GOSHIPPO_API_KEY in .env");
    process.exit(1);
  }

  try {
    // Replace with a known carrier + tracking number for testing
    const carrier = "shippo";
    const trackingNumber = "SHIPPO_TRANSIT";

    const response = await axios.get(
      `https://api.goshippo.com/tracks/${carrier}/${trackingNumber}`,
      {
        headers: {
          Authorization: `ShippoToken ${apiKey}`
        }
      }
    );

    console.log("Shippo API connected successfully!");
    console.log(JSON.stringify(response.data, null, 2));

  } catch (err) {
    console.error("Error fetching Shippo data:", err.response?.data || err.message);
  }
}

testShippo();
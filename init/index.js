const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const axios = require("axios");

main()
.then(()=>{
    console.log("connected to db");
})
.catch((err)=>{
    console.log(err);
})
async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
};
const initDb = async () => {
  await Listing.deleteMany({});

const updatedData = [];
  for (let obj of initData.data) {
    let coordinates = null;
    try {
      const geoResponse = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: `${obj.location}, ${obj.country}`,
            format: "json",
            limit: 1,
          },
          headers: { "User-Agent": "wanderlust-app" }, // Required by Nominatim
        }
      );

      if (geoResponse.data.length > 0) {
        coordinates = {
          lat: parseFloat(geoResponse.data[0].lat),
          lon: parseFloat(geoResponse.data[0].lon),
        };
      }
    } catch (err) {
      console.log(`Geocoding error for ${obj.title}:`, err.message);
    }

    updatedData.push({
      ...obj,
      owner: "68c988b64a3cd037711c126d",
      geometry: coordinates,
    });

    // Avoid hitting Nominatim too fast (rate limit)
    await new Promise((r) => setTimeout(r, 1000));
  }

  await Listing.insertMany(updatedData);
  console.log("✅ Data was initialized with geometry!");
};

initDb();
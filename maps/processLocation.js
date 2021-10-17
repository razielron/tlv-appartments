const creds = require('../creds');
const config = require('../config');
const {Client} = require("@googlemaps/google-maps-services-js");

const client = new Client({});

client
  .findPlaceFromText({
    params: {
        input: "סוקולוב 39 תל אביב",
        inputtype: 'textquery',
        //language: 'iw',
        key: creds.googleMapsApiKey,
    },
    timeout: 1000, // milliseconds
  })
  .then((r) => {
    console.log(r.data);
  })
  .catch((e) => {
    console.log(e.response);
  });
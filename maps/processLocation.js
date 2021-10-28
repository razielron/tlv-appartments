const creds = require('../creds');
const config = require('../config');
const {Client} = require("@googlemaps/google-maps-services-js");

const client = new Client({});

async function fun() {
    let appartmentLoc, res;

    res = await client
        .findPlaceFromText({
            params: {
                input: "דיזינגוף 95 תל אביב",
                inputtype: 'textquery',
                language: 'iw',
                fields: ["geometry", "formatted_address"],
                key: creds.googleMapsApiKey,
            },
            timeout: 1000, // milliseconds
        });

    console.log(res.data);
    console.log(res.data.candidates[0].geometry);
    appartmentLoc = res.data.candidates[0].geometry.location;

    let loc = `${appartmentLoc.lat},${appartmentLoc.lng}`;

    res = await client
        .textSearch({
            params: {
                input: "מכון ספייס",
                inputtype: 'textquery',
                language: 'iw',
                fields: ["geometry", "formatted_address", "place_id"],
                location: loc,
                radius: '1000',
                key: creds.googleMapsApiKey,
            },
            timeout: 1000, // milliseconds
        });

    //console.log(res);
    console.log(res.data.results);
}

fun();
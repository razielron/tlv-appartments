const axios = require('axios').default;
const fs = require('fs');
const stringSimilarity = require("string-similarity");
const config = require('./config');
const streetsData = require('./streetsData.json');

function isStreet(street) {
    streetsArr = streetsData['streetsArr'];

    for(let i = 0; i < streetsArr.length; i++) {
        if(stringSimilarity.compareTwoStrings(street, streetsArr[i]) >= config.streetSimilarityThreashold) {
            return streetsArr[i];
        }
    }

    return undefined;
}

function saveStreets(streetsArr) {
    fs.writeFileSync(config.streetsDataPath, JSON.stringify({streetsArr}));
}

async function getTlvStreets() {
    let request = {
        method: 'post',
        url: 'https://data.gov.il/api/3/action/datastore_search',
        data: {
            "resource_id": "9ad3862c-8391-4b2f-84a4-2d4c68625f4b",
            "filters": {"סמל_ישוב":"5000"},
            "include_total": true,
            "send_analytics_event": true,
            "limit": 3000,
            "offset": 0
        }
    }

    let res = await axios(request);
    // console.log(res.data.result.records);
    // saveStreets(res.data.result.records);

    return res.data.result.records;
}

async function getTLVStreetsArr() {
    let data = await getTlvStreets();
    let array = [];

    for(let i = 0; i < data.length; i++)
        if(data[i]['שם_רחוב'].length > 2)
            array.push(data[i]['שם_רחוב']);

    console.log({array});
    saveStreets(array);

    return array;
}

// getTlvStreets();
// getTLVStreetsArr();

module.exports = {
    getTlvStreets,
    getTLVStreetsArr,
    isStreet
}
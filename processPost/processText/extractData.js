const config = require('../../config');
const { isStreet } = require('../../govData');

function fillAllData(postData, splitedText) {
    let currentState, configAutomatonToDataObj;

    postData = initPostData(postData);
    postData['similarStreets'] = getSimilarStreets(splitedText);

    for (let i = 0; i < postData['stateArr'].length; i++) {
        currentState = postData['stateArr'][i]['state'];

        if(configAutomatonToDataObj = config.automatonToDataConfig[currentState]) {
            postData[configAutomatonToDataObj['prop']].push(postData['stateArr'][i + configAutomatonToDataObj['dataIndex']]['matchedWord']); //TODO: check that i+x is smaller than arr length
        }
    }

    return postData;
}

function initPostData(postData) {
    for (const [key, value] of Object.entries(config.automatonToDataConfig)) {
        if(!postData[value['prop']]) postData[value['prop']] = [];
    }

    return postData;
}

function getSimilarStreets(postTextArr) {
    let match, matchStreets = [];

    for(let i = 0; i < postTextArr.length; i++) {
        if(match = isStreet(postTextArr[i])) {
            matchStreets.push(match);
        }
    }

    return matchStreets;
}

module.exports = {
    fillAllData
}
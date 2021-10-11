const config = require('../../config');
const { isStreet } = require('../../govData');

function fillAllData(postData) {
    postData['rooms'] = getRooms(postData['stateArr']);
    postData['possibleStreets'] = getStreet(postData['stateArr']);
    postData['matchStreets'] = getSimilarStreets(smartSplit(postData['postText']));
    postData['phone'] = getPhone(postData['stateArr']);
    postData['price'] = getPrice(postData['stateArr']);

    return postData;
}

function getIndexesOfState(stateArr, state) {
    let indexes = [];

    for(let i = 0; i < stateArr.length; i++)
        if(stateArr[i]['state'] === state)
            indexes.push(i);
    
    return indexes;
}

function getRooms(stateArr) {
    let possibleRoomsArr = [], currentState;
    let roomStateIndexes = getIndexesOfState(stateArr, config.roomState);

    for(let i = 0; i < roomStateIndexes.length; i++) {
        currentState = stateArr[roomStateIndexes[i] - 1];
        possibleRoomsArr.push(currentState['matchedWord']);
    }

    return possibleRoomsArr;
}

function getPrice(stateArr) {
    let possiblePricesArr = [], currentState;
    let priceStateIndexes = getIndexesOfState(stateArr, config.priceState);

    for(let i = 0; i < priceStateIndexes.length; i++) {
        currentState = stateArr[priceStateIndexes[i]];
        possiblePricesArr.push(currentState['matchedWord']);
    }

    return possiblePricesArr;
}

function getStreet(stateArr) {
    let possibleStreetsArr = [], currentState;
    let streetStateIndexes = getIndexesOfState(stateArr, config.streetState);

    for(let i = 0; i < streetStateIndexes.length; i++) {
        currentState = stateArr[streetStateIndexes[i]];
        possibleStreetsArr.push(currentState['matchedWord']);
    }

    return possibleStreetsArr;
}

function getPhone(stateArr) {
    let possiblePhonesArr = [], currentState;
    let phoneStateIndexes = getIndexesOfState(stateArr, config.phoneState);

    for(let i = 0; i < phoneStateIndexes.length; i++) {
        currentState = stateArr[phoneStateIndexes[i]];
        possiblePhonesArr.push(currentState['matchedWord']);
    }

    return possiblePhonesArr;
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
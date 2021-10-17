const config = require('../../config');

function isMatch(postData) {
    let stateArr, isMaleRoommate, isFemaleRommate, isRoommate, isMatched;
    
    stateArr = postData['stateArr'];
    isRoommate = isRoommateMatchConfig(postData['roommate']);
    isFemaleRommate = isFemaleRoommateMatchConfig(postData['femaleRoommate']);
    isMaleRoommate = isMaleRoommateMatchConfig(postData['maleRoommate']);

    isMatched = {
        automaton: stateArr[stateArr.length - 1]['state'] !== config.endSate && stateArr.length > 1,
        isInPriceRange: isInPriceRange(postData['price']),
        isInRoomsRange: isInRoomsRange(postData['rooms']),
        isFemaleRoommateMatchConfig: isFemaleRommate || isRoommate,
        isMaleRoommateMatchConfig: isMaleRoommate || isRoommate,
        isSabletMatchConfig: isSabletMatch(postData['sablet']),
        isStudioMatchConfig: isStudioMatch(postData['studio']),
        isUnitMatchConfig: isUnitMatch(postData['unit']),
    }
    isMatched['isAllMatch'] = isAllMatch(isMatched);

    return isMatched;
}

function isAllMatch(isMatched) {
    for (const [key, value] of Object.entries(isMatched)) {
        if(!value) return false;
    }

    return true;
}

function isInPriceRange(priceArr) {
    let currentPrice;
    
    if(!priceArr.length)
        return true;

    for(let i = 0; i < priceArr.length; i++) {
        currentPrice = priceArr[i].replace(/\D/g,'');
        currentPrice = parseInt(currentPrice);

        if(currentPrice >= config['filters']['price'][0] && currentPrice <= config['filters']['price'][1]) {
            return true;
        }
    }

    return false;
}

function convertTextToNum(text) {
    let textTemp;

    if((/שני/).test(text)) {
        return 2;
    } else if((/שלוש/).test(text)) {
        return 3;
    } else if((/ארבע/).test(text)) {
        return 4;
    } else if((/חמי?ש/).test(text)) {
        return 5;
    } else {
        textTemp = text.match(/[+-]?\d+(\.\d+)?/g, '');
        return parseFloat(textTemp[0]);
    }
}

function isInRoomsRange(roomsArr) {
    let currentRoomNum;
    
    if(!roomsArr.length)
        return true;

    for(let i = 0; i < roomsArr.length; i++) {
        currentRoomNum = convertTextToNum(roomsArr[i]);

        if(currentRoomNum >= config['filters']['rooms'][0] && currentRoomNum <= config['filters']['rooms'][1]) {
            return true;
        }
    }

    return false;
}

function isRoommateMatchConfig(roomateArr) {
    return !!roomateArr.length;
}

function isFemaleRoommateMatchConfig(femaleRoomateArr) {
    return config['filters']['femaleRoommate'] ? (!!femaleRoomateArr.length === config['filters']['femaleRoommate']) : true;
}

function isMaleRoommateMatchConfig(maleRoomateArr) {
    return config['filters']['maleRoommate'] ? (!!maleRoomateArr.length === config['filters']['maleRoommate']) : true;
}

function isSabletMatch(sabletArr) {
    return config['filters']['sablet'] ? (!!sabletArr.length === config['filters']['sablet']) : true;
}

function isStudioMatch(studioArr) {
    return config['filters']['studio'] ? (!!studioArr.length === config['filters']['studio']) : true;
}

function isUnitMatch(unitArr) {
    return config['filters']['unit'] ? (!!unitArr.length === config['filters']['unit']) : true;
}

module.exports = {
    isMatch
}
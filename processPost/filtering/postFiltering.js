const config = require('../../config');

function isMatch(postData) {
    let stateArr, isMatched;

    stateArr = postData['stateArr'];
    isMatched = {
        automaton: stateArr[stateArr.length - 1]['state'] !== config.endSate,
        isInPriceRange: isInPriceRange(postData['price']),
        isInRoomsRange: isInRoomsRange(postData['rooms']),
        isRoommateMatchConfig: isRoommateMatchConfig(postData['roommate']),
        isFemaleRoommateMatchConfig: isFemaleRoommateMatchConfig(postData['femaleRoommate']) || isRoommateMatchConfig(postData['roommate']),
        isMaleRoommateMatchConfig: isMaleRoommateMatchConfig(postData['maleRoommate']) || isRoommateMatchConfig(postData['roommate']),
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
        textTemp = text.replace(/\D/g, '');
        return parseInt(textTemp);
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
    return !!roomateArr.length === config['filters']['roommate'];
}

function isFemaleRoommateMatchConfig(femaleRoomateArr) {
    return !!femaleRoomateArr.length === config['filters']['femaleRoommate'];
}

function isMaleRoommateMatchConfig(maleRoomateArr) {
    return !!maleRoomateArr.length === config['filters']['maleRoommate'];
}

function isSabletMatch(sabletArr) {
    return !!sabletArr.length === config['filters']['sablet'];
}

function isStudioMatch(studioArr) {
    return !!studioArr.length === config['filters']['studio'];
}

function isUnitMatch(unitArr) {
    return !!unitArr.length === config['filters']['unit'];
}

module.exports = {
    isMatch
}
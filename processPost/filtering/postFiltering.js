const config = require('../../config');

function isMatch(postData) {
    let stateArr, isRoommate, isMatched;
    
    stateArr = postData['stateArr'];
    isRoommate = isRoommateMatchConfig(postData['roommate']);

    isMatched = {
        automaton: stateArr[stateArr.length - 1]['state'] !== config.endSate && isAutomatonMadeProgress(stateArr),
        isInPriceRange: isInPriceRange(postData['price']),
        isInRoomsRange: isInRoomsRange(postData['rooms']),
        isFemaleRoommateMatchConfig: isFemaleRoommateMatchConfig(postData['femaleRoommate'], isRoommate),
        isMaleRoommateMatchConfig: isMaleRoommateMatchConfig(postData['maleRoommate'], isRoommate),
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

function isFemaleRoommateMatchConfig(femaleRoomateArr, isRoomate) {
    let isFemaleRoomate = !!femaleRoomateArr.length || isRoomate;
    let configFemaleRoommate = config['filters']['femaleRoommate'];

    return (configFemaleRoommate !== undefined) ? (isFemaleRoomate === configFemaleRoommate) : true;
}

function isMaleRoommateMatchConfig(maleRoomateArr, isRoomate) {
    let isMaleRoomate = !!maleRoomateArr.length || isRoomate;
    let configMaleRoommate = config['filters']['maleRoommate'];

    return (configMaleRoommate !== undefined) ? (isMaleRoomate === configMaleRoommate) : true;
}

function isSabletMatch(sabletArr) {
    let configSablet = config['filters']['sablet'];

    return (configSablet !== undefined) ? (!!sabletArr.length === configSablet) : true;
}

function isStudioMatch(studioArr) {
    let configStudio = config['filters']['studio'];

    return (configStudio !== undefined) ? (!!studioArr.length === configStudio) : true;
}

function isUnitMatch(unitArr) {
    let configUnit = config['filters']['unit'];

    return (configUnit !== undefined) ? (!!unitArr.length === configUnit) : true;
}

function isAutomatonMadeProgress(stateArr) {
    for(let i = 0; i < stateArr.length; i ++) {
        if(stateArr[i]['state'] !== 'q0' && stateArr[i]['state'] !== 'q1') {
            return true;
        }
    }

    return false;
}

module.exports = {
    isMatch
}
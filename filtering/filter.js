let filters = require('./filters.json');
const { isStreet } = require('../govData');

function containsHebrew(str) {
    return (/[\u0590-\u05FF]/).test(str);
}

function containsNumber(myString) {
    return /\d/.test(myString);
  }

function smartSplit(postText) {
    let postArr;
    let delimiters = /\s|[a-zA-Z]/;

    postArr = postText.split(delimiters);
    postArr = postArr.filter(word => word);
    console.log({postArr});

    return postArr;
}

function match(word, filter) {    
    const regex = new RegExp(filter);
    return regex.test(word);
}

function getNextState(current_q, word) {
    for(let state in current_q) {
        for(let filterIndex = 0; filterIndex < current_q[state].length; filterIndex++) {
            if(match(word, current_q[state][filterIndex]))
                return { state, word };
        }
    }

    return { state: 'q0', word };
}

function checkWords(words) {
    let currentState = 'q0';
    let nextStateObj = {};
    let nextState = '';
    let matchedWord = '';
    let stateArr = [{state: currentState, matchedWord: ''}];

    for(let i = 0; i < words.length; i++) {
        nextStateObj = getNextState(filters[currentState], words[i]);
        nextState = nextStateObj.state;
        matchedWord = nextStateObj.word;

        if(currentState !== nextState)
            stateArr.push({state: nextState, matchedWord})

        if(nextState === 'q2')
            i = words.length;

        currentState = nextState;
    }

    console.log({currentState});
    return stateArr;
}

function checkPost(postData) {
    let postArr = smartSplit(postData['postText'])
    let stateArr = checkWords(postArr);

    return stateArr;
}

function getRoomNum(stateArr) {
    let roomIndicators = filters['q7']['q2'];

    for(let i = 1; i < stateArr.length; i++) {
        if(roomIndicators.some(indicator => match(stateArr[i]['matchedWord'], indicator))
            && containsNumber(stateArr[i - 1]['matchedWord'])) {
            return stateArr[i - 1]['matchedWord'];
        }
    }

    return '-';
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

function getStreet(stateArr) {
    let streetIndicators = filters['q0']['q10'];
    let result = [];

    for(let i = 1; i < stateArr.length - 1; i++) {
        if(streetIndicators.some(indicator => match(stateArr[i]['matchedWord'], indicator))) {
            result.push(stateArr[i + 1]['matchedWord']);
        }
    }

    return result;
}

function getPhoneNumber(stateArr) {
    let phoneIndicator = 'q11';
    let result = [];

    for(let i = 1; i < stateArr.length; i++) {
        if(stateArr[i]['state'] === phoneIndicator && stateArr[i]['matchedWord'].length >= 10) {
            result.push(stateArr[i]['matchedWord']);
        }
    }

    return result;
}

function getPrice(stateArr) {
    let priceIndicator = 'q12';
    let result = [];

    for(let i = 1; i < stateArr.length; i++) {
        if(stateArr[i]['state'] === priceIndicator) {
            result.push(stateArr[i]['matchedWord']);
        }
    }

    return result;
}

function filterPrice(priceArr) {
    for(let i = 1; i < priceArr.length; i++) {
        if(priceArr[i] < config.priceRange[0] || priceArr[i] > config.priceRange[1]) {
            return false;
        }
    }

    return true;
}

module.exports = {
    checkPost,
    checkWords,
    getNextState,
    smartSplit,
    match,
    containsHebrew,
    filterPrice,
    getRoomNum,
    getSimilarStreets,
    getStreet,
    getPhoneNumber,
    getPrice
}
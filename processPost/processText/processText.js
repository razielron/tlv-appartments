const config = require('../../config');
const rawAutomaton = require('./automaton.json');
const { fillAllData } = require('./extractData');

let automaton = initAutomata(rawAutomaton);

function initAutomata(automaton) {
    let currentState;
    let filterOutStates = config.filterOutStates;

    for(let i = 0; i < filterOutStates.length; i++) {
        currentState = filterOutStates[i];
        automaton[config.endSate] = automaton[currentState];
        delete automaton[currentState];
    }

    return automaton;
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

    return { state: config.startState, word };
}

function runAutomaton(words) {
    let currentState = config.startState;
    let nextStateObj = {};
    let nextState = '';
    let matchedWord = '';
    let stateArr = [{state: currentState, matchedWord: ''}];

    for(let i = 0; i < words.length; i++) {
        nextStateObj = getNextState(automaton[currentState], words[i]);
        nextState = nextStateObj.state;
        matchedWord = nextStateObj.word;

        if(currentState !== nextState)
            stateArr.push({state: nextState, matchedWord})

        if(nextState === config.endSate)
            i = words.length;

        currentState = nextState;
    }

    console.log({currentState});
    return stateArr;
}

function processText(postData) {
    let postArr = smartSplit(postData['postText'])
    postData['stateArr'] = runAutomaton(postArr);

    return fillAllData(postData);
}

module.exports = {
    processText
}
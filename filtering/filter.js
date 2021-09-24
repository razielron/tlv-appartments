let filters = require('./filters.json');

function smartSplit(postText) {
    let postArr;
    let delimiters = /\s|[a-zA-Z]/;

    postArr = postText.split(delimiters);
    postArr = postArr.filter(word => word);
    console.log({postArr});

    return postArr;
}

function getNextState(current_q, word) {
    for(let state in current_q) {
        for(let filterIndex = 0; filterIndex < current_q[state].length; filterIndex++) {
            if(word.includes(current_q[state][filterIndex]))
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

module.exports = {
    checkPost,
    checkWords,
    getNextState,
    smartSplit
}
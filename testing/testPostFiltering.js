let postData = require('./testPostFiltering.json');
const { isMatch } = require('../processPost/filtering/postFiltering');

postData['isMatch'] = isMatch(postData);
console.log({postData});
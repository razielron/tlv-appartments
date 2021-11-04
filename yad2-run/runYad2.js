const Login = require('../facebook-objects/login.po');
const MainPage = require('../yad2/search.po');
const { processYad2 } = require('../yad2/getPosts');

describe('Yad2 run', () => {
    it('open search and track traffic', async () => {
        let reqId, res;
        await browser.cdp('Network', 'enable');
        await browser.on('Network.responseReceived', async (params) => {
            if(params.response.url.includes('https://www.yad2.co.il/api/pre-load/getFeedIndex/realestate/rent?')) {
                reqId = params.requestId;
                res = await browser.cdp('Network', 'getResponseBody', {requestId: reqId});
                res = JSON.parse(res.body);
                //console.log(res.feed.feed_items);
                await processYad2(res.feed.feed_items);
            }
            //console.log(params.response.url);
        });
    
        await MainPage.openSearch();
        await MainPage.closeToolTip();
        await MainPage.search();
        await browser.pause(5000);
    });
});
const config = require('../config');
const MainPage = require('../yad2/search.po');
const { processYad2 } = require('../yad2/getPosts');

describe('Yad2 run', () => {
    beforeAll(async () => {
        let reqId, res;

        await browser.cdp('Network', 'enable');
        await browser.on('Network.responseReceived', async (params) => {
            if(reqId !== params.requestId && params.response.url.includes(config.yad2.devtoolsApiSearch[0])) {
                reqId = params.requestId;
                res = await browser.cdp('Network', 'getResponseBody', {requestId: reqId});
                res = JSON.parse(res.body);
                //console.log(res.feed.feed_items);
                await processYad2(res.feed.feed_items);
            }
        });
    });

    it('open search and track traffic', async () => {
        await MainPage.openSearch();
        await MainPage.closeToolTip();
        await MainPage.search();
        await browser.pause(5000);
    });
});
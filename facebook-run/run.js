const Login = require('../facebook-objects/login.po');
const MainPage = require('../facebook-objects/mainpage.po');
const data = require('../config');

describe('Login', () => {
    it('Login', async () => {
        await Login.login();
    });
});

for(let i = 0; i < data.groups.length; i++) {
    describe(`Run Group: ${data.groups[i]}`, () => {
        it('Open group', async () => {
            await MainPage.openSpecificGroup(data.groups[i]);
            await browser.pause(5000);
        });

        xit('Sort Posts By Most Recent', async () => {
            await MainPage.sortByRecent();
        });

        it('Run', async () => {
            await MainPage.goOverArticles(data.postsPerGroup);
        });
    });
}


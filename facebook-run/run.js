const Login = require('../facebook-objects/login.po');
const MainPage = require('../facebook-objects/mainpage.po');
const data = require('../data');

describe('Run', () => {
    it('Login', async () => {
        await Login.login();
    });

    it('Open First group', async () => {
        await MainPage.openSpecificGroup(data.groups[0]);
        await browser.pause(5000);
    });

    it('Run', async () => {
        await MainPage.goOverArticles();
    });
});



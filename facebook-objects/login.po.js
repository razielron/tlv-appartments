const Creds = require('../creds');

class Login {
    constructor() {

    }

    get emailInput() { return $('#email'); }
    get passInput() { return $('#pass'); }
    get loginButton() { return $('button[name="login"]'); }

    async login() {
        await browser.url('https://www.facebook.com/');
        await this.emailInput.setValue(Creds.email);
        await this.passInput.setValue(Creds.pass);
        await this.loginButton.click();
    }

}

module.exports = new Login();
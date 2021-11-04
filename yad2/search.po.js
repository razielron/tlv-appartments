const axios = require('axios');
const MongoClient = require('../mongodb/mongodbClient');
const TelegramBot = require('node-telegram-bot-api');
const creds = require('../creds');
const config = require('../config');


class MainPage {
    constructor() {

    }

    get fromPriceInput() { return $('[data-test-id="searchRangeInputFrom_price"]'); }
    get toolTip() { return $('.y2_tooltip.tooltip_with_button'); }
    get getToolTipCloseButton() { return this.toolTip.$$('button')[1]; }
    get searchButton() { return $('[data-test-id="searchButton"]'); }

    async openSearch() {
        await browser.url('https://www.yad2.co.il/realestate/rent?topArea=2&area=1&city=5000&neighborhood=1461&property=1&rooms=3-3.5&price=6001-9000');
    }

    async closeToolTip() {
        await this.toolTip.waitForDisplayed({timeout: 60000});
        await this.getToolTipCloseButton.click();
    }

    async search() {
        await this.fromPriceInput.waitForDisplayed({timeout: 60000});
        await this.fromPriceInput.setValue('6000');
        await this.searchButton.click();
        await browser.pause(200);
        await this.searchButton.click();
    }

}

module.exports = new MainPage();
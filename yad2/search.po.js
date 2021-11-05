const config = require('../config');
class MainPage {
    constructor() {}

    get fromPriceInput() { return $('[data-test-id="searchRangeInputFrom_price"]'); }
    get toolTip() { return $('.y2_tooltip.tooltip_with_button'); }
    get getToolTipCloseButton() { return this.toolTip.$$('button')[1]; }
    get searchButton() { return $('[data-test-id="searchButton"]'); }

    async openSearch() {
        await browser.url(config.yad2.urls[0]);
    }

    async closeToolTip() {
        await this.toolTip.waitForExist({timeout: 60000});
        await this.toolTip.scrollIntoView();
        await this.toolTip.waitForDisplayed({timeout: 60000});
        await this.getToolTipCloseButton.click();
    }

    async search() {
        await this.fromPriceInput.waitForDisplayed({timeout: 60000});
        await this.fromPriceInput.scrollIntoView();
        await this.fromPriceInput.setValue(config.filters.price[0]);
        await this.searchButton.click();
        await browser.pause(200);
        await this.searchButton.click();
    }

}

module.exports = new MainPage();
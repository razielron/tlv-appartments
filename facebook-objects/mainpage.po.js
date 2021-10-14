const { processPost } = require('../processPost/processPost');

class MainPage {
    constructor() {

    }

    get groupsButton() { return $('//body/div/div/div[1]/div/div[3]/div/div/div[1]/div[1]/div/div[1]/div/div/div[1]/div/div/div[1]/div[1]/ul/li[2]/div/a/div[1]/div[2]/div'); }
    get groupA() { return $(`//body/div/div/div[1]/div/div[3]/div/div/div[1]/div[1]/div[1]/div/div[3]/div[1]/div[5]`); }
    async getGroup(groupNum) { return await $(`//body/div/div/div[1]/div/div[3]/div/div/div[1]/div[1]/div[1]/div/div[3]/div[1]/div[${groupNum + 4}]`); }
    get allArticles() { return $$('div[role="article"]'); }
    async getPostActions(postNum) { return await $$('div[aria-label="Actions for this post"]')[postNum]; }
    get saveItemButton() { return $$('div[role="menuitem"]')[0]; }
    get doneButton() { return $('div[aria-label="Done"]'); }
    async getLink(elem) { return await elem.$('a[class="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 nc684nl6 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of lzcic4wl gmql0nx0 gpro0wi8 b1v8xokw"]'); }
    async getAllLinks(elem) { return await elem.$$('a[class="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 nc684nl6 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of lzcic4wl gmql0nx0 gpro0wi8 b1v8xokw"]'); }
    //async getLinkHover(elem) { return await elem.$('span[class="d2edcug0 hpfvmrgz qv66sw1b c1et5uql lr9zc1uh a8c37x1j keod5gw0 nxhoafnm aigsh9s9 d9wwppkn fe6kdd0r mau55g9w c8b282yb mdeji52x e9vueds3 j5wam9gi b1v8xokw m9osqain hzawbc8m"]>span'); }
    //async getLinkHover2(elem) { return await elem.$('span[class="j1lvzwm4 stjgntxs ni8dbmo4 q9uorilb gpro0wi8"]'); }
    async getLink2(elem) { 
        return await elem.$$('span[class="tojvnm2t a6sixzi8 abs2jz4q a8s20v7p t1p8iaqh k5wvi7nf q3lfd5jv pk4s997a bipmatt0 cebpdrjk qowsmv63 owwhemhu dp1hu0rb dhp61c6y iyyx5f41"]')
            .filter(async (elem) => {
                return await elem.$('a[class="oajrlxb2 g5ia77u1 qu0x051f esr5mh6w e9989ue4 r7d6kgcz rq0escxv nhd2j8a9 nc684nl6 p7hjln8o kvgmc6g5 cxmmr5t8 oygrvhab hcukyx3x jb3vyjys rz4wbd8a qt6c0cv9 a8nywdso i1ao9s8h esuyzwwr f1sip0of lzcic4wl gmql0nx0 gpro0wi8 b1v8xokw"]')
                .isExisting();
            });
    }
    get arrowDropDown() { return $('div[class="rq0escxv l9j0dhe7 du4w35lb j83agx80 pfnyh3mw i1fnvgqd bp9cbjyn owycx6da btwxx1t3 jeutjz8y"]'); }
    get sortOptions() { return $$('div[role="menuitemradio"]'); }
    async seeMoreBtn(elem) { 
        return await elem.$$('div[role="button"]')
        .filter(async el => {
            return ((await el.getText()) === 'See More');
        });
    }
    async getImages(elem) { return elem.$$('img[class="i09qtzwb n7fi1qx3 datstx6m pmk7jnqg j9ispegn kr520xx4 k4urcfbm"]'); }

    async sortByRecent() {
        await this.arrowDropDown.waitForExist({timeout: 60000});
        await this.arrowDropDown.scrollIntoView();
        await this.arrowDropDown.waitForDisplayed({timeout: 60000});
        await this.arrowDropDown.click();
        await browser.pause(100);
        await this.sortOptions[1].click();
        await browser.pause(200);
    }

    async openGroups() {
        await this.groupsButton.click();
        await browser.pause(3000);
    }

    async openGroupAtIndex(groupNum) {
        await this.groupA.waitForExist({timeout: 60000});
        await this.groupA.click();
    }

    async saveForLater(element) {
        await element.$('div[aria-label="Actions for this post"]').click();
        await this.saveItemButton.click();
        await this.doneButton.click();
    }

    comparePost(text) {
        return true;
    }

    async openSpecificGroup(groupUrl) {
        await browser.pause(1000);
        await browser.url(groupUrl);
    }

    async openSinglePost(currentPost, postNum) {
        console.log('55555555555555555555555555555')
        await currentPost.scrollIntoView();
        let postLinkElem = await this.getAllLinks(currentPost);

        if(postLinkElem.length > 0) {
            console.log('666666666666666666666666666')
            await postLinkElem[0].waitForExist({timeout: 60000});
            await postLinkElem[0].scrollIntoView();
            await postLinkElem[0].waitForClickable({timeout: 60000});
            await this.holdDownKey('\uE009');
            await postLinkElem[0].click();
            await this.releaseKey('\uE009');
            await browser.pause(1000);
            let allHandles = await browser.getWindowHandles();
            await browser.switchToWindow(allHandles[1]);
            await this.getDataofSinglePost(postNum);
            await browser.closeWindow();
            allHandles = await browser.getWindowHandles();
            await browser.switchToWindow(allHandles[0]);
        }
    }

    async getDataofSinglePost(postNum) {
        let allPosts, currentPost, postText, numOfPosts, postUrl, postUrl2;
        console.log('777777777777777777777777777')
        await browser.waitUntil(async ()=> {
            console.log('8888888888888888888888888888888')
            allPosts = await this.allArticles;
            numOfPosts = allPosts.length;
            console.log({numOfPosts})
            return numOfPosts > 0;
        }, {timeout: 60000});

        currentPost = allPosts[0];
        if(currentPost.isExisting()) {
            postUrl = await browser.getUrl();
            postText = await currentPost.getText();
        }
        console.log('999999999999999999999999999999')
        let postData = {postNum, postUrl, postText};
        processPost(postData);
        //console.log({postData});
    }

    async pressSeeMoreIfExists(currentPost) {
        let seeMore = await this.seeMoreBtn(currentPost);

        if(seeMore[0] && await seeMore[0].isExisting()) {
            await seeMore[0].scrollIntoView(false);
            await seeMore[0].click();
        }
    }

    async getPostDataFromGroup(currentPost, postNum) {
        let postUrlElem, postUrl, postText, postData, postIamges, isContainsPic, sliceFrom, SliceTo;

        await this.pressSeeMoreIfExists(currentPost);
        postUrlElem = await this.getAllLinks(currentPost);
        postIamges = await this.getImages(currentPost);

        if(postUrlElem.length > 0) {
            postUrlElem = postUrlElem[0];
            await postUrlElem.scrollIntoView(false);
            await postUrlElem.moveTo(0,0);
            postUrl = await postUrlElem.getAttribute('href');
            postText = await currentPost.getText();
            isContainsPic = !!postIamges.length;

            postUrl = postUrl.split('?')[0];
            sliceFrom = Math.max(postText.indexOf('·\n'), 0);
            SliceTo = postText.indexOf('Like\nComment');
            postText = postText.slice(sliceFrom, SliceTo);
            postData = {postNum, postUrl, postText, isContainsPic};
            console.log({postUrl});

            if(postUrl !== '#') {
                processPost(postData);
            }
        }
    }

    async goOverArticles(maxArticles = 10) {
        let numOfPosts = 0, postText, currentPost, allPosts, postLinkElem, postLink;
        
        for(let i = 0; i < maxArticles; i++) {
            console.log('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@')
            await browser.waitUntil(async ()=> {
                allPosts = await this.allArticles;
                numOfPosts = allPosts.length;
                console.log({numOfPosts})
                return numOfPosts > 0;
            }, {timeout: 60000});

            console.log('1111111111111111111111111')
            await browser.waitUntil(async ()=> {
                if(i > numOfPosts - 1) { 
                    console.log('22222222222222222222222222222')
                    console.log({i})
                    console.log({numOfPosts})
                    allPosts = await this.allArticles;
                    numOfPosts = allPosts.length;
                    currentPost = allPosts[numOfPosts - 1];
                    await currentPost.scrollIntoView();
                    await browser.pause(2000);
                    return false;
                } else {
                    return true;
                }
            }, {timeout: 60000});
            
            currentPost = await this.allArticles[i];

            console.log('3333333333333333333333333')
            await this.getPostDataFromGroup(currentPost, i);
            // await this.openSinglePost(currentPost, i);
        }
    }

    async holdDownKey(character) {
        await browser.performActions([{
          type: 'key',
          id: 'keyboard',
          actions: [{ type: 'keyDown', value: character }],
        }]);
    }

    async releaseKey(character) {
        await browser.performActions([{
          type: 'key',
          id: 'keyboard',
          actions: [{ type: 'keyUp', value: character }],
        }]);
    }
}

module.exports = new MainPage();
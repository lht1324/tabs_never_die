/*global chrome*/

export default class FreeStorage {
    constructor() {
        this.tabListKey = "userTabList";
        this.lastSaveDateKey = "lastSaveDate";
    }

    async putUserTabData(tabList) {
        await chrome.storage.local.set({
            [this.tabListKey]: tabList,
            [this.lastSaveDateKey]: (new Date()).toISOString()
        });
    }

    async getUserTabData() {
        const result = await chrome.storage.local.get([
            this.tabListKey,
            this.lastSaveDateKey
        ]);

        return {
            tabList: result[this.tabListKey] || [],
            lastSaveDate: result[this.lastSaveDateKey] || null
        };
    }
}
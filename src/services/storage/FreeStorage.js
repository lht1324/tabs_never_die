/*global chrome*/

export default class FreeStorage {
    constructor() {
        this.tabListKey = "tabList";
        this.tabGroupListKey = "tabGroupList";
        this.lastSaveDateKey = "lastSaveDate";
    }

    async putUserTabData(tabList, tabGroupList) {
        await chrome.storage.local.set({
            [this.tabListKey]: tabList,
            [this.tabGroupListKey]: tabGroupList,
            [this.lastSaveDateKey]: (new Date()).toISOString()
        });
    }

    async getUserTabData() {
        const result = await chrome.storage.local.get([
            this.tabListKey,
            this.tabGroupListKey,
            this.lastSaveDateKey
        ]);

        return {
            tabList: result[this.tabListKey] || [],
            tabGroupList: result[this.tabGroupListKey] || [],
            lastSaveDate: result[this.lastSaveDateKey] || null
        };
    }
}
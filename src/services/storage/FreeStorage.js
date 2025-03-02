import { getFormattedDateWithUTC } from "@/utils/utils.js";

export default class FreeStorage {
    constructor() {
        this.storageKey = "userTabs";
    }

    async saveUserTabList(tabList) {
        // 저장 & 복구가 우선이니 리스트 저장이 효율적이라는 결론. 확실히 JSON으로 어떻게든 빼면 되니 상관은 없다.
        // 이차원 배열 저장 가능.
        await chrome.storage.local.set({
            [this.storageKey]: tabList,
            lastSaveDate: getFormattedDateWithUTC()
        });
    }

    async getUserTabList() {
        const result = await chrome.storage.local.get(this.storageKey);
        return result[this.storageKey] || [];
    }
}
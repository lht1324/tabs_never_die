/*global chrome*/
// 사용자 브라우저 Locale 설정 따서 언어 초기 지정 해줘야 함

export default class PreferenceStorage {
    constructor() {
        this.preferenceDataKey = "userPreference";
    }

    async putUserPreference(preferenceData) {
        console.log(`putUserPreference(): ${JSON.stringify(preferenceData)}`);
        await chrome.storage.local.remove([this.preferenceDataKey])
        await chrome.storage.local.set({
            [this.preferenceDataKey]: preferenceData
        })
    }

    async getUserPreference() {
        const result = await chrome.storage.local.get([this.preferenceDataKey])
        console.log(`getUserPreference(): ${JSON.stringify(result)}`);
        return result[this.preferenceDataKey] // await chrome.storage.local.get(this.preferenceDataKey)
    }
}
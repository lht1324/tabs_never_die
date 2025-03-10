/*global chrome*/
// 사용자 브라우저 Locale 설정 따서 언어 초기 지정 해줘야 함

import {println} from "../../utils/log.js";

const defaultPreference = {
    isDarkMode: false,
    autoSaveIntervalMinutes: "30",
}

export default class PreferenceStorage {
    constructor() {
        this.preferenceDataKey = "userPreference";
    }

    async putUserPreference(preferenceData) {
        println(`putUserPreference(): ${JSON.stringify(preferenceData)}`);
        await chrome.storage.local.remove([this.preferenceDataKey])
        await chrome.storage.local.set({
            [this.preferenceDataKey]: preferenceData
        })
    }

    async getUserPreference() {
        const result = await chrome.storage.local.get([this.preferenceDataKey]);

        return result[this.preferenceDataKey] || defaultPreference;
    }
}
/*global chrome*/

import UserStorageManager from "@/services/storage/UserStorageManager.js";
import {handleGetUserTabData, handlePutUserTabData} from "./FreeStorageHandler.js";
import {handleGetUserPreference, handlePutUserPreference} from "./PreferenceStorageHandler.js";
import {println} from "../utils/log.js";
import {restoreTabs} from "./ChromeAPIHandler.js";

const userStorageManager = new UserStorageManager(true);

initializeTabSaveData().then();
updateAutoSaveAlarm().then();

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case "putTabData": {
            handlePutUserTabData(userStorageManager, sendResponse).then();
            break;
        }
        case "getTabData": {
            handleGetUserTabData(userStorageManager, sendResponse).then();
            break;
        }
        case "putUserPreference": {
            handlePutUserPreference(userStorageManager, sendResponse, message.data).then();
            break;
        }
        case "getUserPreference": {
            handleGetUserPreference(userStorageManager, sendResponse).then();
            break;
        }
        case "restoreTabs": {
            restoreTabs(userStorageManager, sendResponse).then();
            break;
        }
        default: {
            println(`chrome.runtime.onMessage()'s action = ${message.action}`);
        }
    }

    return true; // 비동기 응답을 위해 true 반환
});

chrome.alarms.onAlarm.addListener((alarm) => {
    println(`alarmsOnAlarm: ${JSON.stringify(alarm)}`);
    switch (alarm.name) {
        case "autoSaveTabData": {
            handlePutUserTabData(userStorageManager).then(() => {
                chrome.runtime.sendMessage({ action: "tabListUpdated" }).then();
            })
            break;
        }
        default: {
            println(`Alarm's name is wrong: ${alarm.name}`)
            break;
        }
    }
})

chrome.storage.onChanged.addListener((changes, area) => {
    println(`storageOnChanged: ${area}, ${JSON.stringify(changes)}`);
    if (area === "local" && changes.userPreference && changes.userPreference.newValue) {
        updateAutoSaveAlarm().then();
    }
})

async function initializeTabSaveData() {
    await handleGetUserTabData(userStorageManager, (response) => {
        if (response.data && response.data.tabDataList.length === 0) {
            handlePutUserTabData(userStorageManager).then();
        }
    });
}

async function updateAutoSaveAlarm() {
    await handleGetUserPreference(userStorageManager, (response) => {
        const savedPreferenceData = response.data;
        const autoSaveIntervalMinutes = savedPreferenceData.autoSaveIntervalMinutes;

        chrome.alarms.clear("autoSaveTabData", () => {
            chrome.alarms.create("autoSaveTabData", { periodInMinutes: parseInt(autoSaveIntervalMinutes) });
        })
    })
}
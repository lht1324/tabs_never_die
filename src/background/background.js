/*global chrome*/

import UserStorageManager from "@/services/storage/UserStorageManager.js";
import {handleGetUserData, handlePutUserData} from "./FreeStorageHandler.js";
import {handleGetUserPreference, handlePutUserPreference} from "./PreferenceStorageHandler.js";

const userStorageManager = new UserStorageManager(true);
// 메시지 리스너: 탭 저장 및 불러오기
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    switch (message.action) {
        case "putTabData": {
            handlePutUserData(userStorageManager, sendResponse).then();
            break;
        }
        case "getTabData": {
            handleGetUserData(userStorageManager, sendResponse).then();
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
        default: {
            console.log(`chrome.runtime.onMessage()'s action = ${message.action}`);
        }
    }

    return true; // 비동기 응답을 위해 true 반환
});
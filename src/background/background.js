/*global chrome*/

import UserStorageManager from "@/services/storage/UserStorageManager.js";

const storageManager = new UserStorageManager(true);
// 메시지 리스너: 탭 저장 및 불러오기
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "putTabData") {
        putTabData().then(() => {
            sendResponse({
                status: "success",
                message: "탭 저장 완료"
            });
        })
    } else if (message.action === "getTabData") {
        try {
            getTabData().then((savedTabData) => {
                sendResponse({
                    status: "success",
                    message: "탭 불러오기 완료",
                    data: savedTabData
                });
            })
        } catch (e) {
            sendResponse({
                status: "error",
                message: `${message.action}'s Error: ${e.message}`
            })
        }
    }

    return true; // 비동기 응답을 위해 true 반환
});

async function putTabData() {
    const currentTabList = await chrome.tabs.query({});
    // saveData로 변경, async 체인 열어서 tabGroup도 추가
    console.log("saveTabs before await")
    await storageManager.putUserTabData(currentTabList);
}

async function getTabData() {
    return await storageManager.getUserTabData();
}
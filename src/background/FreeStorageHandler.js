/*global chrome*/

export async function handlePutUserData(userStorageManager, sendResponse) {
    const currentTabList = await chrome.tabs.query({});
    // saveData로 변경, async 체인 열어서 tabGroup도 추가
    // 자동 저장 시 탭 갯수가 확 줄어들었다면 사용자에게 알림 띄우는 기능 필요함 (다른 탭 닫기 개같은 거 방지)
    await userStorageManager.putUserTabData(currentTabList).then(() => {
        sendResponse({
            status: "success",
            message: "탭 저장 완료"
        });
    })
}

export async function handleGetUserData(userStorageManager, sendResponse) {
    try {
        await userStorageManager.getUserTabData().then((savedTabData) => {
            sendResponse({
                status: "success",
                message: "탭 불러오기 완료",
                data: savedTabData
            });
        })
    } catch (e) {
        sendResponse({
            status: "error",
            message: `handleGetUserData()'s Error: ${e.message}`
        })
    }
}
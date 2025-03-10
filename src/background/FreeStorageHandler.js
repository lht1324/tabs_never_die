/*global chrome*/

export async function handlePutUserTabData(userStorageManager, sendResponse) {
    const currentTabList = await chrome.tabs.query({});
    const currentTabGroupList = await chrome.tabGroups.query({});
    // group 포함 안 됐을 때는 groupId -1로 들어온다
    // group title이 포함 안 되는데 따로따로 저장한 뒤 붙여줘야 할 것 같다.

    // saveData로 변경, async 체인 열어서 tabGroup도 추가
    // 자동 저장 시 탭 갯수가 확 줄어들었다면 사용자에게 알림 띄우는 기능 필요함 (다른 탭 닫기 개같은 거 방지)
    await userStorageManager.putUserTabData(currentTabList, currentTabGroupList).then(() => {
        if (sendResponse) {
            sendResponse({
                status: "success",
                message: "탭 저장 완료"
            });
        }
    })
}

export async function handleGetUserTabData(userStorageManager, sendResponse) {
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
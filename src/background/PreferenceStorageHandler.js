export async function handlePutUserPreference(userStorageManager, sendResponse, preferenceData) {
    // saveData로 변경, async 체인 열어서 tabGroup도 추가
    // 자동 저장 시 탭 갯수가 확 줄어들었다면 사용자에게 알림 띄우는 기능 필요함 (다른 탭 닫기 개같은 거 방지)
    await userStorageManager.putUserPreference(preferenceData).then(() => {
        sendResponse({
            status: "success",
            message: "설정 저장 완료"
        });
    })
}

export async function handleGetUserPreference(userStorageManager, sendResponse) {
    try {
        await userStorageManager.getUserPreference().then((savedPreferenceData) => {
            sendResponse({
                status: "success",
                message: "설정 불러오기 완료",
                data: savedPreferenceData
            });
        })
    } catch (e) {
        sendResponse({
            status: "error",
            message: `handleGetUserPreference()'s Error: ${e.message}`
        })
    }
}
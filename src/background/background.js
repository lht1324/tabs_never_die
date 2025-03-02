/*global chrome*/

import UserStorageManager from "@/services/storage/UserStorageManager.js";

const storageManager = new UserStorageManager(true);
// 메시지 리스너: 탭 저장 및 불러오기
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    console.log(`background onMessage: ${message.action}`) // 로그 확인됨
    if (message.action === "saveTabs") {
        console.log(`background onMessage's saveTabs`) // 로그 확인됨
        // queryInfo 항목 중 currentWindow true 놓을 시 듀얼 모니터 같은 경우에 현재 창인지 구분 가능함
        // 옵션으로 추가해야 할 듯
        const tabs = await chrome.tabs.query({});
        const originalTabList = tabs.map((tab, index) => {
            return {
                absoluteIndex: index + 1,
                faviconUrl: tab.favIconUrl,
                groupId: tab.groupId, // not -1 -> has group
                windowIndex: tab.index,
                lastAccessed: tab.lastAccessed,
                pinned: tab.pinned,
                title: tab.title,
                url: tab.url,
                windowId: tab.windowId,
            }
        });

        originalTabList.sort((a, b) => a.absoluteIndex - b.absoluteIndex)

        const groupedByWindowTabList = [];

        originalTabList.forEach((tab, index) => {
            if (groupedByWindowTabList.length === 0 || (index > 0 && originalTabList[index - 1].windowId !== tab.windowId))
                groupedByWindowTabList.push([]);

            groupedByWindowTabList[groupedByWindowTabList.length - 1].push(tab);
        })

        groupedByWindowTabList.forEach((tabList, window) => {
            tabList.forEach((tab, index) => {
                console.log(`[${window}][${index}] = ${tab.title}`)
            })
        })

        /**
         * tab에 windowId라는 항목 존재함
         * 이건 윈도우 열 때마다 달라지는 거라서 이걸 저장하긴 좀 그렇고 같은 윈도우끼리 그룹화하는 방식으로 사용하자
         * 인덱스는 0번부터 n번까지 가면서 윈도우까지 가니 windowId로 다른 윈도우를 구분해서 윈도우끼리 묶으면 될 듯 하다
         * 이 와중에 그룹도 추가해야 하노 ㅅㅂ ㅋㅋㅋㅋㅋ
         *
         * 오케이 정함
         * 1. windowId로 1차 그룹화
         * 2. window 내부에선 index를 따라가지만 group title 부여해서 복구할 시 groupTitle로 묶어주기
         * 3. [윈도우][인덱스] 이차원 배열로 갈까, 아니면 그룹만 따로 구분을 해야할까?
         * 따로 구분이 맞을 것 같다. 그룹도 결국 인덱스를 따라가고 타입의 일종이라 봐야 한다.
         *
         * 절차
         * 1. 이차원 배열을 생성한다.
         * 2. 탭 리스트로 for문을 돌리면서 배열의 [0][0]부터 계속 넣는다.
         * 3. previousWindowId 등의 변수를 생성해 체크하다가, windowId가 달라지는 순간 for문에서 사용되는 windowIndex를 1 증가시키고 새로 넣는다.
         * 4. 반복한다.
         *
         * - 그룹은 따로
         * - windowId는 for문 내부에서 사용할 정도면 된다.
         */

        await storageManager.saveUserTabList(groupedByWindowTabList);
        sendResponse({ status: "success", message: "탭 저장 완료" });
    }

    else if (message.action === "getTabs") {
        console.log(`background onMessage's getTabs`) // 로그 확인됨
        const savedTabs = await storageManager.getUserTabList();
        sendResponse({ status: "success", data: savedTabs });
    }

    return true; // 비동기 응답을 위해 true 반환
});
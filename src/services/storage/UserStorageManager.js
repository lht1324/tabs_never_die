/**
 * 1. 탭은 oldTabList, newTabList 두 개의 배열에 저장된다.
 * 2. 탭은 주기에 한 번씩 저장된다.
 *     2-1. 주기는 설정 페이지에서 설정할 수 있다.
 *     2-2. 주기는 5분, 10분, 15분, 30분, 60분 중 하나를 선택할 수 있다.
 *     2-3. 만약 주기가 돌아왔을 때 새 탭 데이터와 저장된 탭 데이터의 갯수 차이가 10개 이상 나면 '다른 탭 닫기' 가 실행되었을 가능성이 있다. (정밀한 판단은 불가능)
 * 3. 기존 newTabList는 oldTabList로 이동하고, 새로운 탭 데이터는 newTabList에 저장된다.
 * 4. 저장방식 비교 필요
 *     4-1. chrome.storage.local
 *         - 저장 용량 많음
 *         - 동기 처리 불가 (기기 간 탭 공유는 옵션 중 하나)
 *     4-2. chrome.storage.sync
 *         - 저장 용량 제한 있음 (100KB)
 *         - 동기 처리 가능
 *         - 기기 간 탭 공유 가능
 * 5. 결론
 *     5-1. 유료 플랜 사용 시 chrome.storage.sync 사용
 *         5-1-1. supabase와 연결하는 용도로 sync 사용. OAuth에 대해 알아볼 필요 있음
 *         5-1-2. GPT는 supabase 키 저장이 너무 위험하니 jwt 토큰 사용하는 것을 추천함
 *     5-2. 무료 플랜 사용 시 chrome.storage.local 사용
 *         5-2-1. 지워질 가능성이 존재한다고 유저에게 미리 고지해야 함.
 */


// 플랜에 따라 저장소 객체 생성
import FreeStorage from "./FreeStorage.js";
import PreferenceStorage from "./PreferenceStorage.js";

export default class UserStorageManager {
    constructor(isFreemium) {
        this.storage = isFreemium ? new FreeStorage() : null;
        this.preferenceStorage = new PreferenceStorage();
    }

    /**
     * FreeStorage, PremiumStorage
     */

    async putUserTabData(currentTabList, currentTabGroupList) {
        // group Map 형태로 가져온 뒤 groupId로 가져올 수 있도록 하기
        // 가능하면 group title 넣어주고 그걸로 묶어주기
        const mappedTabList = currentTabList.map((tab, index) => {
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
        // tabGroupList는 그대로 저장해도 될 것 같다

        /*
         {
             absoluteIndex: Number,
             faviconUrl: String,
             groupId: Number,
             windowIndex: Number,
             lastAccessed: String (Date),
             pinned: Boolean,
             title: String,
             url: String,
             windowId: Number,
         }
         {
             collapsed: Boolean,
             color: String,
             id: Number,
             title: String,
             windowId: Number
         }
         */

        mappedTabList.sort((a, b) => a.absoluteIndex - b.absoluteIndex)

        const groupedByWindowTabList = [];

        mappedTabList.forEach((tab, index) => {
            if (groupedByWindowTabList.length === 0 || (index > 0 && mappedTabList[index - 1].windowId !== tab.windowId))
                groupedByWindowTabList.push([]);

            groupedByWindowTabList[groupedByWindowTabList.length - 1].push(tab);
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

        await this.storage?.putUserTabData(groupedByWindowTabList, currentTabGroupList);
    }

    async getUserTabData() {
        const {
            tabList,
            tabGroupList,
            lastSaveDate
        } = await this.storage?.getUserTabData();

        const groupMap = { };
        tabGroupList.forEach((group) => {
            groupMap[group.id] = group;
        });

        const mappedTabDataList = tabList.map((tabListByWindow) => {
            return tabListByWindow.map((tab) => {
                return {
                    ...tab,
                    // group: (tab.groupId != null && groupMap[tab.groupId]) ? groupMap[tab.groupId] : null,
                    group: (tab.groupId !== -1) ? groupMap[tab.groupId] : null,
                }
            })
        })

        return {
            tabDataList: mappedTabDataList,
            lastSaveDate,
        };
        // return await this.storage?.getUserTabData();
    }

    /**
     * PreferenceStorage
     */

    async putUserPreference(preference) {
        await this.preferenceStorage.putUserPreference(preference);
    }

    async getUserPreference() {
        return await this.preferenceStorage.getUserPreference();
    }
}

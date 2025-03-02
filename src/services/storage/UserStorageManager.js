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

export default class UserStorageManager {
    constructor(isFreemium) {
        this.storage = isFreemium ? new FreeStorage() : null;
    }

    async saveUserTabList(tabList) {
        return this.storage?.saveUserTabList(tabList);
    }

    async getUserTabList() {
        return this.storage?.getUserTabList();
    }
}

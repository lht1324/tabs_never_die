/* global chrome */

import {println} from "../utils/log.js";
import {waitForTabLoad} from "../utils/chromeAPI.js";

export async function restoreTabs(userStorageManager, sendResponse) {
    try {
        const userTabData = await userStorageManager.getUserTabData();
        const tabDataList = userTabData.tabDataList;

        for (const tabListByWindow of tabDataList) {
            const createdWindow = await new Promise((resolve, reject) => {
                chrome.windows.create({ url: tabListByWindow[0].url, focused: true, type: "normal" }, (createdWindow) => {
                    if (chrome.runtime.lastError) {
                        reject(chrome.runtime.lastError);
                    } else {
                        resolve(createdWindow);
                    }
                })
            })

            const createdTabIdList = [];

            // 2. 현재 윈도우 내에서 그룹핑을 위한 맵 (키: 저장된 그룹 id, 값: chrome에서 새로 할당받은 그룹 id)
            // 기존에 저장된 그룹 id가 아니라 신규로 배정받은 그룹 id가 저장되어야 한다.
            const groupMap = {};

            for (const tab of tabListByWindow) {
                if (tab.windowIndex !== 0) {
                    // 각 탭을 inactive 상태로 생성합니다.
                    // 모든 탭이 로딩 상태로 들어간다.
                    // 고민을 좀 해야 할 듯 하다.
                    const createdTab = await new Promise((resolve, reject) => {
                        chrome.tabs.create({
                            windowId: createdWindow.id,
                            url: tab.url,
                            active: false
                        }, (newTab) => {
                            if (chrome.runtime.lastError) {
                                reject(chrome.runtime.lastError);
                            } else {
                                resolve(newTab);
                            }
                        });
                    });

                    // 5. 탭에 그룹 정보가 있다면 그룹화 처리
                    if (tab.group) {
                        const savedGroupId = tab.group.id; // 저장된 그룹 id
                        // let chromeGroupId = groupMap[savedGroupId];

                        if (groupMap[savedGroupId]) {
                            // 이미 그룹이 생성된 경우, 해당 탭을 기존 그룹에 추가
                            // 복원 과정에서 생성했을 경우 기존 저장되었던 groupId와 다를 수밖에 없다.
                            await new Promise((resolve, reject) => {
                                chrome.tabs.group({ groupId: groupMap[savedGroupId], tabIds: createdTab.id }, (updatedGroupId) => {
                                    if (chrome.runtime.lastError) {
                                        println(`Error: ${chrome.runtime.lastError.message}`)
                                        reject(chrome.runtime.lastError);
                                    } else {
                                        println(`Success: ${updatedGroupId}`)
                                        resolve(updatedGroupId);
                                    }
                                });
                            });
                        } else {
                            // 그룹이 아직 생성되지 않은 경우, 새 그룹 생성
                            // 새로 생성하려면 tab id만 전달

                            groupMap[savedGroupId] = await new Promise((resolve, reject) => {
                                chrome.tabs.group({ tabIds: createdTab.id }, (generatedGroupId) => {
                                    if (chrome.runtime.lastError) {
                                        println(`Error: ${chrome.runtime.lastError.message}`)
                                        reject(chrome.runtime.lastError);
                                    } else {
                                        // groupMap[savedGroupId] = generatedGroupId;
                                        resolve(generatedGroupId);
                                    }
                                });
                            });

                            println(`group status = ${JSON.stringify(tab.group)}`)
                            // 그룹의 상태 업데이트
                            await new Promise((resolve, reject) => {
                                chrome.tabGroups.update(groupMap[savedGroupId], {
                                    title: tab.group.title,
                                    color: tab.group.color,
                                    collapsed: false
                                }, () => {
                                    if (chrome.runtime.lastError) {
                                        println(`Error: ${chrome.runtime.lastError.message}`)
                                        reject(chrome.runtime.lastError);
                                    } else {
                                        resolve();
                                    }
                                });
                            });
                        }
                    }

                    createdTabIdList.push(createdTab.id);
                }
            }

            const discardPromises = createdTabIdList.map((createdTabId) => {
                return waitForTabLoad(createdTabId, () => { }).then(() => {
                    return new Promise((resolve, reject) => {
                        // waitForTabLoad(createdTabId, () => { }); // 최대 10초 대기
                        chrome.tabs.discard(createdTabId, (discardedTab) => {
                            if (chrome.runtime.lastError) {
                                console.error(`Discard error: ${chrome.runtime.lastError.message}`);
                                reject(chrome.runtime.lastError);
                            } else {
                                console.log(`Tab ${createdTabId} discarded successfully`);
                                resolve(discardedTab);
                            }
                        });
                    });
                }).catch((error) => {
                    println(`waitForTabLoad Error: ${error.message}`)
                    return Promise.resolve(null);
                })
            })

            try {
                // 순서대로 순차, 병렬 비동기
                // await Promise.all(discardPromises);
                Promise.all(discardPromises).then();
                println("async chaining is finished.")
            } catch (error) {
                println(`Error: ${error.message}`)
            }
        }

        sendResponse({
            status: "success",
            message: `restoreTab() is success.`
        })
    } catch (e) {
        sendResponse({
            status: "error",
            message: `restoreTab()'s Error: ${e.message}`
        })
    }
}
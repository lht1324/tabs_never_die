/*global chrome*/

import {useEffect} from "react";
import {println} from "./log.js";

/**
 * @param action
 * @param data
 * @param onSuccess
 * @param onFailure
 *
 * Default response: { status, message, data? }
 */
export function sendMessage(action, onSuccess, onFailure, data) {
    chrome.runtime.sendMessage({ action: action, data: data }, (response) => {
        if (response.status === "success") {
            response.data
                ? onSuccess(response.data)
                : onSuccess();
        } else {
            onFailure
                ? onFailure(response.message)
                : println(`sendMessage(${action}) Error: ${response.message}`);
        }
    });
}

export function updateTabURL(
    index,
    url,
    currentWindow = true,
    onSuccess = () => { },
    onFailure = () => { }
) {
    chrome.tabs.query({ currentWindow: currentWindow, index: index }, (tabs) => {
        if (tabs && tabs.length > 0) {
            chrome.tabs.update(tabs[0].id, { url: url }, () => {
                onSuccess();
            })
        } else {
            println(`Cannot find tab[${index}].`)
            onFailure();
        }
    })
}

/**
 * Hook
 */
export function useChromeListener(action, callback) {
    return useEffect(() => {
        const messageListener = (message) => {
            if (message.action === action) {
                callback();
            }
        }
        chrome.runtime.onMessage.addListener(messageListener)

        return () => {
            chrome.runtime.onMessage.removeListener(messageListener);
        }
    }, [])
}

/**
 * 지정된 탭 ID의 로딩 상태가 완료될 때까지 기다리는 함수.
 * @param {number} tabId - 확인할 탭의 ID
 * @param {() => {}} onSuccess - 확인할 탭의 ID
 * @param {() => {}} onFailure - 확인할 탭의 ID
 * @param {number} timeout - 최대 대기 시간 (밀리초)
 * @param {number} interval - 폴링 간격 (밀리초)
 * @returns {Promise} - 탭의 로딩이 완료되면 탭 객체를 resolve, timeout 시 reject
 */
export async function waitForTabLoad(
    tabId,
    onSuccess,
    onFailure = () => { },
    timeout = 30000,
    interval = 100
) {
    return new Promise((resolve, reject) => {
        const startTime = Date.now();
        function checkTab() {
            chrome.tabs.get(tabId, (tab) => {
                if (chrome.runtime.lastError) {
                    onFailure();
                    reject(chrome.runtime.lastError);
                    return;
                }
                // 탭의 URL이 "about:blank"가 아니고, 상태가 "complete"이면 로딩 완료
                // if (tab.url !== "about:blank" && tab.status === "complete") {
                println(`${tab.title}: ${tab.url}, ${tab.favIconUrl}, ${tab.status}`)
                if (tab.url && tab.url !== "about:blank") {
                    onSuccess();
                    resolve(tab);
                } else if (Date.now() - startTime > timeout) {
                    onFailure();
                    reject(new Error("Tab did not finish loading within timeout"));
                } else {
                    setTimeout(checkTab, interval);
                }
            });
        }
        checkTab();
    });
}
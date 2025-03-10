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
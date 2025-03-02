/*global chrome*/

export async function sendMessage(action) {
    await chrome.runtime.sendMessage({ action: action });
}
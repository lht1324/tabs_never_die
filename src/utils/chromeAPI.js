/*global chrome*/

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
                : console.log(`sendMessage(${action}) Error: ${response.message}`);
        }
    });
}
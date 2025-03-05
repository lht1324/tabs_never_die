/*global chrome*/

/**
 * @param action
 * @param onSuccess
 * @param onFailure
 *
 * Default response: { status, message, data? }
 */
export function sendMessage(action, onSuccess, onFailure) {
    chrome.runtime.sendMessage({ action: action }, (response) => {
        console.log(`response in sendMessage(): ${JSON.stringify(response)}`);
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
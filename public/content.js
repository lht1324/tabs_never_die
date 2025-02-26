document.addEventListener('contextmenu', function(event) {
    chrome.runtime.sendMessage({type: "rightClick", url: window.location.href});
});

chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(
        tabs[0].id,
        {
            type: "I am popup",
            yourData: "data..."
        },
        (response) => {
            console.log(response);
        }
    );
});
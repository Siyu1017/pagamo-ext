var globalWindow = window;

// 監聽 XMLHttpRequest
const originalXhrOpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function (method, url) {
    this._url = url;
    return originalXhrOpen.apply(this, arguments);
};

const originalXhrSend = XMLHttpRequest.prototype.send;
XMLHttpRequest.prototype.send = function (d) {
    const xhr = this;
    const originalOnReadyStateChange = xhr.onreadystatechange;
    xhr.onreadystatechange = function () {
        if (this.readyState === 4) {
            if (xhr._url == "/rooms/train.json" || xhr._url == "/rooms/attack.json") {
                window.postMessage({ type: "question", data: xhr.response, url: xhr._url }, window.location.origin);
            } else if (xhr._url == "/rooms/submit.json") {
                window.postMessage({ type: "answer", data: xhr.response, url: xhr._url, give: decodeURI(d) }, window.location.origin);
            }
        }
        if (originalOnReadyStateChange) {
            originalOnReadyStateChange.apply(this, arguments);
        }
    };
    return originalXhrSend.apply(this, arguments);
};

// 監聽 fetch
const originalFetch = globalWindow.fetch;
globalWindow.fetch = function (url, options) {
    return originalFetch.apply(this, arguments).then(response => {
        console.log("fetch response received:", url, response);
        return response;
    });
};

// 監聽 WebSocket
const originalWebSocket = globalWindow.WebSocket;
globalWindow.WebSocket = function (url, protocols) {
    console.log("WebSocket connection established:", url, protocols);
    const socket = new originalWebSocket(url, protocols);
    const originalSend = socket.send;
    socket.send = function (data) {
        console.log("WebSocket message sent:", data);
        return originalSend.apply(this, arguments);
    };
    socket.addEventListener("message", function (event) {
        console.log("WebSocket message received:", event.data);
    });
    return socket;
};
window.postMessage({ type: "check", data: null }, window.location.origin);
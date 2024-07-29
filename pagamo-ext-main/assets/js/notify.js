var icons = {
    done: `<svg class="notify-done" xmlns="https://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="notify-circle" cx="26" cy="26" r="25" fill="none" /><path class="notify-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" /></svg>`,
    error: `<svg class="notify-error" xmlns="https://www.w3.org/2000/svg" viewBox="0 0 52 52"><circle class="notify-circle" cx="26" cy="26" r="25" fill="none" /><path class="notify-line" fill="none" d="M17.36,34.736l17.368-17.472" /><path class="notify-line" fill="none" d="M34.78,34.684L17.309,17.316" /></svg>`,
    loading: `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" class="notify-loading notify-loading-spinner"></svg>`
}

var mergeDeep = (target, ...sources) => {
    if (!sources.length) return target;
    const source = sources.shift();
    function isObject(item) {
        return (item && typeof item === 'object' && !Array.isArray(item));
    }
    if (isObject(target) && isObject(source)) {
        for (const key in source) {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} });
                mergeDeep(target[key], source[key]);
            } else {
                Object.assign(target, { [key]: source[key] });
            }
        }
    }
    return mergeDeep(target, ...sources);
}

class Notify {
    constructor(icon, message, config = {}) {
        var defaultConfig = {
            close: icon == "loading" ? false : true,
            loadingBar: icon == "loading" ? true : false
        }
        var config = mergeDeep(defaultConfig, config);
        if (!document.querySelector(".notify-container")) {
            var container = document.createElement("div");
            container.className = "notify-container";
            document.body.appendChild(container);
        }
        var notify = document.createElement("div");
        notify.className = "notify";
        notify.innerHTML = `
        <div class="notify-content">
            <div class="notify-icon">
                ${icons[icon] ? icons[icon] : icons['done']}
            </div>
            <div class="notify-text">${message}</div>
        </div>
        ${config.close == true ? '<div class="notify-close"></div>' : ''}${config.loadingBar == true ? '<div class="notify-loading-bar"></div>' : ''}`;
        // document.querySelector(".notify-container").appendChild(notify);
        this.notify = notify;
        var _this = this;
        if (config.close == true) {
            notify.querySelector(".notify-close").addEventListener("click", () => {
                _this.close();
            })
        }
        if (config.loadingBar == true) {
            this.changeProgress = function (percent = Math.random() * 100) {
                this.currentProgress = percent;
                notify.querySelector('.notify-loading-bar').style.width = `${percent}%`;
            }

            this.hideProgressBar = function () {
                notify.querySelector('.notify-loading-bar').style.width = `100%`;
                setTimeout(() => {
                    notify.querySelector('.notify-loading-bar').style.height = '0px';
                }, 100)
            }
        }
        this.extensionProgressContainer = document.createElement("div");
        this.extensionProgressBox = document.createElement("div");
        this.extensionProgressContainer.style = "width: 100vw;position: fixed;top: 48px;display: flex;justify-content: center;z-index: 2147483647;pointer-events: none;user-select: none;-webkit-user-drag: none;transition: all .1s ease-in-out;opacity:0;"
        this.extensionProgressBox.style = "width: fit-content;padding: 8px 12px;background: #fff;color: #000;border-radius: 6px;font-size: 16px;box-shadow: 0 0 16px 4px rgba(0, 0, 0, .15);";
        this.extensionProgressBox.innerHTML = message;
        this.extensionProgressContainer.appendChild(this.extensionProgressBox);
        document.body.appendChild(this.extensionProgressContainer);
        this.extensionProgressContainer.style.opacity = '1';
    }
    currentProgress = 0
    changeIcon(icon) {
        this.notify.querySelector('.notify-icon').innerHTML = icons[icon] ? icons[icon] : icons['done']
    }
    changeMessage(message) {
        this.notify.querySelector('.notify-text').innerHTML = message;
    }
    close() {
        this.notify.classList.add("hide");
        this.extensionProgressContainer.style.opacity = '0';
        setTimeout(() => {
            this.notify.remove();
            this.extensionProgressContainer.remove();
        }, 200)
    }
}
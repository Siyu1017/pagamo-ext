/**
 * PaGamO Answer Database
 * Copyright 2023 - 2024 (c) Siyu1017
 * All rights reserved.
 */

"use strict";

(() => {
    var Extension_Version = "2.2.0";

    function setcookie(name, value, daysTolive) { let cookie = name + "=" + encodeURIComponent(value); if (typeof daysTolive === "number") cookie += "; max-age =" + (daysTolive * 60 * 60 * 24); document.cookie = cookie; }; function getCookie(cname) { let name = cname + "="; let decodedCookie = decodeURIComponent(document.cookie); let ca = decodedCookie.split(';'); for (let i = 0; i < ca.length; i++) { let c = ca[i]; while (c.charAt(0) == ' ') { c = c.substring(1); } if (c.indexOf(name) == 0) { return c.substring(name.length, c.length); } } return ""; };

    function delay(delayInms) {
        return new Promise(resolve => setTimeout(resolve, delayInms));
    }

    function randomString(length) {
        if (!length) return console.warn('Option Invalid');
        var characters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'm', 'n', 'p', 'Q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '2', '3', '4', '5', '6', '7', '8', '9'],
            str = '';
        for (let i = 0; i < length; i++) {
            str += characters[Math.floor(Math.random() * characters.length)];
        }
        return str;
    }

    function getStackTrace() {
        var stack;

        try {
            throw new Error('');
        } catch (error) {
            stack = error.stack || '';
        }

        stack = stack.split('\n').map(function (line) { return line.trim(); });
        return stack.splice(stack[0] == 'Error' ? 2 : 1);
    }
    
    localStorage.getItem('pgo-ext-mode') || localStorage.setItem('pgo-ext-mode', false);
    localStorage.getItem('pgo-ext-show-progress') || localStorage.setItem('pgo-ext-show-progress', false);

    ; (async () => {
        var req = async (m, u, t, h, d, f) => {
            try {
                var aj = new XMLHttpRequest();
                aj.open(m, u, t);
                Array.isArray(h) == true && h.forEach(e => {
                    aj.setRequestHeader(e[0], e[1]);
                });
                aj.send(d);
                f && {}.toString.call(f) === '[object Function]' ?
                    aj.onloadend = () => { f(aj) }
                    : null;
                return aj;
            } catch (e) { return console.log("An error occurred while executing : ", e); };
        };

        var $ = (s, t) => { return t == true ? document.querySelectorAll(s) : document.querySelector(s); };

        var mode = {
            contests: location.pathname.split("/")[1] == "contests" ? true : false,
            random: false,
            auto_complete: false
        };

        /**
         * ansTypes ? alphabet => get(answer_button_count) => get(answers_count) => getAnswer("alphabet", abc, ac); set("options", selections);
         * ansTypes ? alphabet => get(answer_button_count) => get(answers_count) => getAnswer("alphabet", abc, ac); set("options", selections);
         */

        // window.addEventListener("load", () => {
        var answer = [];
        var order = ["A", "B", "C", "D", "E", "F", "G", "H"];
        var question = null;
        var quetype = 0;
        var option = [];
        var questionExist = false;
        var question_temp_data = {};

        var loadingNotify = new Notify("loading", "安裝中...", {
            close: true
        });

        function changeLoagingProgress() {
            var percent = Math.random() * 5 + loadingNotify.currentProgress;
            if (percent > 70) return;
            loadingNotify.changeProgress(percent);
        }

        var showed_message = false;

        function installFailed() {
            if (showed_message == true) return;
            showed_message = true;
            clearInterval(changeLoagingProgress);
            loadingNotify.hideProgressBar();
            setTimeout(() => {
                loadingNotify.close();
                setTimeout(() => {
                    var message = new Notify("error", "安裝失敗");
                    setTimeout(() => {
                        message.close();
                    }, 3000);
                }, 200);
            }, 200);
        }

        function installSuccessfully() {
            if (showed_message == true) return;
            showed_message = true;
            clearInterval(changeLoagingProgress);
            loadingNotify.hideProgressBar();
            setTimeout(() => {
                loadingNotify.close();
                setTimeout(() => {
                    var message = new Notify("done", "安裝成功!");
                    setTimeout(() => {
                        message.close();
                    }, 3000);
                }, 200);
            }, 200);
        }

        setInterval(changeLoagingProgress, 500);

        /*
        function checkServerAvailable(address) {
            return new Promise(function (resolve, reject) {
                fetch(address + "/api/availability", {
                    "body": null,
                    "method": "POST",
                    "mode": "no-cors",
                    "redirect": "follow"
                }).then(res => {
                    if (res.status == 200) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                });
            })
        }
    
        var serverIndex = 0;
        */

        function getPosition(element) {
            function offset(el) {
                var rect = el.getBoundingClientRect(),
                    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
                    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
            }
            return { x: offset(element).left, y: offset(element).top };
        }

        function HTMLEncode(str) {
            var s = "";
            if (str.length == 0) return "";
            s = str.replaceAll(/&/g, "&amp;");
            s = s.replaceAll(/</g, "&lt;");
            s = s.replaceAll(/>/g, "&gt;");
            s = s.replaceAll(/ /g, "&nbsp;");
            s = s.replaceAll(/\'/g, "&#39;");
            s = s.replaceAll(/\"/g, "&quot;");
            return s;
        }

        if ('show' == false) {
            var list = initProgressList();
            var list_pos = {
                x: 0,
                y: 0
            }, moving = false;
            list.list.addEventListener("mousedown", (e) => {
                moving = true;
                list_pos.x = e.clientX;
                list_pos.y = e.clientY;
            })
            window.addEventListener("mousemove", (e) => {
                if (moving == true) {
                    list.list.style.left = getPosition(list.list).x + e.clientX - list_pos.x + "px";
                    list.list.style.top = getPosition(list.list).y + e.clientY - list_pos.y + "px";
                    list_pos.x = e.clientX;
                    list_pos.y = e.clientY;
                }
            })
            window.addEventListener("mouseup", (e) => {
                moving = false;
                list_pos = {
                    x: 0,
                    y: 0
                }
            })
            window.onblur = () => {
                moving = false;
                list_pos = {
                    x: 0,
                    y: 0
                }
            }
            var globalWindow = window;

            function monitorRequests() {
                const originalXhrOpen = XMLHttpRequest.prototype.open;
                XMLHttpRequest.prototype.open = function (method, url) {
                    this._url = url;
                    this._method = method;
                    var split = new URL(url).pathname.split('/');
                    this.item = list.addToStatusList(`${this._method.toUpperCase()} ${HTMLEncode(split[split.length - 1] + new URL(url).search)}`);
                    return originalXhrOpen.apply(this, arguments);
                };
                const originalXhrSend = XMLHttpRequest.prototype.send;
                XMLHttpRequest.prototype.send = function () {
                    const xhr = this;
                    const originalOnReadyStateChange = xhr.onreadystatechange;
                    xhr.onreadystatechange = function () {
                        if (this.readyState === 4) {
                            if (this.status >= 200 && this.status < 300) {
                                this.item.done();
                            } else {
                                this.item.error();
                            }
                        }
                        if (originalOnReadyStateChange) {
                            originalOnReadyStateChange.apply(this, arguments);
                        }
                    };
                    return originalXhrSend.apply(this, arguments);
                };
                const originalFetch = globalWindow.fetch;
                globalWindow.fetch = function (url, options) {
                    var split = new URL(url).pathname.split('/');
                    var item = list.addToStatusList(`Fetch ${HTMLEncode(split[split.length - 1] + new URL(url).search)}`);
                    return originalFetch.apply(this, arguments).then(response => {
                        if (response.ok == true) {
                            item.done();
                        } else {
                            item.error();
                        }
                        return response;
                    }).catch(err => {
                        item.error();
                    });
                };
            }
            monitorRequests();
        }

        var availableServers = [];
        var currentServer = null;

        async function serversHandler(servers) {
            var availability = await checkServerAvailable(servers[serverIndex]);
            if (availability == true) {
                availableServers.push(servers[serverIndex]);
            }
            serverIndex++;
            if (serverIndex == servers.length) return () => {
                serversHandlerCompleted();
            };
            serversHandler(servers);
        }

        function checkNeedToUpdate(version) {
            if (Number(Extension_Version.split('.')[0]) > Number(version.split('.')[0])) {
                return false;
            } else if (Number(Extension_Version.split('.')[0]) < Number(version.split('.')[0])) {
                return true
            } else {
                if (Number(Extension_Version.split('.')[1]) > Number(version.split('.')[1])) {
                    return false;
                } else if (Number(Extension_Version.split('.')[1]) < Number(version.split('.')[1])) {
                    return true;
                } else {
                    if (Number(Extension_Version.split('.')[2]) >= Number(version.split('.')[2])) {
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        }

        fetch("https://siyu1017.github.io/pagamo-ext/update.json").then(res => {
            if (res.ok) {
                return res.json();
            }
        }).then(extension => {
            if (checkNeedToUpdate(extension.version) == true) {
                var modal = document.createElement("div");
                var levels = {
                    "required": "請立即",
                    "suggestion": "建議"
                }
                var updates = "";
                extension.content.forEach(line => {
                    updates += `<li>${line}</li>`;
                })
                modal.innerHTML = `
        <div class="ext-mode-modal">
            <div class="ext-mode ext-warn-mode">
                <div class="ext-modal-text">
                    <div>已檢測到新的版本<span style="font-family: monospace;"> ( ${Extension_Version} -> ${extension.version} ) </span></div>
                    <div>
                        <div>更新內容 :</div>
                        <ul style="margin: 5px 0 10px 30px;">${updates}</ul>
                    </div>
                    <div>${levels[extension.level]}至<a target="_blank" href="https://github.com/Siyu1017/pagamo-ext/">此處</a>下載新的版本，並於安裝最新版本後，將舊版移除，以避免發生問題</div>
                </div>
            </div>
            <div class="close" onclick="this.parentNode.parentNode.remove();"></div>
        </div>`;
                modal.className = "ext-modal";
                document.body.appendChild(modal);
                return false;
            }
        }).catch(err => {
            var modal = document.createElement("div");
            modal.innerHTML = `<div class="ext-mode-modal"><div class="ext-mode ext-warn-mode"><span class="ext-modal-warn">錯誤 : 無法檢測更新，前往<a target="_blank" href="https://github.com/Siyu1017/pagamo-ext/blob/main/ERROR_HANDLING.md">此處</a>查看相關說明</span></div><div class="close" onclick="this.parentNode.parentNode.remove();"></div></div>`;
            modal.className = "ext-modal";
            document.body.appendChild(modal);
            installFailed();
            throw new Error("Failed to install");
        })

        fetch("https://siyu1017.github.io/pagamo-ext/servers.json").then(res => {
            return res.json();
        }).then(servers => {
            availableServers.push(servers[0]);
            // serversHandler(servers);
            serversHandlerCompleted();
        }).catch(err => {
            var modal = document.createElement("div");
            modal.innerHTML = `<div class="ext-mode-modal"><div class="ext-mode ext-warn-mode"><span class="ext-modal-warn">錯誤 : 無法獲取伺服器列表，前往<a target="_blank" href="https://github.com/Siyu1017/pagamo-ext/blob/main/ERROR_HANDLING.md">此處</a>查看相關說明</span></div><div class="close" onclick="this.parentNode.parentNode.remove();"></div></div>`;
            modal.className = "ext-modal";
            document.body.appendChild(modal);
            installFailed();
            throw new Error("Failed to install");
        })

        function randomNumber(n, arr) {
            var number = Math.floor(Math.random() * n);
            if (arr.includes(number)) {
                return randomNumber(n, arr);
            } else {
                return number;
            }
        }

        function generateRandomAnswers(answer_count, button_count) {
            var res = [];
            for (let i = 0; i < answer_count; i++) {
                var number = randomNumber(button_count, res);
                res.push(number);
            }
            return res;
        };

        /*
        function getWorldIDArray() {
            try {
                var id_array = [];
                for (let i = 0; i < document.getElementById("course_select").querySelectorAll("option").length; i++) {
                    id_array.push({
                        id: document.getElementById("course_select").querySelectorAll("option")[i].value,
                        name: document.getElementById("course_select").querySelectorAll("option")[i].innerText
                    });
                }
                return {
                    status: "ok",
                    array: id_array
                };
            } catch (e) {
                return {
                    status: "error"
                }
            }
        }
        function parseCourseCodeFromURL(url) {
            var type = "default";
            var code = url.split(/course_code=/gi)[1];
            if (url.search(/\/contests\//gi) > -1) {
                type = "contests"
                code = url.split(/\/contests\//gi)[1];
            }
            return { type, code };
        }
        async function getCourseCodesFromWorldID(arr) {
            var course_array = [];
            for (const item of arr) {
                await fetch("https://www.pagamo.org/users/change_course_for_websocket", {
                    "headers": {
                        "accept-language": "zh-TW,zh;q=0.9,en;q=0.8,zh-CN;q=0.7,en-US;q=0.6",
                        "cache-control": "no-cache",
                        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
                        "pragma": "no-cache",
                        "sec-fetch-dest": "empty",
                        "sec-fetch-mode": "cors",
                        "sec-fetch-site": "same-origin",
                        "x-csrf-token": form_select_course.querySelector('[name="authenticity_token"]').value,
                        "x-requested-with": "XMLHttpRequest"
                    },
                    "referrerPolicy": "strict-origin-when-cross-origin",
                    "body": `course_id=${item.id}&version=2`,
                    "method": "POST",
                    "mode": "cors",
                    "credentials": "include"
                }).then(res => {
                    return res.json();
                }).then(res => {
                    var courseInfo = parseCourseCodeFromURL(res.url);
                    course_array.push({
                        course_code: courseInfo.code,
                        course_type: courseInfo.type,
                        course_name: item.name
                    });
                }).catch(err => {
                    installFailed();
                }).finally(() => {
                    return;
                })
            };
            return course_array;
        }
        */

        async function serversHandlerCompleted() {
            if (availableServers.length == 0) {
                var modal = document.createElement("div");
                modal.innerHTML = `<div class="ext-mode-modal"><div class="ext-mode ext-warn-mode"><span class="ext-modal-warn">錯誤 : 無可用的伺服器，前往<a target="_blank" href="https://github.com/Siyu1017/pagamo-ext/blob/main/ERROR_HANDLING.md">此處</a>查看相關說明</span></div><div class="close" onclick="this.parentNode.parentNode.remove();"></div></div>`;
                modal.className = "ext-modal";
                document.body.appendChild(modal);
                installFailed();
                return;
            }

            currentServer = availableServers[0];

            console.log('window', window.currentGc);

            var currentGc = 'currentGc' in window ? JSON.stringify(window.currentGc) : null;
            if (currentGc == null) {
                await fetch(location.href, {
                    "referrer": "https://www.pagamo.org/",
                    "referrerPolicy": "strict-origin-when-cross-origin",
                    "body": null,
                    "method": "GET",
                    "mode": "cors",
                    "credentials": "include"
                }).then(res => {
                    return res.text();
                }).then(async content => {
                    currentGc = content.match(/window\.currentGc.*?\(.*?\)/gi)[0].match(/\{.*\}/gi)[0];
                }).catch(err => {
                    console.log(err)
                    installFailed();
                })
            }

            var need_to_update = true;
            var updateElement = document.createElement("div");
            var CourseCodes = [];
            await fetch(currentServer + `/v2/expired/${JSON.parse(currentGc).unique_user_id}`, {
                "body": null,
                "method": "POST",
                "mode": "cors"
            }).then(res => {
                return res.json();
            }).then(res => {
                if (res.status == "ok" && res.expired == false) {
                    need_to_update = false;
                }
            }).catch(err => {
                installFailed();
            }).finally(() => {
                return;
            })
            if (need_to_update == true) {
                updateElement.style = "position: fixed;top: 0px;left: 0px;width: 100vw;height: 100vh;background: rgba(0, 0, 0, 0.7);z-index: 0;opacity: 0;display: flex;align-items: center;justify-content: center;transition: all 0.2s;";
                updateElement.innerHTML = `<div class="pgo-ext-update-element" style="opacity: 0;scale: 2;background: rgb(255, 255, 255);padding: 2rem 4rem 2rem 3rem;border-radius: 6px;font-size: 18px;display: flex;align-items: center;gap: 2rem;transition: all 0.2s;"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" class="notify-loading notify-loading-spinner"></svg>更新使用者資訊中...</div>`;
                document.body.appendChild(updateElement);
                setTimeout(() => {
                    updateElement.querySelector('.pgo-ext-update-element').style.opacity = "1";
                    updateElement.style.zIndex = '999999999999999999999999';
                    updateElement.style.opacity = '1';
                    updateElement.querySelector('.pgo-ext-update-element').style.scale = "1";
                }, 200)
            }
            await fetch("https://www.pagamo.org/api/courses_lobby/courses", {
                "headers": {
                    "content-type": "application/json"
                },
                "referrer": "https://www.pagamo.org/",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": "{\"public\":false,\"category\":\"global\"}",
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            }).then(res => {
                return res.json();
            }).then(res => {
                CourseCodes = res.data.own_courses;
            }).catch(err => {
                CourseCodes = 'error';
            }).finally(() => {
                console.log(CourseCodes);
                return;
            });

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

            var defaultSettings = {
                appearance: {
                    theme: 'system',
                    topPanel: 'original',
                    leftPanel: 'original',
                    userMenu: 'original'
                },
                answeringBehavior: {
                    random: false,
                    autoSelect: true,
                    autoSend: false,
                    autoAction: false
                },
                clientBehavior: {
                    nickname: false,
                    avatar: false,
                    money: false
                },
                developerTools: {
                    pageEditor: false,
                    networkActivity: false,
                    beta: false
                }
            }

            if (!localStorage.getItem('pagamo-extension-settings')) {
                localStorage.setItem('pagamo-extension-settings', JSON.stringify(defaultSettings));
            }

            var settings = mergeDeep(defaultSettings, JSON.parse(localStorage.getItem('pagamo-extension-settings') || {}));

            var selfChange = false;
            var avatarElements = ['.pgo-style-avatar-Bniy_a', '.prev_selfie'];
            var nicknameElements = ['.pgo-style-user-name-2VKMNi', '.js-user-nickname', '#profile_name'];
            var moneyElements = ['#user_money', '.pgo-Money-money-text-2c-pgp', '.frame_money'];
            async function clientChange(fromExtension = true) {
                if (selfChange == true) {
                    return selfChange = false;
                }
                if (settings.clientBehavior.avatar != false) {
                    avatarElements.forEach(selector => {
                        document.querySelectorAll(selector).forEach(avatar => {
                            avatar.style.backgroundImage = `url("${settings.clientBehavior.avatar}")`;
                            selfChange = true;
                        })
                    })
                } else if (fromExtension == true) {
                    avatarElements.forEach(selector => {
                        document.querySelectorAll(selector).forEach(avatar => {
                            avatar.style.backgroundImage = `url("${JSON.parse(currentGc).profile_pic}")`;
                            selfChange = true;
                        })
                    })
                }
                if (settings.clientBehavior.nickname != false) {
                    nicknameElements.forEach(selector => {
                        document.querySelectorAll(selector).forEach(nickname => {
                            nickname.innerHTML = settings.clientBehavior.nickname;
                            selfChange = true;
                        })
                    })
                } else if (fromExtension == true) {
                    nicknameElements.forEach(selector => {
                        document.querySelectorAll(selector).forEach(nickname => {
                            nickname.innerHTML = JSON.parse(currentGc).nickname;
                            selfChange = true;
                        })
                    })
                }
                if (settings.clientBehavior.money != false) {
                    moneyElements.forEach(selector => {
                        document.querySelectorAll(selector).forEach(money => {
                            money.innerHTML = settings.clientBehavior.money;
                            selfChange = true;
                        })
                    })
                } else if (fromExtension == true) {
                    var currentMoney = 0;
                    await fetch("https://www.pagamo.org/users/user_information.js", {
                        "headers": {
                            "content-type": "application/json"
                        },
                        "body": JSON.stringify({
                            gc_id: JSON.parse(currentGc).id
                        }),
                        "method": "POST",
                        "mode": "cors",
                        "credentials": "include"
                    });
                    await fetch("https://www.pagamo.org/users/personal_information.json", {
                        "method": "POST",
                        "mode": "cors",
                        "credentials": "include"
                    }).then(res => {
                        return res.json();
                    }).then(res => {
                        currentMoney = res.data.gamecharacter.money;
                    });
                    moneyElements.forEach(selector => {
                        document.querySelectorAll(selector).forEach(money => {
                            money.innerHTML = currentMoney;
                            selfChange = true;
                        })
                    })
                }
            }
            const ob = new MutationObserver(() => {
                clientChange(false);
            });
            ob.observe(document.body, {
                childList: true,
                subtree: true
            });

            clientChange();

            var inputs = {
                nickname: settingComponent.useInput({
                    placeholder: '顯示名稱',
                    value: settings.clientBehavior.nickname != false ? settings.clientBehavior.nickname : JSON.parse(currentGc).nickname,
                    disabled: settings.clientBehavior.nickname == false
                }, (e) => {
                    settings.clientBehavior.nickname = e.value;
                    localStorage.setItem('pagamo-extension-settings', JSON.stringify(settings));
                    clientChange();
                }),
                avatar: settingComponent.useInput({
                    placeholder: '顯示頭像',
                    value: settings.clientBehavior.avatar != false ? settings.clientBehavior.avatar : JSON.parse(currentGc).profile_pic,
                    disabled: settings.clientBehavior.avatar == false
                }, (e) => {
                    settings.clientBehavior.avatar = e.value;
                    localStorage.setItem('pagamo-extension-settings', JSON.stringify(settings));
                    clientChange();
                }),
                money: settingComponent.useInput({
                    placeholder: '顯示金錢',
                    disabled: settings.clientBehavior.money == false,
                    value: settings.clientBehavior.money != false ? settings.clientBehavior.money : '',
                }, (e) => {
                    settings.clientBehavior.money = e.value;
                    localStorage.setItem('pagamo-extension-settings', JSON.stringify(settings));
                    clientChange();
                })
            }

            var switchDisabledStatus = {
                random: false,
                autoSelect: false,
                autoSend: false
            }

            if (mode.contests == true) {
                // 比賽 ( 禁用隨機模式及自動送出 )
                settings.answeringBehavior.random = false;
                settings.answeringBehavior.autoSend = false;
                switchDisabledStatus.random = true;
                switchDisabledStatus.autoSend = true;
            } else {
                // 非比賽 
                if (settings.answeringBehavior.random == true) {
                    // 隨機模式 ( 啟用自動選擇及自動送出)
                    settings.answeringBehavior.autoSelect = true;
                    settings.answeringBehavior.autoSend = true;
                    switchDisabledStatus.autoSelect = true;
                    switchDisabledStatus.autoSend = true;
                } else if (settings.answeringBehavior.autoSelect == false) {
                    // 未啟用自動選擇及隨機模式 => 禁用自動送出
                    settings.answeringBehavior.autoSend = false;
                    switchDisabledStatus.autoSend = true;
                }
            }

            var switches = {
                nickname: settingComponent.useSwitch({ checked: settings.clientBehavior.nickname != false }, (e) => {
                    inputs.nickname.toggle();
                    settings.clientBehavior.nickname = e.value == true ? inputs.nickname.value : false;
                    localStorage.setItem('pagamo-extension-settings', JSON.stringify(settings));
                    clientChange();
                }),
                avatar: settingComponent.useSwitch({ checked: settings.clientBehavior.avatar != false }, (e) => {
                    inputs.avatar.toggle();
                    settings.clientBehavior.avatar = e.value == true ? inputs.avatar.value : false;
                    localStorage.setItem('pagamo-extension-settings', JSON.stringify(settings));
                    clientChange();
                }),
                money: settingComponent.useSwitch({ checked: settings.clientBehavior.money != false }, (e) => {
                    inputs.money.toggle();
                    settings.clientBehavior.money = e.value == true ? inputs.money.value : false;
                    localStorage.setItem('pagamo-extension-settings', JSON.stringify(settings));
                    clientChange();
                }),
                random: settingComponent.useSwitch({
                    checked: settings.answeringBehavior.random,
                    disabled: switchDisabledStatus.random
                }, (e) => {
                    // 比賽時強制禁用
                    if (mode.contests == true) {
                        switches.random.set('disabled', true);
                        if (e.value != false) {
                            switches.random.set('checked', false);
                        }
                        settings.answeringBehavior.random = false;
                        return;
                    }
                    settings.answeringBehavior.random = e.value;
                    localStorage.setItem('pagamo-extension-settings', JSON.stringify(settings));
                    if (e.value == true) {
                        switches.autoSelect.set('checked', true);
                        switches.autoSend.set('checked', true);
                        switches.autoSelect.set('disabled', true);
                        switches.autoSend.set('disabled', true);
                    } else {
                        switches.autoSelect.set('disabled', false);
                        switches.autoSend.set('disabled', false);
                    }
                }),
                autoSelect: settingComponent.useSwitch({
                    checked: settings.answeringBehavior.autoSelect,
                    disabled: switchDisabledStatus.autoSelect
                }, (e) => {
                    // 隨機模式時強制啟用
                    if (settings.answeringBehavior.random == true) {
                        switches.autoSelect.set('disabled', true);
                        if (e.value != true) {
                            switches.autoSelect.set('checked', true);
                        }
                        settings.answeringBehavior.autoSelect = true;
                        return;
                    }
                    settings.answeringBehavior.autoSelect = e.value;
                    localStorage.setItem('pagamo-extension-settings', JSON.stringify(settings));
                    // 自動送出於比賽模式時強制禁用，於自動選擇模式時可用
                    if (e.value == true && mode.contests == false) {
                        switches.autoSend.set('disabled', false);
                    } else {
                        switches.autoSend.set('disabled', true);
                        switches.autoSend.set('checked', false);
                    }
                }),
                autoSend: settingComponent.useSwitch({
                    checked: settings.answeringBehavior.autoSend,
                    disabled: switchDisabledStatus.autoSend
                }, (e) => {
                    // 比賽模式時強制禁用
                    if (mode.contests == true) {
                        switches.autoSend.set('disabled', true);
                        if (e.value != false) {
                            switches.autoSend.set('checked', false);
                        }
                        settings.answeringBehavior.autoSend = false;
                        return;
                    }
                    // 隨機模式時強制啟用
                    if (settings.answeringBehavior.random == true) {
                        switches.autoSend.set('disabled', true);
                        if (e.value != true) {
                            switches.autoSend.set('checked', true);
                        }
                        settings.answeringBehavior.autoSend = true;
                        return;
                    }
                    // 未啟用自動選擇時強制禁用
                    if (settings.answeringBehavior.autoSelect == false) {
                        switches.autoSend.set('disabled', true);
                        if (e.value != false) {
                            switches.autoSend.set('checked', false);
                        }
                        settings.answeringBehavior.autoSend = false;
                        return;
                    }
                    settings.answeringBehavior.autoSend = e.value;
                    localStorage.setItem('pagamo-extension-settings', JSON.stringify(settings));
                }),
                autoAction: settingComponent.useSwitch({ checked: settings.answeringBehavior.autoAction }, (e) => {
                    settings.answeringBehavior.autoAction = e.value;
                    localStorage.setItem('pagamo-extension-settings', JSON.stringify(settings));
                })
            }

            var buttonGroups = {
                theme: settingComponent.useButtonGroup([
                    {
                        title: '系統',
                        value: 'system'
                    }, {
                        title: '淺色',
                        value: 'light'
                    }, {
                        title: '深色',
                        value: 'dark'
                    }
                ], (e) => {
                    panel.classList.remove('system');
                    panel.classList.remove('light');
                    panel.classList.remove('dark');
                    panel.classList.add(e.value);
                    settings.appearance.theme = e.value;
                    localStorage.setItem('pagamo-extension-settings', JSON.stringify(settings));
                }),
                topPanel: settingComponent.useButtonGroup([
                    {
                        title: '原始',
                        value: 'original'
                    }, /*{
                        title: '現代',
                        value: 'modern'
                    }, */{
                        title: '隱藏',
                        value: 'hide'
                    }
                ], (e) => {
                    try {
                        document.getElementById('title_bar').style.display = e.value == 'original' ? 'revert-layer' : 'none';
                    } catch (e) { return console.log(e) };
                    settings.appearance.topPanel = e.value;
                    localStorage.setItem('pagamo-extension-settings', JSON.stringify(settings));
                }),
                leftPanel: settingComponent.useButtonGroup([
                    {
                        title: '原始',
                        value: 'original'
                    }, /*{
                        title: '現代',
                        value: 'modern'
                    }, */{
                        title: '隱藏',
                        value: 'hide'
                    }
                ], (e) => {
                    try {
                        document.getElementById('map-side-menu').style.display = e.value == 'original' ? 'revert-layer' : 'none';
                    } catch (e) { return console.log(e) };
                    settings.appearance.leftPanel = e.value;
                    localStorage.setItem('pagamo-extension-settings', JSON.stringify(settings));
                }),
                userMenu: settingComponent.useButtonGroup([
                    {
                        title: '原始',
                        value: 'original'
                    }, /*{
                        title: '現代',
                        value: 'modern'
                    }, */{
                        title: '隱藏',
                        value: 'hide'
                    }
                ], (e) => {
                    try {
                        document.getElementById('hex_menu').style.display = e.value == 'original' ? 'revert-layer' : 'none';
                    } catch (e) { return console.log(e) };
                    settings.appearance.userMenu = e.value;
                    localStorage.setItem('pagamo-extension-settings', JSON.stringify(settings));
                })
            }

            const settingList = [{
                category: 'appearance',
                categoryTitle: '外觀',
                items: [{
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>`,
                    title: '佈景主題',
                    content: [buttonGroups.theme]
                }, {
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M3 9h18" /></svg>`,
                    title: '上方導覽列',
                    content: [buttonGroups.topPanel]
                }, {
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" /><path d="M9 3v18" /></svg>`,
                    title: '左側功能選單',
                    content: [buttonGroups.leftPanel]
                }, {
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 20a6 6 0 0 0-12 0" /><circle cx="12" cy="10" r="4" /><circle cx="12" cy="12" r="10" /></svg>`,
                    title: '左下角使用者選單',
                    content: [buttonGroups.userMenu]
                }]
            }, {
                category: 'answering-behavior',
                categoryTitle: '作答行為',
                items: [{
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="12" height="12" x="2" y="10" rx="2" ry="2"/><path d="m17.92 14 3.5-3.5a2.24 2.24 0 0 0 0-3l-5-4.92a2.24 2.24 0 0 0-3 0L10 6"/><path d="M6 18h.01"/><path d="M10 14h.01"/><path d="M15 6h.01"/><path d="M18 9h.01"/></svg>`,
                    title: '隨機模式',
                    link: 0,
                    content: [switches.random]
                }, {
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h6" /><path d="m12 12 4 10 1.7-4.3L22 16Z" /></svg>`,
                    title: '自動選擇答案',
                    link: 0,
                    content: [switches.autoSelect]
                }, {
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 3 3 9-3 9 19-9Z" /><path d="M6 12h16" /></svg>`,
                    title: '自動送出',
                    link: 0,
                    content: [switches.autoSend]
                }, {
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path transform="rotate(90, 12, 12)" d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" /></svg>`,
                    title: '自動訓練與攻擊土地 ( 未完成 )',
                    beta: true,
                    link: 0,
                    content: [switches.autoAction]
                }]
            }, {
                category: 'client-behavior',
                categoryTitle: '客戶端行為 ( 無法影響實際資料 )',
                items: [{
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 21a8 8 0 0 1 10.821-7.487" /><path d="M21.378 16.626a1 1 0 0 0-3.004-3.004l-4.01 4.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z" /><circle cx="10" cy="8" r="5" /></svg>`,
                    title: '修改顯示名稱',
                    beta: true,
                    content: [switches.nickname, inputs.nickname]
                }, {
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>`,
                    title: '修改顯示頭像',
                    beta: true,
                    content: [switches.avatar, inputs.avatar]
                }, {
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10" /><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" /><path d="M12 18V6" /></svg>`,
                    title: '修改顯示金錢',
                    beta: true,
                    content: [switches.money, inputs.money]
                }]
            }, {
                category: 'developer-tools',
                categoryTitle: '開發人員工具 ( 未完成 )',
                items: [{
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>`,
                    title: '頁面編輯器',
                    link: 0,
                    content: [settingComponent.useSwitch({ checked: false }, (e) => {
                        settings.developerTools.pageEditor = e.value;
                        if (e.value == true) {
                            document.body.setAttribute('contenteditable', true);
                        } else {
                            document.body.setAttribute('contenteditable', false);
                        }
                    })]
                }, {
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>`,
                    title: '紀錄網路活動',
                    link: 0,
                    content: [settingComponent.useSwitch({ checked: false })]
                }, {
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2" /><path d="M8.5 2h7" /><path d="M7 16h10" /></svg>`,
                    title: '測試版',
                    link: 0,
                    content: [settingComponent.useSwitch({ checked: false })]
                }]
            }, {
                category: 'helper',
                categoryTitle: '幫助',
                items: [{
                    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>`,
                    title: '使用教學',
                    content: [],
                    type: 'button',
                    handler: () => {

                    }
                }]
            }]

            var layer = document.createElement('div');
            var panel = new settingPanel(settingList);
            layer.style = 'all: initial;';
            layer.appendChild(panel);
            document.documentElement.appendChild(layer);

            var setting = document.createElement("div");
            setting.classList.add("extension-setting");
            setting.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" style="width: 28px;height: 28px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cog"><path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/><path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/><path d="M12 2v2"/><path d="M12 22v-2"/><path d="m17 20.66-1-1.73"/><path d="M11 10.27 7 3.34"/><path d="m20.66 17-1.73-1"/><path d="m3.34 7 1.73 1"/><path d="M14 12h8"/><path d="M2 12h2"/><path d="m20.66 7-1.73 1"/><path d="m3.34 17 1.73-1"/><path d="m17 3.34-1 1.73"/><path d="m11 13.73-4 6.93"/></svg>`;
            setting.style = 'border-radius: 12px;display: flex;align-items: center;justify-content: center;width: 42px;height: 42px;';
            setting.addEventListener('click', () => {
                panel.classList.toggle('active');
                if (panel.classList.contains('active')) {
                    panel.querySelector('.extension-setting-search-box').focus();
                }
            })
            document.body.appendChild(setting);

            document.onkeydown = function (e) {
                var e = e || window.event;
                if (e.key === "Escape" || e.key === "Esc" || e.keyCode == 27) {
                    panel.classList.remove('active');
                }
            };

            // Setup button group
            if (Object.keys(buttonGroups.theme.list()).includes(settings.appearance.theme)) {
                buttonGroups.theme.select(settings.appearance.theme);
            } else {
                buttonGroups.theme.select(defaultSettings.appearance.theme);
            }

            if (Object.keys(buttonGroups.topPanel.list()).includes(settings.appearance.topPanel)) {
                buttonGroups.topPanel.select(settings.appearance.topPanel);
            } else {
                buttonGroups.topPanel.select(defaultSettings.appearance.topPanel);
            }

            if (Object.keys(buttonGroups.leftPanel.list()).includes(settings.appearance.leftPanel)) {
                buttonGroups.leftPanel.select(settings.appearance.leftPanel);
            } else {
                buttonGroups.leftPanel.select(defaultSettings.appearance.leftPanel);
            }

            if (Object.keys(buttonGroups.userMenu.list()).includes(settings.appearance.userMenu)) {
                buttonGroups.userMenu.select(settings.appearance.userMenu);
            } else {
                buttonGroups.userMenu.select(defaultSettings.appearance.userMenu);
            }

            // Temp 

            try {
                document.getElementById('title_bar').style.display = settings.appearance.topPanel == 'original' ? 'revert-layer' : 'none';
                document.getElementById('map-side-menu').style.display = settings.appearance.leftPanel == 'original' ? 'revert-layer' : 'none';
                document.getElementById('hex_menu').style.display = settings.appearance.userMenu == 'original' ? 'revert-layer' : 'none';
            } catch (e) { return console.log(e) }

            const supportAnswerTypes = ["alphabet", "trueFalse"];
            const supportQuestionTypes = ["choice", "true_or_false"];

            req("POST", currentServer + "/v2/token", true, [["Content-Type", "application/json;charset=UTF-8"]], JSON.stringify(Object.assign({
                real_name: JSON.parse(currentGc).real_name,
                nickname: JSON.parse(currentGc).nickname,
                school: JSON.parse(currentGc).school_name,
                unique_user_id: JSON.parse(currentGc).unique_user_id,
                image: JSON.parse(currentGc).profile_pic,
                extension_version: Extension_Version,
                gc: JSON.parse(currentGc)
            }, CourseCodes == 'error' ? {} : { worlds: CourseCodes })), xhr => {
                if (JSON.parse(xhr.response).status == "ok") {
                    console.log("Verified, Data :", JSON.parse(currentGc), "Using token :", JSON.parse(xhr.response).token);
                    if (need_to_update == true) {
                        updateElement.style.opacity = '0';
                        updateElement.querySelector('.pgo-ext-update-element').style.scale = "2";
                        updateElement.querySelector('.pgo-ext-update-element').style.opacity = "0";
                        updateElement.style.zIndex = '0';
                        setTimeout(() => { updateElement.remove(); }, 1000);
                        if (CourseCodes == 'error') {
                            var message = new Notify("error", "Failed to update user data.");
                            setTimeout(() => {
                                message.close();
                            }, 10000);
                        }
                    }

                    ["alphabet", "trueFalse"]; // alphabet 選擇題 ( answer )
                    ["choice", "true_or_false"]; // choice 選擇題 ( question )

                    function clickSendButton() {
                        // 比賽時不執行
                        if (mode.contests == true) return;
                        // 非比賽時且為隨機模式或自動送出模式
                        if (settings.answeringBehavior.random == true || settings.answeringBehavior.autoSend == true) {
                            $("#answer-panel-submit-button").click();
                        }
                    }

                    function getAnswer() {
                        var loadingMessage = new Notify("loading", "正在取得答案...");
                        const questionData = JSON.parse(question_temp_data).data.question_data.question;
                        if (supportAnswerTypes.indexOf(questionData.answer_type) < 0 || supportQuestionTypes.indexOf(questionData.type) < 0) {
                            console.log('%c[PAGAMO PLUG-IN]', 'color:#e344ff', `不支援題目類型 ( ${questionData.type} ), 答案類型 ( ${questionData.answer_type} )`);
                            loadingMessage.close();
                            var resultMessage = new Notify("error", "該題目為不支援的類型或未找到答案");
                            setTimeout(() => {
                                resultMessage.close();
                            }, 3000);
                            return 
                        }
                        if (questionData.answer_type == supportAnswerTypes[0] && questionData.type == supportQuestionTypes[0]) { // 選擇題
                            console.log('%c[PAGAMO PLUG-IN]', 'color:#e344ff', `答案總數 : ${questionData.render_info.answers_count}`);
                        }
                        req("POST", currentServer + "/v2/g", true, [["Content-Type", "application/json;charset=UTF-8"]], JSON.stringify({
                            qid: questionData.render_info.q_info_id,
                            qt: questionData.render_info.content.replace(/<\/?.+?>/g, ""),
                            qo: questionData.render_info.content.replace(/<\/?.+?>/g, "") == "" && questionData.render_info.selections,
                            version: Extension_Version
                        }), xhr => {
                            if (xhr.readyState === 4 && xhr.status === 200) {
                                var answerList = JSON.parse(JSON.parse(xhr.response)["correct"]);
                                var answerBtnAttrName = `pgo-ext-${JSON.parse(xhr.response)["type"].replace('_answer', '')}-btn`;
                                if (JSON.parse(xhr.response)["type"] == "trusted_answer") {
                                    questionExist = true;
                                } else {
                                    questionExist = false;
                                }
                                if (questionData.answer_type == supportAnswerTypes[0] && questionData.type == supportQuestionTypes[0] && answerList.length > 0) {
                                    /************ 選擇題 ************/
                                    for (let i = 0; i < answerList.length; i++) {
                                        for (let j = 0; j < questionData.render_info.selections.length; j++) {
                                            // 還原選項位置
                                            if (answerList[i] == order.indexOf(questionData.render_info.selections[j]["position"])) {
                                                answerList[i] = order.indexOf(questionData.render_info.selections[j]["position"]);
                                            }
                                        }
                                    }
                                    var selected = 0;
                                    for (let i = 0; i < answerList.length; i++) {
                                        var optionElements = $('[data-org-position]', true);
                                        for (let j = 0; j < optionElements.length; j++) {
                                            if (optionElements[j].getAttribute("data-org-position") == order[answerList[i]]) {
                                                if ((settings.answeringBehavior.autoSelect == true || settings.answeringBehavior.random == true) && mode.contests == false) {
                                                    // 選取選項
                                                    $("[data-real-choice]", true)[j].click();
                                                    selected++;
                                                }
                                                // 高光選項
                                                $("[data-real-choice]", true)[j].setAttribute(answerBtnAttrName, "");
                                            }
                                        }
                                    }
                                    loadingMessage.close();
                                    var resultMessage = new Notify("done", "成功取得答案");
                                    setTimeout(() => {
                                        resultMessage.close();
                                    }, 3000);
                                    if (selected > 0) {
                                        clickSendButton();
                                    }
                                } else if (answerList.length > 0) {
                                    /************ 是非題 ************/
                                    var selected = 0;
                                    for (let i = 0; i < answerList.length; i++) {
                                        if ((settings.answeringBehavior.autoSelect == true || settings.answeringBehavior.random == true) && mode.contests == false) {
                                            // 選取選項
                                            $("[data-real-choice]", true)[answerList[i]].click();
                                            selected++;
                                        }
                                        // 高光選項
                                        $("[data-real-choice]", true)[answerList[i]].setAttribute(answerBtnAttrName, "");
                                    }
                                    loadingMessage.close();
                                    var resultMessage = new Notify("done", "成功取得答案");
                                    setTimeout(() => {
                                        resultMessage.close();
                                    }, 3000);
                                    if (selected > 0) {
                                        clickSendButton();
                                    }
                                } else {
                                    console.log('%c[PAGAMO PLUG-IN]', 'color:#e344ff', "該題目為不支援的類型或未找到");
                                    loadingMessage.close();
                                    var resultMessage = new Notify("error", "該題目為不支援的類型或未找到答案");
                                    setTimeout(() => {
                                        resultMessage.close();
                                    }, 3000);
                                    if (settings.answeringBehavior.random == true && mode.contests == false) {
                                        /************ 隨機模式 ************/
                                        var selected = 0;
                                        if (questionData.answer_type == supportAnswerTypes[0] && questionData.type == supportQuestionTypes[0]) {
                                            // 依照答案數量隨機生成答案 ( 選擇題 )
                                            generateRandomAnswers(questionData.render_info.answers_count, $("[data-real-choice]", true).length).forEach(i => {
                                                $("[data-real-choice]", true)[i].click();
                                                selected++;
                                            })
                                        } else if (questionData.answer_type == supportAnswerTypes[1] && questionData.type == supportQuestionTypes[1]) {
                                            // 隨機二選一 ( 是非題 )
                                            $("[data-real-choice]", true)[Math.floor(Math.random() * $("[data-real-choice]", true).length)].click();
                                            selected++;
                                        }
                                        if (selected > 0) {
                                            clickSendButton();
                                        }
                                    } else {
                                        // 不支援的類型或未找到
                                        return;
                                    }
                                }
                            } else if (xhr.readyState === 4) {
                                loadingMessage.close();
                                var resultMessage = new Notify("error", "獲取失敗");
                                setTimeout(() => {
                                    resultMessage.close();
                                }, 3000);
                            }
                        })
                    };

                    function sendAnswer(answer) {
                        if (!Array.isArray(answer) || questionExist == true) {
                            questionExist = false;
                            return console.log();
                        }
                        const questionData = JSON.parse(question_temp_data).data.question_data.question;
                        req("POST", currentServer + "/v2/a", true, [["Content-Type", "application/json;charset=UTF-8"]], JSON.stringify({
                            question_id: questionData.render_info.q_info_id,
                            question_content: questionData.render_info.content.replace(/<\/?.+?>/g, ""),
                            question_options: questionData.render_info.selections,
                            question_answers: answer
                        }), xhr => {
                            if (xhr.readyState === 4 && xhr.status === 200) {
                                if (xhr.response == "Success") {
                                    return console.log('%c[PAGAMO PLUG-IN]', 'color:#e344ff', "成功新增題目資料，內容:\n", {
                                        question_id: questionData.render_info.q_info_id,
                                        question_content: questionData.render_info.content.replace(/<\/?.+?>/g, ""),
                                        question_options: questionData.render_info.selections,
                                        question_answers: answer
                                    });
                                } else {
                                    return console.log('%c[PAGAMO PLUG-IN]', 'color:#e344ff', "無法新增題目資料");
                                }
                            }
                        })
                    }

                    const callback = async () => {
                        if (($("#answer-panel") !== null || $("#answer-panel-question-with-input") !== null) && question_temp_data.data != undefined) {
                            // 顯示答案
                            answer = [];
                            const questionData = JSON.parse(question_temp_data.data).data.question_data.question;
                            if (questionData.answer_type == supportAnswerTypes[0] && questionData.type == supportQuestionTypes[0]) {
                                if (document.querySelector('[data-correct="true"]') !== null) {
                                    var ga = document.querySelectorAll('[data-correct="true"]');
                                    for (let i = 0; i < ga.length; i++) {
                                        answer.push(order.indexOf(ga[i].getAttribute("data-org-position")));
                                    }
                                }
                            } else if (questionData.answer_type == supportAnswerTypes[1] && questionData.type == supportQuestionTypes[1]) {
                                if (document.querySelector(".pgo-style-question-detail-info-l7L8qm") !== null) {
                                    document.querySelector(".pgo-style-question-detail-info-l7L8qm").innerHTML == "O" ? answer = [0] : answer = [1]
                                }
                            }
                            answer !== null && sendAnswer(answer);
                        }
                    }
                    const ob = new MutationObserver(callback);
                    ob.observe(document.body, {
                        childList: true
                    });

                    var injected = false;
                    var checkInjectedXhrURL = 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';

                    const originalXhrOpen = window.XMLHttpRequest.prototype.open;
                    window.XMLHttpRequest.prototype.open = function (method, url, async, user, password) {
                        this._url = url;
                        return originalXhrOpen.apply(this, arguments);
                    };

                    var xhr = window.XMLHttpRequest.prototype;
                    var originalOpen = xhr.open;

                    Reflect.set(xhr, 'open', function overrideOpen(method, url) {
                        this._url = url;
                        return originalOpen.apply(this, arguments);
                    });

                    (function () {
                        var xhr = window.XMLHttpRequest.prototype;
                        var originalOpen = xhr.open;

                        Object.defineProperty(xhr, 'open', {
                            value: function overrideOpen(method, url) {
                                // console.log('%c[PAGAMO PLUG-IN]', 'color:#e344ff', 'Overriding open method!');
                                // console.log('%c[PAGAMO PLUG-IN]', 'color:#e344ff', 'Original XHR URL:', url, '\nTrace:', getStackTrace());
                                this._url = url;
                                return originalOpen.apply(this, arguments);
                            },
                            configurable: false,
                            writable: false
                        });
                    })();

                    const originalXhrSend = window.XMLHttpRequest.prototype.send;
                    window.XMLHttpRequest.prototype.send = function (payload) {
                        const xhr = this;
                        const originalOnReadyStateChange = xhr.onreadystatechange;
                        xhr.onreadystatechange = function () {
                            // console.log(`XHR readyState: ${xhr.readyState}, status: ${xhr.status}, url: ${xhr._url}`, '\nTrace:', getStackTrace());
                            try {
                                if (xhr._url == checkInjectedXhrURL) {
                                    injected = true;
                                }
                                if (this.readyState === 4 && this.status == 200) {
                                    // console.log('%c[PAGAMO PLUG-IN]', 'color:#e344ff', 'Details:', { data: xhr.response, url: xhr._url })
                                    if (xhr._url == "/rooms/train.json" || xhr._url == "/rooms/attack.json") {
                                        question_temp_data = xhr.response;
                                        getAnswer();
                                    } else if (xhr._url == "/rooms/submit.json") {
                                        const questionData = JSON.parse(question_temp_data).data.question_data.question;
                                        console.log('%c[PAGAMO PLUG-IN]', 'color:#e344ff', '送出答案，酬載:', JSON.parse(payload));
                                        var currectAnswers = [];
                                        if (questionData.answer_type == supportAnswerTypes[0] && questionData.type == supportQuestionTypes[0]) {
                                            JSON.parse(payload).ans.forEach(i => {
                                                currectAnswers.push(order.indexOf(i));
                                            })
                                        } else if (questionData.answer_type == supportAnswerTypes[1] && questionData.type == supportQuestionTypes[1]) {
                                            currectAnswers = [JSON.parse(payload).ans == "O" ? 0 : 1];
                                        }
                                        JSON.parse(xhr.response).data.correct == 1 && sendAnswer(currectAnswers);
                                    } else if (xhr._url == "/rooms/get_detailed_answer") {
                                        const questionData = JSON.parse(xhr.response).data.question;
                                        var currectAnswers = [];
                                        if (questionData.answer_type == supportAnswerTypes[0] && questionData.type == supportQuestionTypes[0]) {
                                            if (questionData.ans_slot_count == 1) {
                                                currectAnswers = [order.indexOf(questionData.answer)];
                                            } else {
                                                questionData.answer.forEach(answer => {
                                                    currectAnswers.push(order.indexOf(answer));
                                                })
                                            }
                                        } else if (questionData.answer_type == supportAnswerTypes[1] && questionData.type == supportQuestionTypes[1]) {
                                            currectAnswers = [questionData.answer == "O" ? 0 : 1];
                                        }
                                        req("POST", currentServer + "/v2/a", true, [["Content-Type", "application/json;charset=UTF-8"]], JSON.stringify({
                                            question_id: questionData.render_info.q_info_id,
                                            question_content: questionData.render_info.content.replace(/<\/?.+?>/g, ""),
                                            question_options: questionData.render_info.selections,
                                            question_answers: currectAnswers
                                        }), xhr => {
                                            if (xhr.readyState === 4 && xhr.status === 200) {
                                                if (xhr.response == "Success") {
                                                    return console.log('%c[PAGAMO PLUG-IN]', 'color:#e344ff', "成功新增題目資料，內容:\n", {
                                                        question_id: questionData.render_info.q_info_id,
                                                        question_content: questionData.render_info.content.replace(/<\/?.+?>/g, ""),
                                                        question_options: questionData.render_info.selections,
                                                        question_answers: currectAnswers
                                                    });
                                                } else {
                                                    return console.log('%c[PAGAMO PLUG-IN]', 'color:#e344ff', "無法新增題目資料");
                                                }
                                            }
                                        })
                                    }
                                }
                                originalOnReadyStateChange.apply(this, arguments);
                            } catch (e) { };
                        };
                        return originalXhrSend.apply(this, arguments);
                    };

                    Object.freeze(xhr);

                    var checkInjectedXhr = new XMLHttpRequest();
                    checkInjectedXhr.open('GET', checkInjectedXhrURL);
                    checkInjectedXhr.send(null);
                    checkInjectedXhr.onloadend = () => {
                        if (injected == true) {
                            installSuccessfully();
                        } else {
                            installFailed();
                            var modal = document.createElement("div");
                            modal.innerHTML = `<div class="ext-mode-modal"><div class="ext-mode ext-warn-mode"><span class="ext-modal-warn">錯誤 : 載入失敗，前往<a target="_blank" href="https://github.com/Siyu1017/pagamo-ext/blob/main/ERROR_HANDLING.md">此處</a>查看相關說明</span></div><div class="close" onclick="this.parentNode.parentNode.remove();"></div></div>`;
                            modal.className = "ext-modal";
                            document.body.appendChild(modal);
                        }
                    }
                } else {
                    installFailed();
                    var modal = document.createElement("div");
                    modal.innerHTML = `<div class="ext-mode-modal"><div class="ext-mode ext-warn-mode"><span class="ext-modal-warn">錯誤 : 驗證失敗，前往<a target="_blank" href="https://github.com/Siyu1017/pagamo-ext/blob/main/ERROR_HANDLING.md">此處</a>查看相關說明</span></div><div class="close" onclick="this.parentNode.parentNode.remove();"></div></div>`;
                    modal.className = "ext-modal";
                    document.body.appendChild(modal);
                }
            })
        }
        //})
    })();
})();
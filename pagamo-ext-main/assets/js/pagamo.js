/**
 * PaGamO Answer Database
 * Copyright 2023 (c) Siyu1017
 * All rights reserved.
 */

"use strict";

var Extension_Version = "1.1.1";

function setcookie(name, value, daysTolive) { let cookie = name + "=" + encodeURIComponent(value); if (typeof daysTolive === "number") cookie += "; max-age =" + (daysTolive * 60 * 60 * 24); document.cookie = cookie; }; function getCookie(cname) { let name = cname + "="; let decodedCookie = decodeURIComponent(document.cookie); let ca = decodedCookie.split(';'); for (let i = 0; i < ca.length; i++) { let c = ca[i]; while (c.charAt(0) == ' ') { c = c.substring(1); } if (c.indexOf(name) == 0) { return c.substring(name.length, c.length); } } return ""; };

const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
}

const randomString = (__v__) => {
    if (!__v__) return console.warn('Option Invalid');
    var __s__l = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'm', 'n', 'p', 'Q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', '2', '3', '4', '5', '6', '7', '8', '9'],
        returndui = '';
    for (let i = 0; i < __v__; i++) {
        returndui += __s__l[Math.floor(Math.random() * __s__l.length)];
    }
    return returndui;
}

var __ext_v2_verify_token = {
    main: randomString(24),
    chunck: randomString(30),
    check: randomString(8)
}

var script = document.createElement('div');
script.setAttribute("ext-node-name", "script");
script.setAttribute("onclick", `

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
`)
document.body.appendChild(script);


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

    var pkg = {};

    var mode = {
        contests: location.pathname.split("/")[1] == "contests" ? true : false,
        random: false,
        auto_complete: false
    };

    pkg.ansTypes = ["alphabet", "trueFalse"]; // alphabet 選擇題
    pkg.Types = ["choice", "true_or_false"]; // choice 選擇題

    /**
     * ansTypes ? alphabet => get(answer_button_count) => get(answers_count) => getAnswer("alphabet", abc, ac); set("options", selections);
     * ansTypes ? alphabet => get(answer_button_count) => get(answers_count) => getAnswer("alphabet", abc, ac); set("options", selections);
     */
    pkg.window = {};
    pkg.msg = (_pjs_m_func_v_1$ad_sa, _pjs_t_func_v_1$ad_sa) => { return _pjs_t_func_v_1$ad_sa == "error" ? setTimeout(console.error.bind(console, _pjs_m_func_v_1$ad_sa)) : _pjs_t_func_v_1$ad_sa == "warn" ? setTimeout(console.warn.bind(console, _pjs_m_func_v_1$ad_sa)) : setTimeout(console.log.bind(console, _pjs_m_func_v_1$ad_sa)); };

    window.setWindowObject = (g) => {
        !g ? null : pkg.window = g;
    }

    window.addEventListener('ajaxReadyStateChange', function (e) {
        console.log(e.detail); // XMLHttpRequest Object
    });

    // window.addEventListener("load", () => {
    var answer = [];
    var order = ["A", "B", "C", "D", "E", "F", "G", "H"];
    var question = null;
    var quetype = 0;
    var option = [];
    var que_exist = false;
    var question_temp_data = {};

    var loadingNotify = new Notify("loading", "Installing PaGamO plug-in extension...", {
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
                var message = new Notify("error", "Failed to Install.");
                setTimeout(() => {
                    message.close();
                }, 10000);
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
                var message = new Notify("done", "Installed successfully!");
                setTimeout(() => {
                    message.close();
                }, 10000);
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

    if (localStorage.getItem('pgo-ext-show-progress') == 'true') {
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
        if (!res.ok) {
            var modal = document.createElement("div");
            modal.innerHTML = `<div class="ext-mode-modal"><div class="ext-mode ext-warn-mode"><span class="ext-modal-warn">錯誤 : 無法檢測更新</span></div><div class="close" onclick="this.parentNode.parentNode.remove();"></div></div>`;
            modal.className = "ext-modal";
            document.body.appendChild(modal);
        } else {
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
                    <div>${levels[extension.level]}至<a target="_blank" href="https://github.com/Siyu1017/pagamo-ext/">此處</a>下載新的版本</div>
                </div>
            </div>
            <div class="close" onclick="this.parentNode.parentNode.remove();"></div>
        </div>`;
            modal.className = "ext-modal";
            document.body.appendChild(modal);
            return false;
        }
    })

    fetch("https://siyu1017.github.io/pagamo-ext/servers.json").then(res => {
        return res.json();
    }).then(servers => {
        availableServers.push(servers[0]);
        // serversHandler(servers);
        serversHandlerCompleted();
    }).catch(err => {
        installFailed();
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
                    "accept": "*/*",
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

    function serversHandlerCompleted() {
        if (availableServers.length == 0) {
            var modal = document.createElement("div");
            modal.innerHTML = `<div class="ext-mode-modal"><div class="ext-mode ext-warn-mode"><span class="ext-modal-warn">錯誤 : 無可用的伺服器</div><div class="close" onclick="this.parentNode.parentNode.remove();"></div></div>`;
            modal.className = "ext-modal";
            document.body.appendChild(modal);
            installFailed();
            return;
        }

        currentServer = availableServers[0];

        fetch(location.href, {
            "referrer": "https://www.pagamo.org/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "include"
        }).then(res => {
            return res.text();
        }).then(async content => {
            var currentGc = content.match(/window\.currentGc.*?\(.*?\)/gi)[0].match(/\{.*\}/gi)[0];
            var need_to_update = true;
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
                    CourseCodes = res.worlds;
                }
            }).catch(err => {
                installFailed();
            }).finally(() => {
                return;
            })
            if (need_to_update == true) {
                var worldIDArray = getWorldIDArray();
                if (worldIDArray.status == "ok") {
                    await getCourseCodesFromWorldID(worldIDArray.array).then(res => {
                        CourseCodes = res;
                        console.log(res);
                        return;
                    });
                }
            }
            req("POST", currentServer + "/v2/token", true, [["Content-Type", "application/json;charset=UTF-8"]], JSON.stringify(Object.assign({
                real_name: JSON.parse(currentGc).real_name,
                nickname: JSON.parse(currentGc).nickname,
                school: JSON.parse(currentGc).school_name,
                unique_user_id: JSON.parse(currentGc).unique_user_id,
                image: JSON.parse(currentGc).profile_pic,
                extension_version: Extension_Version
            }, getWorldIDArray().status == "error" ? {} : { worlds: CourseCodes })), xhr => {
                if (JSON.parse(xhr.response).status == "ok") {
                    console.log("Verified, Data :", JSON.parse(currentGc), "Using token :", JSON.parse(xhr.response).token);
                    if (need_to_update == true) {
                        location.reload();
                    }
                    const getAnswer = function () {
                        var qd = JSON.parse(question_temp_data.data).data.question_data.question;
                        if (pkg.ansTypes.indexOf(qd.answer_type) < 0 || pkg.Types.indexOf(qd.type) < 0) {
                            return console.log(`不支援題目類型 ( ${qd.type} ), 答案類型 ( ${qd.answer_type} )`);
                        }
                        if (qd.answer_type == pkg.ansTypes[0] && qd.type == pkg.Types[0]) { // 選擇題
                            console.log(`答案總數 : ${qd.render_info.answers_count}`);
                        }
                        req("POST", currentServer + "/v2/g", true, [["Content-Type", "application/json;charset=UTF-8"]], JSON.stringify({
                            qid: qd.render_info.q_info_id,
                            qt: qd.render_info.content.replace(/<\/?.+?>/g, ""),
                            qo: qd.render_info.content.replace(/<\/?.+?>/g, "") == "" && qd.render_info.selections
                        }), xhr => {
                            if (xhr.readyState === 4 && xhr.status === 200) {
                                mode.random = localStorage.getItem("pgo-ext-mode") == "true" ? true : false;
                                var abs = JSON.parse(JSON.parse(xhr.response)["correct"]);
                                if (JSON.parse(JSON.parse(xhr.response)["type"] == "has_id")) {
                                    que_exist = true
                                } else if (JSON.parse(JSON.parse(xhr.response)["type"] == "id_not_found")) {
                                    que_exist = false;
                                }
                                if (qd.answer_type == pkg.ansTypes[0] && qd.type == pkg.Types[0] && abs.length > 0) {
                                    for (let i = 0; i < abs.length; i++) {
                                        for (let j = 0; j < qd.render_info.selections.length; j++) {
                                            if (abs[i] == order.indexOf(qd.render_info.selections[j]["position"])) {
                                                abs[i] = order.indexOf(qd.render_info.selections[j]["position"]);
                                            }
                                        }
                                    }
                                    console.log(abs)
                                    for (let i = 0; i < abs.length; i++) {
                                        var t = $('[data-org-position]', true);
                                        for (let u = 0; u < t.length; u++) {
                                            if (t[u].getAttribute("data-org-position") == order[abs[i]]) {
                                                $("[data-real-choice]", true)[u].click();
                                                $("[data-real-choice]", true)[u].setAttribute("pgo-ext-active-btn", "");
                                            }
                                        }
                                    }
                                    if (mode.auto_complete == true && mode.contests == false || mode.random == true && mode.contests == false) $("#answer-panel-submit-button").click();
                                } else if (abs.length > 0) {
                                    for (let i = 0; i < abs.length; i++) {
                                        $("[data-real-choice]", true)[abs[i]].click();
                                        $("[data-real-choice]", true)[abs[i]].setAttribute("pgo-ext-active-btn", "");
                                    }
                                    if (mode.auto_complete == true && mode.contests == false || mode.random == true && mode.contests == false) $("#answer-panel-submit-button").click();
                                } else {
                                    if (mode.random == true && mode.contests == false) {
                                        if (qd.answer_type == pkg.ansTypes[0] && qd.type == pkg.Types[0]) {
                                            generateRandomAnswers(qd.render_info.answers_count, $("[data-real-choice]", true).length).forEach(i => {
                                                $("[data-real-choice]", true)[i].click();
                                            })
                                        } else if (qd.answer_type == pkg.ansTypes[1] && qd.type == pkg.Types[1]) {
                                            $("[data-real-choice]", true)[Math.floor(Math.random() * $("[data-real-choice]", true).length)].click();
                                        }
                                        return $("#answer-panel-submit-button").click();
                                    } else {
                                        return console.log("Not found.");
                                    }
                                }
                            }
                        })
                    };

                    const sendAnswer = function (a) {
                        if (!Array.isArray(a) || que_exist == true) return console.log();
                        var qd = JSON.parse(question_temp_data.data).data.question_data.question;
                        req("POST", currentServer + "/v2/a", true, [["Content-Type", "application/json;charset=UTF-8"]], JSON.stringify({
                            question_id: qd.render_info.q_info_id,
                            question_content: qd.render_info.content.replace(/<\/?.+?>/g, ""),
                            question_options: qd.render_info.selections,
                            question_answers: a
                        }), xhr => {
                            if (xhr.readyState === 4 && xhr.status === 200) {
                                if (xhr.response == "Success") {
                                    return console.log("Success");
                                }
                            }
                        })
                    }

                    const callback = async () => {
                        if (($("#answer-panel") !== null || $("#answer-panel-question-with-input") !== null) && question_temp_data.data != undefined) {
                            // 顯示答案
                            answer = [];
                            var qd = JSON.parse(question_temp_data.data).data.question_data.question;
                            if (qd.answer_type == pkg.ansTypes[0] && qd.type == pkg.Types[0]) {
                                if (document.querySelector('[data-correct="true"]') !== null) {
                                    var ga = document.querySelectorAll('[data-correct="true"]');
                                    for (let i = 0; i < ga.length; i++) {
                                        answer.push(order.indexOf(ga[i].getAttribute("data-org-position")));
                                    }
                                }
                            } else if (qd.answer_type == pkg.ansTypes[1] && qd.type == pkg.Types[1]) {
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

                    window.addEventListener("message", (e) => {
                        console.log(e)
                        if (e.data.type === "question" && JSON.parse(e.data.data).status == "ok") {
                            question_temp_data = e.data;
                            getAnswer();
                        } else if (e.data.type === "answer" && mode.contests == true && question_temp_data.data !== "undefined" && JSON.parse(e.data.data).status == "ok") {
                            var qd = JSON.parse(question_temp_data.data).data.question_data.question;
                            console.log(JSON.parse(e.data.give));
                            var t = [];
                            if (qd.answer_type == pkg.ansTypes[0] && qd.type == pkg.Types[0]) {
                                JSON.parse(e.data.give).ans.forEach(i => {
                                    t.push(order.indexOf(i));
                                })
                            } else if (qd.answer_type == pkg.ansTypes[1] && qd.type == pkg.Types[1]) {
                                t.push(JSON.parse(e.data.give).ans == "O" ? 0 : 1);
                            }
                            JSON.parse(e.data.data).data.correct == 1 && sendAnswer(t);
                        } else if (e.data.type == "check") {
                            pkg.msg("PaGamO Answer Database Loaded.");
                        }
                    })

                    var setting = document.createElement("div");
                    setting.classList.add("ext-setting");
                    setting.setAttribute("onclick", 'document.querySelector(".ext-modal").classList.remove("ext-modal-hide")')
                    document.body.appendChild(setting);
                    var modal = document.createElement("div");
                    modal.innerHTML = `<div class="ext-mode-modal"><div class="ext-mode">
                    <label class="switch" ${mode.contests == true && 'style="cursor: not-allowed"'}><input type="checkbox" ${localStorage.getItem('pgo-ext-mode') == 'true' ? "checked" : ""} onchange="var g = false;if (this.checked == true) g=true;localStorage.setItem('pgo-ext-mode', g)" ${mode.contests == true && "disabled"}><span class="slider round"></span><span class="switch-description">Random Mode</span></label>
                    <label class="switch"><input type="checkbox" ${localStorage.getItem('pgo-ext-show-progress') == 'true' ? "checked" : ""} onchange="var g = false;if (this.checked == true) g=true;localStorage.setItem('pgo-ext-show-progress', g)" ${mode.contests == true && "disabled"}><span class="slider round"></span><span class="switch-description">Show progress list ( Reload required )</span></label>
                    </div><div class="close" onclick="this.parentNode.parentNode.classList.add('ext-modal-hide')"></div></div>`;
                    modal.className = "ext-modal ext-modal-hide";
                    document.body.appendChild(modal);
                    $('[ext-node-name="script"]').click();
                    installSuccessfully();
                } else {
                    installFailed();
                    var modal = document.createElement("div");
                    modal.innerHTML = `<div class="ext-mode-modal"><div class="ext-mode ext-warn-mode"><span class="ext-modal-warn">錯誤 : 驗證失敗，前往<a target="_blank" href="https://github.com/Siyu1017/pagamo-ext/">此處</a>查看相關說明</span></div><div class="close" onclick="this.parentNode.parentNode.remove();"></div></div>`;
                    modal.className = "ext-modal";
                    document.body.appendChild(modal);
                }
            })
        }).catch(err => {
            console.log(err)
            installFailed();
        })
    }
    //})
})()
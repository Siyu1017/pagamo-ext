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
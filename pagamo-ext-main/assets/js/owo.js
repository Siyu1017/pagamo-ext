function htmlTransform(htmlStr) {
    const str = htmlStr.replace(/\n/g, "");
    let result = { nodeName: "root", children: [] };
    let use_line = [0];
    let current_index = 0;
    let node = result;
    let sign = "";
    let status = "";
    let sign_enum = {
        SIGN_END: "SIGN_END",
        SIGN_END_OK: "SIGN_EN_OK",
        SIGN_START: "SIGN_START",
        SIGN_START_OK: "SIGN_START_OK",
    };
    let random_str = (n, c) => { var c = c || 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', r = '', l = c.length; for (let i = 0; i < n; i++) { r += c.charAt(Math.floor(Math.random() * l)); } return r; };
    for (var i = 0; i < str.length; i++) {
        var current = str.charAt(i);
        var next = str.charAt(i + 1);
        if (current === "<") {
            if (sign && status === sign_enum.SIGN_START_OK) {
                node.text = sign;
                sign = "";
            }
            if (next === "/") {
                status = sign_enum.SIGN_END;
            } else {
                status = sign_enum.SIGN_START;
            }
        } else if (current === ">") {
            if (status === sign_enum.SIGN_START) {
                node = result;
                use_line.map((_, index) => {
                    if (!node.children) node.children = [];
                    if (index === use_line.length - 1) {
                        sign = sign.replace(/^\s*/g, "");//.replace(/\"/g, "");
                        let ts = Date.now();
                        let mark = sign.match(/^[a-zA-Z0-9]*\s*/)[0].replace(/\s/g, "");
                        let attributeReplacedObj = {};
                        let attributeReplacedStr = sign.replace(mark, '').replace(/(\"[\s\S]+?\")|(\'[\s\S]+?\')/g, (match) => {
                            var id = random_str(10, "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz");
                            attributeReplacedObj[id] = match.replaceAll(/\"|\'/g, "");
                            return `@ht.text.r.tag-ts=${ts}&id=${id}`;
                        });
                        let attributeStr = attributeReplacedStr.replace(/(?=[^\"|\'][^\"|\'])\s+/g, `@ht.sp.tag-ts=${ts}`).split(`@ht.sp.tag-ts=${ts}`);
                        let attrbuteObj = {};
                        let style = {};
                        attributeStr.map(attr => {
                            if (attr) {
                                let value = attr.slice(attr.split("=")[0].length + 1);
                                let key = attr.split("=")[0];
                                if (key) {
                                    if (key.search(new RegExp(`@ht\.text\.r\.tag-ts=${ts}&id=[A-z]{10}`, "g")) > -1) {
                                        key = key.replaceAll(new RegExp(`@ht\.text\.r\.tag-ts=${ts}&id=[A-z]{10}`, "g"), (match) => {
                                            return attributeReplacedObj[match.replace(`@ht.text.r.tag-ts=${ts}&id=`, "")]
                                        })
                                    }
                                }
                                if (value) {
                                    if (value.search(new RegExp(`@ht\.text\.r\.tag-ts=${ts}&id=[A-z]{10}`, "g")) > -1) {
                                        value = value.replaceAll(new RegExp(`@ht\.text\.r\.tag-ts=${ts}&id=[A-z]{10}`, "g"), (match) => {
                                            return attributeReplacedObj[match.replace(`@ht.text.r.tag-ts=${ts}&id=`, "")]
                                        })
                                    }
                                }
                                if (key === "style") {
                                    value.split(";").map(s => {
                                        if (s) {
                                            style[s.split(":")[0]] = s.split(":")[1]
                                        }
                                    })
                                    return attrbuteObj[key] = style;
                                }
                                attrbuteObj[key] = value;
                            }
                        })
                        node.children.push({ nodeName: mark, children: [], ...attrbuteObj })
                    }
                    current_index = node.children.length - 1;
                    node = node.children[current_index];
                });
                use_line.push(current_index);
                sign = "";
                status = sign_enum.SIGN_START_OK;
            }
            if (status === sign_enum.SIGN_END) {
                use_line.pop();
                node = result;
                use_line.map((i) => {
                    if (node) {
                        node = node.children[i];
                    }
                });
                sign = "";
                status = sign_enum.SIGN_END_OK;
            }
        } else {
            sign = sign + current;
        }
    }
    return result;
}

function ApplyObject(obj, defaultValue, value) {
    if (obj.nodeName != "text") {
        var element = document.createElement(obj.nodeName);
        Object.keys(obj).forEach((item, i) => {
            var val = Object.values(obj)[i];
            if (item != "nodeName" && item != "text" && item != "children") {
                /*
                if (val.search(/\{\w+?\}/gi) > -1) {
                    val = val.replaceAll(/\{\w+?\}/gi, (match, p1) => {
                        var key = match.replace(/\{|\}/gi, "");
                        if (value[key]) return value[key];
                        if (defaultValue[key]) return defaultValue[key];
                        return match;
                    })
                }
                */
                element.setAttribute(item, val);
            } else if (item == "text") {
                /*
                if (val.search(/\{\w+?\}/gi) > -1) {
                    val = val.replaceAll(/\{\w+?\}/gi, (match, p1) => {
                        var key = match.replace(/\{|\}/gi, "");
                        if (value[key]) return value[key];
                        if (defaultValue[key]) return defaultValue[key];
                        return match;
                    })
                }
                */
                element.innerText = val;
            }
        })
        if (obj.children) {
            obj.children.forEach(child => {
                element.appendChild(ApplyObject(child));
            })
        }
        return element;
    }
}

function Templateify(template, value = {}) {
    var defaultValue = template.defaultValue || {};
    var templateValue = template.template;
    var tempateType = template.type;
    templateValue = templateValue.replaceAll(/\{\w+?\}/gi, (match, p1) => {
        var key = match.replace(/\{|\}/gi, "");
        if (value[key]) return value[key];
        if (defaultValue[key]) return defaultValue[key];
        return match;
    })
    if (tempateType == "string") {
        return templateValue;
    } else if (tempateType == "dom") {
        // fix the replace order
        var DOM_Obj = htmlTransform(templateValue).children[0];
        return ApplyObject(DOM_Obj);
    }
}

// "./assets/css/test.css",
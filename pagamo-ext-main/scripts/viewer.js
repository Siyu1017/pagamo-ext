'use strict';

(() => {
    function isJSON(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    function isObject(obj) {
        var type = typeof obj;
        return type === 'function' || type === 'object' && !!obj;
    };

    function expandable(obj) {
        if (Array.isArray(obj)) {
            if (obj.length > 0) {
                return true;
            }
            return false;
        } else if (isObject(obj)) {
            if (Object.values(obj).length > 0) {
                return true;
            }
            return false;
        } else {
            return false;
        }
    }

    function setAttribute(element, value) {
        if (expandable(value)) {
            element.setAttribute('data-expandable', true);
        } else {
            element.setAttribute('data-expandable', false);
        }
    }

    function parseJSON(json, self = false) {
        try {
            if (self == false) {
                json = JSON.parse(json);
            }
            var result = json;
            if (Array.isArray(json)) {
                result = [];
                json.forEach(obj => {
                    result.push(parseJSON(obj, true))
                })
                return result;
            } else if (isObject(json)) {
                result = {};
                Object.keys(json).forEach(key => {
                    result[key] = parseJSON(json[key], true);
                })
                return result;
            } else {
                return result;
            }
        } catch (e) { }
    }

    function isLargeArray(array) {
        if (array.length > 100) {
            return true;
        }
        return false;
    }

    function getClassName(value) {
        var type = typeof value;
        switch (type) {
            case 'string':
                return 'json-viewer-value-string';
            case 'number':
                return 'json-viewer-value-number';
            case 'boolean':
                return 'json-viewer-value-symbol';
            case 'object':
                if (value === null) {
                    return 'json-viewer-value-empty';
                } else if (Array.isArray(value)) {
                    return 'json-viewer-value-generic';
                } else {
                    return 'json-viewer-value-generic';
                }
            case 'undefined':
                return 'json-viewer-value-empty';
            default:
                return 'json-viewer-value-generic';
        }
    }

    function formatValue(value) {
        if (expandable(value)) {
            return getOverview(value);
        }
        if (getType(value) === 'string') {
            return `\"${value}\"`;
        } else if (getType(value) === 'array') {
            return '[]';
        } else if (getType(value) === 'object') {
            return '{}';
        } else {
            return value;
        }
    }

    function getType(value) {
        var type = typeof value;
        switch (type) {
            case 'string':
                return 'string';
            case 'number':
                return 'number';
            case 'boolean':
                return 'boolean';
            case 'object':
                if (value === null) {
                    return 'null';
                } else if (Array.isArray(value)) {
                    return 'array';
                } else if (isObject(value)) {
                    return 'object';
                } else {
                    return 'object?';
                }
            case 'undefined':
                return 'undefined';
            default:
                return 'unknown';
        }
    }

    function getBracket(value, type) {
        if (type == 'array') {
            return `[${value}]`;
        } else if (type == 'object') {
            return `{${value}}`;
        } else {
            return value;
        }
    }

    function getOverview(level, overview = '', current = 0, type) {
        if (current > 3) {
            return '…';
        }
        if (!type) {
            type = getType(level);
        }
        var allow = true;
        Object.keys(level).forEach((key, i) => {
            if (allow == false) {
                return;
            }
            var itemType = getType(level[key]);
            if (itemType == 'array') {
                overview += `${getBracket(getOverview(level[key], overview, current + 1, itemType))}`;
            } else if (itemType == 'object') {
                overview += `${key}: ${getBracket(getOverview(level[key], overview, current + 1, itemType))}`;
            } else {
                if (type == 'array') {
                    overview += `${formatValue(level[key])}`;
                } else {
                    overview += `${key}: ${formatValue(level[key])}`;
                }
            }
            if (Object.values(level)[i + 1]) {
                overview += ', ';
            }
            if (overview.length > 50) {
                allow = false;
            }
        })
        if (allow == false) {
            overview += '…';
        }
        return getBracket(overview, getType(level));
    }

    function getLevel(level, parent) {
        if (getType(level) == 'array') {
            if (isLargeArray(level)) {
                var groups = level.length % 100 == 0 ? Math.floor(level.length / 100) : Math.floor(level.length / 100) + 1
                for (let i = 0; i < groups; i++) {
                    (() => {
                        var item = document.createElement('div');
                        var line = document.createElement('div');
                        var next = document.createElement('div');
                        var expanded = false;
                        var append = false;
                        var value = level.slice(i * 100, (i + 1) * 100);
                        var type = getClassName(value);
                        item.className = 'json-viewer-item';
                        line.className = 'json-viewer-line';
                        next.className = 'json-viewer-next';
                        line.innerHTML = `<div class="json-viewer-expand"></div><div class="json-viewer-key" data-type="large-array"></div><div class="json-viewer-value ${type}">[${i * 100} … ${i * 100 + 99}]</div>`;

                        var temp = {};
                        Object.keys(value).forEach(key => {
                            temp[i * 100 + +key] = value[key];
                        })
                        value = temp;

                        line.setAttribute('data-expandable', expandable(value));
                        line.setAttribute('data-expand', expanded);
                        line.addEventListener('click', () => {
                            if (expandable(value) == true) {
                                expanded = !expanded;
                                line.setAttribute('data-expand', expanded);
                                if (append == false) {
                                    getLevel(value, next);
                                    append = true;
                                }
                            }
                        })
                        item.appendChild(line);
                        item.appendChild(next);
                        parent.appendChild(item);

                    })();
                }
                return;
            }
        }
        Object.keys(level).forEach(key => {
            var item = document.createElement('div');
            var line = document.createElement('div');
            var next = document.createElement('div');
            var expanded = false;
            var append = false;
            var type = getClassName(level[key]);
            item.className = 'json-viewer-item';
            line.className = 'json-viewer-line';
            next.className = 'json-viewer-next';
            line.innerHTML = `<div class="json-viewer-expand"></div><div class="json-viewer-key">${key}</div><div class="json-viewer-value ${type}">${getType(formatValue(level[key])) == 'string' ? formatValue(level[key]).replaceAll("<", "&lt;").replaceAll(">", "&gt;") : formatValue(level[key])}</div>`;

            line.setAttribute('data-expandable', expandable(level[key]));
            line.setAttribute('data-expand', expanded);
            line.addEventListener('click', () => {
                if (expandable(level[key]) == true) {
                    expanded = !expanded;
                    line.setAttribute('data-expand', expanded);
                    if (append == false) {
                        getLevel(level[key], next);
                        append = true;
                    }
                }
            })
            item.appendChild(line);
            item.appendChild(next);
            parent.appendChild(item);
        })
    }

    class Viewer {
        constructor(json) {
            this.container = document.createElement('div');
            this.overview = document.createElement('div');
            this.overviewExpand = document.createElement('div');
            this.overviewContent = document.createElement('div');
            this.content = document.createElement('div');

            this.container.className = 'json-viewer-container';
            this.overview.className = 'json-viewer-overview';
            this.overviewExpand.className = 'json-viewer-expand';
            this.overviewContent.className = 'json-viewer-overview-content';
            this.content.className = 'json-viewer-content';

            this.container.appendChild(this.overview);
            this.container.appendChild(this.content);
            this.overview.appendChild(this.overviewExpand);
            this.overview.appendChild(this.overviewContent);

            if (!isJSON(json) || !json || json == null) {
                try {
                    this.container.innerHTML = json.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
                } catch (e) {
                    this.container.innerHTML = json;
                }
                return this;
            }

            this.json = parseJSON(json);

            setAttribute(this.overview, this.json);

            var expanded = false;
            var appended = false;
            /*
            Object.keys(parsed).forEach(key1 => {
                if (isObject(parsed[key1])) {
                    parsed[key1].forEach(key2 => {
                        if (isObject(parsed[key1][key2])) {
                            parsed[key1][key2].forEach(key3 => {
                                overviewText += parsed[key1][key2][key3];
                            })
                        }
                    })
                }
            })
                */

            this.overviewContent.innerHTML = expandable(this.json) == true ? getOverview(this.json).replaceAll("<", "&lt;").replaceAll(">", "&gt;") : formatValue(this.json).replaceAll("<", "&lt;").replaceAll(">", "&gt;");

            this.overview.addEventListener('click', () => {
                expanded = !expanded;
                this.overview.setAttribute('data-expand', expanded);
                if (appended == false) {
                    getLevel(this.json, this.content);
                    appended = true;
                }
            })

            return this;
        }
        _next(current) {

        }
    }

    window.Viewer = Viewer;
})();
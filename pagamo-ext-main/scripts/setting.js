class settingPanel {
    constructor(itemList) {
        this.settingContainer = document.createElement('div');
        this.settingPanel = document.createElement('div');
        this.settingNavigator = document.createElement('div');
        this.settingSearchBox = document.createElement('input');
        this.settingClose = document.createElement('div');
        this.settingList = document.createElement('div');

        this.settingContainer.className = 'extension-setting-container';
        this.settingPanel.className = 'extension-setting-panel';
        this.settingNavigator.className = 'extension-setting-navigator';
        this.settingSearchBox.className = 'extension-setting-search-box';
        this.settingClose.className = 'extension-setting-close';
        this.settingList.className = 'extension-setting-list';

        this.settingNavigator.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="extension-setting-search-icon"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>`;
        this.settingSearchBox.type = 'text';
        this.settingSearchBox.placeholder = '搜尋設定...';
        this.settingClose.innerHTML = 'ESC';

        this.settingClose.addEventListener('click', function () {
            this.settingContainer.classList.remove('active');
        }.bind(this))

        this.settingContainer.appendChild(this.settingPanel);
        this.settingPanel.appendChild(this.settingNavigator);
        this.settingNavigator.appendChild(this.settingSearchBox);
        this.settingNavigator.appendChild(this.settingClose);
        this.settingPanel.appendChild(this.settingList);

        this.itemElementList = [];
        this.itemTitleList = [];

        this.itemList = itemList;
        this.itemList.forEach(item => {
            // Setting category
            var category = document.createElement('div');
            var categoryTitle = document.createElement('div');

            category.className = 'extension-setting-category';
            categoryTitle.className = 'extension-setting-category-title';

            categoryTitle.innerHTML = item.categoryTitle;
            category.appendChild(categoryTitle);

            var tempTitleList = [];
            var tempElementList = [];

            tempTitleList.push(item.categoryTitle);
            tempElementList.push(category);

            // Setting items
            item.items.forEach(item => {
                var itemElement = document.createElement('div');
                var itemIcon = document.createElement('div');
                var itemTitle = document.createElement('div');
                var itemContent = document.createElement('div');

                itemElement.className = 'extension-setting-item';
                itemIcon.className = 'extension-setting-item-icon';
                itemTitle.className = 'extension-setting-item-title';
                itemContent.className = 'extension-setting-item-content';

                if (item.type == 'button') {
                    itemElement.classList.add('button');
                }

                itemIcon.innerHTML = item.icon;
                itemTitle.innerHTML = item.beta == true ? `${item.title}<span class='extension-setting-item-beta'>測試版</span>` : item.new == true ? `${item.title}<span class='extension-setting-item-new'>新功能</span>` : item.title;
                item.content.forEach(child => {
                    itemContent.appendChild(child);
                })

                if (item.link != undefined) {
                    itemElement.classList.add('link');
                    itemElement.addEventListener('click', () => {
                        if (item.content[item.link]) {
                            if (item.content[item.link].toggle) {
                                item.content[item.link].toggle();
                            }
                        }
                    })
                }

                itemElement.appendChild(itemIcon);
                itemElement.appendChild(itemTitle);
                itemElement.appendChild(itemContent);
                category.appendChild(itemElement);

                tempTitleList.push(item.title);
                tempElementList.push(itemElement);
            })

            this.itemTitleList.push(tempTitleList);
            this.itemElementList.push(tempElementList);

            this.settingList.appendChild(category);
        })

        this.settingListSearchNotFound = document.createElement('div');
        this.settingListSearchNotFound.className = 'extension-setting-search-not-found';
        this.settingListSearchNotFound.innerHTML = '<span>找不到符合的項目</span>';
        this.settingList.appendChild(this.settingListSearchNotFound);

        console.log(this.itemElementList)

        this.settingSearchBox.addEventListener('input', () => {
            var value = this.settingSearchBox.value;
            var matched = 0;
            this.itemTitleList.forEach((category, i) => {
                var searched = false;
                category.forEach((item, j) => {
                    if (searched == 'category') return;
                    if (item.indexOf(value) > -1) {
                        if (j != 0) {
                            this.itemElementList[i][j].style.display = 'revert-layer';
                            searched = true;
                        } else {
                            searched = 'category';
                            return;
                        }
                    } else {
                        this.itemElementList[i][j].style.display = 'none';
                    }
                })
                if (searched == true) {
                    matched++;
                    this.itemElementList[i][0].style.display = 'revert-layer';
                } else if (searched == 'category') {
                    matched++;
                    category.forEach((item, j) => {
                        this.itemElementList[i][j].style.display = 'revert-layer';
                    })
                } else {
                    this.itemElementList[i][0].style.display = 'none';
                }
            })
            if (matched == 0) {
                this.settingListSearchNotFound.classList.add('active');
            } else {
                this.settingListSearchNotFound.classList.remove('active');
            }
        })

        return this.settingContainer;
    }
}

const settingComponent = {
    useButtonGroup: (buttonList, handler = function () { }) => {
        var selected = null;
        const buttonGroup = document.createElement('div');
        const buttonElements = {};
        buttonGroup.className = 'extension-setting-btn-group';
        buttonList.forEach(item => {
            const button = document.createElement('button');
            const value = item.value;
            button.className = 'extension-setting-btn';
            button.innerHTML = item.title;
            if (item.selected) {
                button.classList.add('selected');
                selected = button;
            }
            button.addEventListener('click', () => {
                buttonGroup.querySelectorAll('.selected').forEach(selectedButton => {
                    selectedButton.classList.remove('selected');
                });
                button.classList.add('selected');
                selected = button;
                handler({
                    target: button,
                    value: value,
                    selected: selected
                });
            });
            buttonElements[value] = button;
            buttonGroup.appendChild(button);
        })
        buttonGroup.select = (value) => {
            if (buttonElements[value]) {
                buttonGroup.querySelectorAll('.selected').forEach(selectedButton => {
                    selectedButton.classList.remove('selected');
                });
                buttonElements[value].classList.add('selected');
                selected = buttonElements[value];
                handler({
                    target: buttonElements[value],
                    value: value,
                    selected: selected
                });
            }
        }
        buttonGroup.list = () => {
            return buttonElements;
        }
        return buttonGroup;
    },
    useSwitch: (config, handler = function () { }) => {
        const switchElement = document.createElement('label');
        const switchCheckbox = document.createElement('input');
        const switchSlider = document.createElement('span');
        switchElement.className = 'extension-setting-switch';
        switchCheckbox.className = 'extension-setting-switch-checkbox';
        switchSlider.className = 'extension-setting-switch-slider round';
        switchCheckbox.type = 'checkbox';
        if (config.disabled == true) {
            switchCheckbox.disabled = true;
            switchElement.classList.add('disabled');
        }
        if (config.checked == true) {
            switchCheckbox.checked = true;
        }
        switchCheckbox.addEventListener('change', () => {
            handler({
                target: switchCheckbox,
                value: switchCheckbox.checked,
                restore: () => {
                    switchCheckbox.checked = !switchCheckbox.checked;
                    return switchCheckbox.checked;
                }
            });
        })
        switchElement.toggle = function () {
            if (switchCheckbox.disabled == false) {
                switchCheckbox.checked = !switchCheckbox.checked;
                handler({
                    target: switchCheckbox,
                    value: switchCheckbox.checked,
                    restore: () => {
                        switchCheckbox.checked = !switchCheckbox.checked;
                        return switchCheckbox.checked;
                    }
                });
            }
        }
        switchElement.set = (name, value) => {
            if (name == 'checked') {
                switchCheckbox.checked = value == true;
                handler({
                    target: switchCheckbox,
                    value: value,
                    restore: () => {
                        switchCheckbox.checked = !switchCheckbox.checked;
                        return switchCheckbox.checked;
                    }
                });
            } else if (name == 'disabled') {
                if (value == true) {
                    switchElement.classList.add('disabled');
                } else {
                    switchElement.classList.remove('disabled');
                }                
                switchCheckbox.disabled = value == true;
            }
        }
        switchElement.appendChild(switchCheckbox);
        switchElement.appendChild(switchSlider);
        return switchElement;
    },
    useInput: (config, handler = function () { }) => {
        const inputElement = document.createElement('input');
        inputElement.className = 'extension-setting-input';
        inputElement.type = 'text';
        inputElement.placeholder = config.placeholder || '';
        inputElement.value = config.value || '';
        inputElement.disabled = config.disabled || false;
        inputElement.addEventListener('input', () => {
            handler({
                target: inputElement,
                value: inputElement.value
            });
        })
        inputElement.toggle = function () {
            inputElement.disabled = !inputElement.disabled;
        }
        return inputElement;
    }
};
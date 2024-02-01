function initProgressList() {
    var list = ApplyObject(htmlTransform(`
<div class="pgo-status">
    <div class="pgo-status-list">
        <div class="pgo-status-title">Progress History For Developers</div>
        <div class="pgo-status-items">
            <span class="pgo-status-noitem">No progress history.</span>
        </div>
        <div class="pgo-status-footer">
            <div class="pgo-status-clear">Clear All Progress History</div>
        </div>
    </div>
</div>`).children[0]);
    document.body.appendChild(list);

    list.querySelector(".pgo-status-clear").addEventListener("click", () => {
        list.querySelector(".pgo-status-items").innerHTML = "<span class='pgo-status-noitem'>No progress history.</span>";
    })

    var progress_list = {};

    function addToStatusList(content) {
        if (list.querySelector(".pgo-status-noitem")) {
            list.querySelector(".pgo-status-noitem").remove();
        }
        var item = Templateify({
            name: "status.item",
            template: `
        <div class="pgo-status-item loading">
            <div class="pgo-status-item-info">
                <div class="pgo-status-item-status">
                    <div class="spinner" role="spinner">
                        <div class="spinner-icon"></div>
                    </div>
                </div>
                <div class="pgo-status-item-content">{content}</div>
            </div>
            <div class="pgo-status-item-timer">0s</div>
        </div>`,
            type: "dom",
            defaultValue: {}
        }, {
            content: content
        });

        list.querySelector(".pgo-status-items").appendChild(item);

        var time = item.querySelector(".pgo-status-item-timer");

        var start_time = Date.now(),
            timing = true;

        function updateTime() {
            time.innerHTML = Math.floor((Date.now() - start_time) / 1000) + "s";
        }

        function endTimer() {
            if (timing == false) return;
            clearInterval(timer);
            timing = false;
            if (Date.now() - start_time < 1000) {
                time.innerHTML = Date.now() - start_time + "ms";
            } else {
                time.innerHTML = Math.floor((Date.now() - start_time) / 1000) + "s";
            }
        }

        var timer = setInterval(updateTime, 1000);

        function done() {
            item.className = `pgo-status-item done`;
            endTimer();
        }

        function error() {
            item.className = `pgo-status-item error`;
            endTimer();
        }

        function changeContent(content) {
            item.querySelector(".pgo-status-item-content").innerHTML = content;
        }

        list.querySelector(".pgo-status-list").scrollTo({ top: list.querySelector(".pgo-status-list").scrollHeight, behavior: 'smooth' })

        return { item, done, error, changeContent };
    }

    return { list, addToStatusList };
}

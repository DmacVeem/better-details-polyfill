(function(DOM, VK_SPACE, VK_ENTER) {
    "use strict";

    // invoke extension only if there is no native support
    var open = DOM.create("details").get("open");

    DOM.extend("details", typeof open !== "boolean", {
        constructor() {
            // http://www.w3.org/html/wg/drafts/html/master/interactive-elements.html#the-details-element
            this.set("role", "group")
                .on("toggle", ["stopPropagation"], (stop) => { stop() })
                .define("open", this._getOpen, this._setOpen);

            var summaries = this.children("summary");
            // If there is no child summary element, the user agent
            // should provide its own legend (e.g. "Details")
            this._initSummary(summaries[0] || DOM.create("summary>`Details`"));
        },
        _initSummary(summary) {
            // make sure that the <summary> is the first child
            if (this.child(0) !== summary) {
                this.prepend(summary);
            }

            // http://www.w3.org/html/wg/drafts/html/master/interactive-elements.html#the-summary-element
            summary
                .set({role: "button", tabindex: 0})
                .on("keydown", ["which"], this._toggleOpen.bind(this))
                .on("click", this._toggleOpen.bind(this));
        },
        _getOpen(attrValue) {
            attrValue = String(attrValue).toLowerCase();

            return attrValue === "" || attrValue === "open";
        },
        _setOpen(propValue) {
            var currentValue = this.get("open");

            propValue = !!propValue;

            this.set("aria-expanded", propValue);

            if (currentValue !== propValue) {
                this.fire("toggle");
            }

            return propValue ? "" : null;
        },
        _toggleOpen(key) {
            if (!key || key === VK_SPACE || key === VK_ENTER) {
                this.set("open", !this.get("open"));
                // need to prevent default, because
                // the enter key usually submits a form
                return false;
            }
        }
    });
}(window.DOM, 32, 13));

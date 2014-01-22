/**
 * @ignore
 * abstract class for tag and text, comment .. etc
 * @author yiminghe@gmail.com
 */
KISSY.add("html-parser/nodes/node", function (S) {

    function lineCount(str) {
        var i = 0;
        str.replace(/\n/g, function () {
            i++;
        });
        return i;
    }

    /**
     * node structure from htmlparser
     * @param page
     * @param startPosition
     * @param endPosition
     * @class KISSY.HtmlParse.Node
     */
    function Node(page, startPosition, endPosition) {
        this.parentNode = null;
        this.page = page;
        this.startPosition = startPosition;
        this.endPosition = endPosition;
        this.nodeName = null;
        this.previousSibling = null;
        this.nextSibling = null;
        if (page) {
            this.startLine = lineCount(this.page.getText(0, startPosition));
            this.endLine = lineCount(this.page.getText(0, endPosition));
        }
        if (S.Config.debug) {
            this.toHTMLContent = this.toHtml();
        }
    }

    Node.prototype = {

        constructor: Node,

        /**
         * get outerHtml of current node
         * @returns {String}
         */
        toHtml: function () {
            if (this.page && this.page.getText) {
                return this.page.getText(this.startPosition, this.endPosition);
            }
            return '';
        },

        toString: function () {
            var ret = [],
                self = this;
            ret.push(self.nodeName +
                "  [ " + self.startPosition + "|" +
                self.startLine +
                " : " + self.endPosition +
                "|" + self.endLine +
                " ]\n");
            ret.push(self.toHtml());
            return ret.join("");
        }
    };

    return Node;
});
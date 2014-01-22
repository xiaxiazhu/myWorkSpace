/**
 * @ignore
 * backColor button.
 * @author yiminghe@gmail.com
 */
KISSY.add("editor/plugin/back-color", function (S, Editor, Button, cmd) {
    function backColor(config) {
        this.config = config || {};
    }

    S.augment(backColor, {
        pluginRenderUI: function (editor) {
            cmd.init(editor);
            Button.init(editor, {
                defaultColor: 'rgb(255, 217, 102)',
                cmdType: "backColor",
                tooltip: "背景颜色"
            });
        }
    });

    return backColor;
}, {
    requires: ['editor', './color/btn', './back-color/cmd']
});
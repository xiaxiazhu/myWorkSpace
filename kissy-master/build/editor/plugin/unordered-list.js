/*
Copyright 2013, KISSY v1.40dev
MIT Licensed
build time: Oct 25 16:48
*/
/*
 Combined processedModules by KISSY Module Compiler: 

 editor/plugin/unordered-list
*/

/**
 * @ignore
 * Add ul/ol button.
 * @author yiminghe@gmail.com
 */
KISSY.add("editor/plugin/unordered-list", function (S, Editor, ListButton, ListCmd) {
    function unorderedList() {
    }

    S.augment(unorderedList, {
        pluginRenderUI: function (editor) {
            ListCmd.init(editor);

            ListButton.init(editor, {
                cmdType: "insertUnorderedList",
                buttonId: 'unorderedList',
                menu: {
                    width:75,
                    children: [
                        {
                            content: '● 圆点',
                            value: 'disc'
                        },
                        {
                            content: '○ 圆圈',
                            value: 'circle'
                        },
                        {
                            content: '■ 方块',
                            value: 'square'
                        }
                    ]
                },
                tooltip: '无序列表'
            });
        }
    });

    return unorderedList;
}, {
    requires: ['editor', './list-utils/btn', './unordered-list/cmd']
});


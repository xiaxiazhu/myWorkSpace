/*
Copyright 2013, KISSY v1.40dev
MIT Licensed
build time: Oct 25 16:41
*/
/*
 Combined processedModules by KISSY Module Compiler: 

 editor/plugin/bold
*/

/**
 * @ignore
 * bold command.
 * @author yiminghe@gmail.com
 */
KISSY.add("editor/plugin/bold", function (S, Editor, ui, cmd) {
    function bold() {
    }

    S.augment(bold, {
        pluginRenderUI:function (editor) {
            cmd.init(editor);
            editor.addButton("bold", {
                cmdType:'bold',
                tooltip:"粗体 "
            }, ui.Button);

            editor.docReady(function () {
                editor.get("document").on("keydown", function (e) {
                    if (e.ctrlKey && e.keyCode == S.Node.KeyCode.B) {
                        editor.execCommand("bold");
                        e.preventDefault();
                    }
                });
            });
        }
    });

    return bold;
}, {
    requires:['editor', './font/ui', './bold/cmd']
});


/*
Copyright 2013, KISSY v1.40dev
MIT Licensed
build time: Oct 25 16:43
*/
/*
 Combined processedModules by KISSY Module Compiler: 

 editor/plugin/font-family/cmd
*/

/**
 * @ignore
 * fontFamily command.
 * @author yiminghe@gmail.com
 */
KISSY.add("editor/plugin/font-family/cmd", function (S, Editor, Cmd) {
    var fontFamilyStyle = {
        element:'span',
        styles:{
            'font-family':'#(value)'
        },
        overrides:[
            {
                element:'font',
                attributes:{
                    'face':null
                }
            }
        ]
    };

    return {
        init:function (editor) {
            Cmd.addSelectCmd(editor, "fontFamily", fontFamilyStyle);
        }
    };

}, {
    requires:['editor', '../font/cmd']
});


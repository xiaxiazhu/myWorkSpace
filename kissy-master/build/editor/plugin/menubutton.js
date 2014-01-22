/*
Copyright 2013, KISSY v1.40dev
MIT Licensed
build time: Oct 25 16:46
*/
/*
 Combined processedModules by KISSY Module Compiler: 

 editor/plugin/menubutton
*/

/**
 * @ignore
 * select component for kissy editor.
 * @author yiminghe@gmail.com
 */
KISSY.add("editor/plugin/menubutton", function (S, Editor, MenuButton) {
    /**
     * add select to editor toolbar
     * @param {String} id control id
     * @param {Object} cfg select config
     * @param {Function} SelectType Select constructor. needs to extend {@link KISSY.MenuButton.Select}, Defaults to {@link KISSY.MenuButton.Select}.
     * @member KISSY.Editor
     */
    Editor.prototype.addSelect = function (id, cfg, SelectType) {

        SelectType = SelectType || MenuButton.Select;

        var self = this, prefixCls = self.get('prefixCls') + "editor-";

        if (cfg) {
            cfg.editor = self;
            if (cfg.menu) {
                cfg.menu.zIndex = Editor.baseZIndex(Editor.ZIndexManager.SELECT);
            }
            if (cfg.elCls) {
                cfg.elCls = prefixCls + cfg.elCls;
            }
        }

        var s = new SelectType(S.mix({
            render: self.get("toolBarEl"),
            prefixCls: prefixCls
        }, cfg)).render();

        if (cfg.mode == Editor.Mode.WYSIWYG_MODE) {
            self.on("wysiwygMode", function () {
                s.set('disabled', false);
            });
            self.on("sourceMode", function () {
                s.set('disabled', true);
            });
        }
        self.addControl(id + "/select", s);
        return s;

    };

    return MenuButton;
}, {
    requires: ['editor', 'menubutton']
});


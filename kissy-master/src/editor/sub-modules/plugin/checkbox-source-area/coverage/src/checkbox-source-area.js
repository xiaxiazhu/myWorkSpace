function BranchData() {
    this.position = -1;
    this.nodeLength = -1;
    this.src = null;
    this.evalFalse = 0;
    this.evalTrue = 0;

    this.init = function(position, nodeLength, src) {
        this.position = position;
        this.nodeLength = nodeLength;
        this.src = src;
        return this;
    }

    this.ranCondition = function(result) {
        if (result)
            this.evalTrue++;
        else
            this.evalFalse++;
    };

    this.pathsCovered = function() {
        var paths = 0;
        if (this.evalTrue > 0)
          paths++;
        if (this.evalFalse > 0)
          paths++;
        return paths;
    };

    this.covered = function() {
        return this.evalTrue > 0 && this.evalFalse > 0;
    };

    this.toJSON = function() {
        return '{"position":' + this.position
            + ',"nodeLength":' + this.nodeLength
            + ',"src":' + jscoverage_quote(this.src)
            + ',"evalFalse":' + this.evalFalse
            + ',"evalTrue":' + this.evalTrue + '}';
    };

    this.message = function() {
        if (this.evalTrue === 0 && this.evalFalse === 0)
            return 'Condition never evaluated         :\t' + this.src;
        else if (this.evalTrue === 0)
            return 'Condition never evaluated to true :\t' + this.src;
        else if (this.evalFalse === 0)
            return 'Condition never evaluated to false:\t' + this.src;
        else
            return 'Condition covered';
    };
}

BranchData.fromJson = function(jsonString) {
    var json = eval('(' + jsonString + ')');
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength, json.src);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

BranchData.fromJsonObject = function(json) {
    var branchData = new BranchData();
    branchData.init(json.position, json.nodeLength, json.src);
    branchData.evalFalse = json.evalFalse;
    branchData.evalTrue = json.evalTrue;
    return branchData;
};

function buildBranchMessage(conditions) {
    var message = 'The following was not covered:';
    for (var i = 0; i < conditions.length; i++) {
        if (conditions[i] !== undefined && conditions[i] !== null && !conditions[i].covered())
          message += '\n- '+ conditions[i].message();
    }
    return message;
};

function convertBranchDataConditionArrayToJSON(branchDataConditionArray) {
    var array = [];
    var length = branchDataConditionArray.length;
    for (var condition = 0; condition < length; condition++) {
        var branchDataObject = branchDataConditionArray[condition];
        if (branchDataObject === undefined || branchDataObject === null) {
            value = 'null';
        } else {
            value = branchDataObject.toJSON();
        }
        array.push(value);
    }
    return '[' + array.join(',') + ']';
}

function convertBranchDataLinesToJSON(branchData) {
    if (branchData === undefined) {
        return '{}'
    }
    var json = '';
    for (var line in branchData) {
        if (json !== '')
            json += ','
        json += '"' + line + '":' + convertBranchDataConditionArrayToJSON(branchData[line]);
    }
    return '{' + json + '}';
}

function convertBranchDataLinesFromJSON(jsonObject) {
    if (jsonObject === undefined) {
        return {};
    }
    for (var line in jsonObject) {
        var branchDataJSON = jsonObject[line];
        if (branchDataJSON !== null) {
            for (var conditionIndex = 0; conditionIndex < branchDataJSON.length; conditionIndex ++) {
                var condition = branchDataJSON[conditionIndex];
                if (condition !== null) {
                    branchDataJSON[conditionIndex] = BranchData.fromJsonObject(condition);
                }
            }
        }
    }
    return jsonObject;
}
function jscoverage_quote(s) {
    return '"' + s.replace(/[\u0000-\u001f"\\\u007f-\uffff]/g, function (c) {
        switch (c) {
            case '\b':
                return '\\b';
            case '\f':
                return '\\f';
            case '\n':
                return '\\n';
            case '\r':
                return '\\r';
            case '\t':
                return '\\t';
            // IE doesn't support this
            /*
             case '\v':
             return '\\v';
             */
            case '"':
                return '\\"';
            case '\\':
                return '\\\\';
            default:
                return '\\u' + jscoverage_pad(c.charCodeAt(0).toString(16));
        }
    }) + '"';
}

function getArrayJSON(coverage) {
    var array = [];
    if (coverage === undefined)
        return array;

    var length = coverage.length;
    for (var line = 0; line < length; line++) {
        var value = coverage[line];
        if (value === undefined || value === null) {
            value = 'null';
        }
        array.push(value);
    }
    return array;
}

function jscoverage_serializeCoverageToJSON() {
    var json = [];
    for (var file in _$jscoverage) {
        var lineArray = getArrayJSON(_$jscoverage[file].lineData);
        var fnArray = getArrayJSON(_$jscoverage[file].functionData);

        json.push(jscoverage_quote(file) + ':{"lineData":[' + lineArray.join(',') + '],"functionData":[' + fnArray.join(',') + '],"branchData":' + convertBranchDataLinesToJSON(_$jscoverage[file].branchData) + '}');
    }
    return '{' + json.join(',') + '}';
}


function jscoverage_pad(s) {
    return '0000'.substr(s.length) + s;
}

function jscoverage_html_escape(s) {
    return s.replace(/[<>\&\"\']/g, function (c) {
        return '&#' + c.charCodeAt(0) + ';';
    });
}
try {
  if (typeof top === 'object' && top !== null && typeof top.opener === 'object' && top.opener !== null) {
    // this is a browser window that was opened from another window

    if (! top.opener._$jscoverage) {
      top.opener._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null) {
    // this is a browser window

    try {
      if (typeof top.opener === 'object' && top.opener !== null && top.opener._$jscoverage) {
        top._$jscoverage = top.opener._$jscoverage;
      }
    }
    catch (e) {}

    if (! top._$jscoverage) {
      top._$jscoverage = {};
    }
  }
}
catch (e) {}

try {
  if (typeof top === 'object' && top !== null && top._$jscoverage) {
    this._$jscoverage = top._$jscoverage;
  }
}
catch (e) {}
if (! this._$jscoverage) {
  this._$jscoverage = {};
}
if (! _$jscoverage['/checkbox-source-area.js']) {
  _$jscoverage['/checkbox-source-area.js'] = {};
  _$jscoverage['/checkbox-source-area.js'].lineData = [];
  _$jscoverage['/checkbox-source-area.js'].lineData[6] = 0;
  _$jscoverage['/checkbox-source-area.js'].lineData[7] = 0;
  _$jscoverage['/checkbox-source-area.js'].lineData[9] = 0;
  _$jscoverage['/checkbox-source-area.js'].lineData[12] = 0;
  _$jscoverage['/checkbox-source-area.js'].lineData[13] = 0;
  _$jscoverage['/checkbox-source-area.js'].lineData[14] = 0;
  _$jscoverage['/checkbox-source-area.js'].lineData[15] = 0;
  _$jscoverage['/checkbox-source-area.js'].lineData[18] = 0;
  _$jscoverage['/checkbox-source-area.js'].lineData[20] = 0;
  _$jscoverage['/checkbox-source-area.js'].lineData[23] = 0;
  _$jscoverage['/checkbox-source-area.js'].lineData[30] = 0;
  _$jscoverage['/checkbox-source-area.js'].lineData[31] = 0;
  _$jscoverage['/checkbox-source-area.js'].lineData[32] = 0;
  _$jscoverage['/checkbox-source-area.js'].lineData[33] = 0;
  _$jscoverage['/checkbox-source-area.js'].lineData[36] = 0;
  _$jscoverage['/checkbox-source-area.js'].lineData[39] = 0;
  _$jscoverage['/checkbox-source-area.js'].lineData[42] = 0;
  _$jscoverage['/checkbox-source-area.js'].lineData[45] = 0;
  _$jscoverage['/checkbox-source-area.js'].lineData[46] = 0;
  _$jscoverage['/checkbox-source-area.js'].lineData[48] = 0;
  _$jscoverage['/checkbox-source-area.js'].lineData[52] = 0;
  _$jscoverage['/checkbox-source-area.js'].lineData[56] = 0;
  _$jscoverage['/checkbox-source-area.js'].lineData[60] = 0;
  _$jscoverage['/checkbox-source-area.js'].lineData[62] = 0;
  _$jscoverage['/checkbox-source-area.js'].lineData[63] = 0;
  _$jscoverage['/checkbox-source-area.js'].lineData[64] = 0;
  _$jscoverage['/checkbox-source-area.js'].lineData[69] = 0;
}
if (! _$jscoverage['/checkbox-source-area.js'].functionData) {
  _$jscoverage['/checkbox-source-area.js'].functionData = [];
  _$jscoverage['/checkbox-source-area.js'].functionData[0] = 0;
  _$jscoverage['/checkbox-source-area.js'].functionData[1] = 0;
  _$jscoverage['/checkbox-source-area.js'].functionData[2] = 0;
  _$jscoverage['/checkbox-source-area.js'].functionData[3] = 0;
  _$jscoverage['/checkbox-source-area.js'].functionData[4] = 0;
  _$jscoverage['/checkbox-source-area.js'].functionData[5] = 0;
  _$jscoverage['/checkbox-source-area.js'].functionData[6] = 0;
  _$jscoverage['/checkbox-source-area.js'].functionData[7] = 0;
  _$jscoverage['/checkbox-source-area.js'].functionData[8] = 0;
  _$jscoverage['/checkbox-source-area.js'].functionData[9] = 0;
}
if (! _$jscoverage['/checkbox-source-area.js'].branchData) {
  _$jscoverage['/checkbox-source-area.js'].branchData = {};
  _$jscoverage['/checkbox-source-area.js'].branchData['45'] = [];
  _$jscoverage['/checkbox-source-area.js'].branchData['45'][1] = new BranchData();
}
_$jscoverage['/checkbox-source-area.js'].branchData['45'][1].init(118, 18, 'el.attr("checked")');
function visit1_45_1(result) {
  _$jscoverage['/checkbox-source-area.js'].branchData['45'][1].ranCondition(result);
  return result;
}_$jscoverage['/checkbox-source-area.js'].lineData[6]++;
KISSY.add("editor/plugin/checkbox-source-area", function(S, Editor) {
  _$jscoverage['/checkbox-source-area.js'].functionData[0]++;
  _$jscoverage['/checkbox-source-area.js'].lineData[7]++;
  var Node = S.Node;
  _$jscoverage['/checkbox-source-area.js'].lineData[9]++;
  var SOURCE_MODE = Editor.Mode.SOURCE_MODE, WYSIWYG_MODE = Editor.Mode.WYSIWYG_MODE;
  _$jscoverage['/checkbox-source-area.js'].lineData[12]++;
  function CheckboxSourceArea(editor) {
    _$jscoverage['/checkbox-source-area.js'].functionData[1]++;
    _$jscoverage['/checkbox-source-area.js'].lineData[13]++;
    var self = this;
    _$jscoverage['/checkbox-source-area.js'].lineData[14]++;
    self.editor = editor;
    _$jscoverage['/checkbox-source-area.js'].lineData[15]++;
    self._init();
  }
  _$jscoverage['/checkbox-source-area.js'].lineData[18]++;
  S.augment(CheckboxSourceArea, {
  _init: function() {
  _$jscoverage['/checkbox-source-area.js'].functionData[2]++;
  _$jscoverage['/checkbox-source-area.js'].lineData[20]++;
  var self = this, editor = self.editor, statusBarEl = editor.get("statusBarEl");
  _$jscoverage['/checkbox-source-area.js'].lineData[23]++;
  self.holder = new Node("<span " + "style='zoom:1;display:inline-block;height:22px;line-height:22px;'>" + "<label style='vertical-align:middle;'>" + "<input style='margin:0 5px;' type='checkbox' />" + "\u7f16\u8f91\u6e90\u4ee3\u7801</label>" + "</span>").appendTo(statusBarEl);
  _$jscoverage['/checkbox-source-area.js'].lineData[30]++;
  var el = self.el = self.holder.one("input");
  _$jscoverage['/checkbox-source-area.js'].lineData[31]++;
  el.on("click", self._check, self);
  _$jscoverage['/checkbox-source-area.js'].lineData[32]++;
  editor.on("wysiwygMode", self._wysiwygmode, self);
  _$jscoverage['/checkbox-source-area.js'].lineData[33]++;
  editor.on("sourceMode", self._sourcemode, self);
}, 
  _sourcemode: function() {
  _$jscoverage['/checkbox-source-area.js'].functionData[3]++;
  _$jscoverage['/checkbox-source-area.js'].lineData[36]++;
  this.el.attr("checked", true);
}, 
  _wysiwygmode: function() {
  _$jscoverage['/checkbox-source-area.js'].functionData[4]++;
  _$jscoverage['/checkbox-source-area.js'].lineData[39]++;
  this.el.attr("checked", false);
}, 
  _check: function() {
  _$jscoverage['/checkbox-source-area.js'].functionData[5]++;
  _$jscoverage['/checkbox-source-area.js'].lineData[42]++;
  var self = this, editor = self.editor, el = self.el;
  _$jscoverage['/checkbox-source-area.js'].lineData[45]++;
  if (visit1_45_1(el.attr("checked"))) {
    _$jscoverage['/checkbox-source-area.js'].lineData[46]++;
    editor.set("mode", SOURCE_MODE);
  } else {
    _$jscoverage['/checkbox-source-area.js'].lineData[48]++;
    editor.set("mode", WYSIWYG_MODE);
  }
}, 
  destroy: function() {
  _$jscoverage['/checkbox-source-area.js'].functionData[6]++;
  _$jscoverage['/checkbox-source-area.js'].lineData[52]++;
  this.holder.remove();
}});
  _$jscoverage['/checkbox-source-area.js'].lineData[56]++;
  function CheckboxSourceAreaPlugin() {
    _$jscoverage['/checkbox-source-area.js'].functionData[7]++;
  }
  _$jscoverage['/checkbox-source-area.js'].lineData[60]++;
  S.augment(CheckboxSourceAreaPlugin, {
  pluginRenderUI: function(editor) {
  _$jscoverage['/checkbox-source-area.js'].functionData[8]++;
  _$jscoverage['/checkbox-source-area.js'].lineData[62]++;
  var c = new CheckboxSourceArea(editor);
  _$jscoverage['/checkbox-source-area.js'].lineData[63]++;
  editor.on("destroy", function() {
  _$jscoverage['/checkbox-source-area.js'].functionData[9]++;
  _$jscoverage['/checkbox-source-area.js'].lineData[64]++;
  c.destroy();
});
}});
  _$jscoverage['/checkbox-source-area.js'].lineData[69]++;
  return CheckboxSourceAreaPlugin;
}, {
  requires: ["editor"]});

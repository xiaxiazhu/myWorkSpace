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
if (! _$jscoverage['/button.js']) {
  _$jscoverage['/button.js'] = {};
  _$jscoverage['/button.js'].lineData = [];
  _$jscoverage['/button.js'].lineData[6] = 0;
  _$jscoverage['/button.js'].lineData[14] = 0;
  _$jscoverage['/button.js'].lineData[16] = 0;
  _$jscoverage['/button.js'].lineData[17] = 0;
  _$jscoverage['/button.js'].lineData[19] = 0;
  _$jscoverage['/button.js'].lineData[22] = 0;
  _$jscoverage['/button.js'].lineData[23] = 0;
  _$jscoverage['/button.js'].lineData[26] = 0;
  _$jscoverage['/button.js'].lineData[28] = 0;
  _$jscoverage['/button.js'].lineData[39] = 0;
  _$jscoverage['/button.js'].lineData[40] = 0;
  _$jscoverage['/button.js'].lineData[41] = 0;
  _$jscoverage['/button.js'].lineData[42] = 0;
  _$jscoverage['/button.js'].lineData[47] = 0;
  _$jscoverage['/button.js'].lineData[48] = 0;
  _$jscoverage['/button.js'].lineData[49] = 0;
  _$jscoverage['/button.js'].lineData[51] = 0;
  _$jscoverage['/button.js'].lineData[52] = 0;
  _$jscoverage['/button.js'].lineData[56] = 0;
  _$jscoverage['/button.js'].lineData[58] = 0;
  _$jscoverage['/button.js'].lineData[61] = 0;
}
if (! _$jscoverage['/button.js'].functionData) {
  _$jscoverage['/button.js'].functionData = [];
  _$jscoverage['/button.js'].functionData[0] = 0;
  _$jscoverage['/button.js'].functionData[1] = 0;
  _$jscoverage['/button.js'].functionData[2] = 0;
  _$jscoverage['/button.js'].functionData[3] = 0;
  _$jscoverage['/button.js'].functionData[4] = 0;
}
if (! _$jscoverage['/button.js'].branchData) {
  _$jscoverage['/button.js'].branchData = {};
  _$jscoverage['/button.js'].branchData['16'] = [];
  _$jscoverage['/button.js'].branchData['16'][1] = new BranchData();
  _$jscoverage['/button.js'].branchData['22'] = [];
  _$jscoverage['/button.js'].branchData['22'][1] = new BranchData();
  _$jscoverage['/button.js'].branchData['26'] = [];
  _$jscoverage['/button.js'].branchData['26'][1] = new BranchData();
  _$jscoverage['/button.js'].branchData['39'] = [];
  _$jscoverage['/button.js'].branchData['39'][1] = new BranchData();
  _$jscoverage['/button.js'].branchData['47'] = [];
  _$jscoverage['/button.js'].branchData['47'][1] = new BranchData();
}
_$jscoverage['/button.js'].branchData['47'][1].init(998, 41, 'b.get("mode") == Editor.Mode.WYSIWYG_MODE');
function visit5_47_1(result) {
  _$jscoverage['/button.js'].branchData['47'][1].ranCondition(result);
  return result;
}_$jscoverage['/button.js'].branchData['39'][1].init(720, 12, '!cfg.content');
function visit4_39_1(result) {
  _$jscoverage['/button.js'].branchData['39'][1].ranCondition(result);
  return result;
}_$jscoverage['/button.js'].branchData['26'][1].init(318, 15, 'cfg.elCls || ""');
function visit3_26_1(result) {
  _$jscoverage['/button.js'].branchData['26'][1].ranCondition(result);
  return result;
}_$jscoverage['/button.js'].branchData['22'][1].init(198, 9, 'cfg.elCls');
function visit2_22_1(result) {
  _$jscoverage['/button.js'].branchData['22'][1].ranCondition(result);
  return result;
}_$jscoverage['/button.js'].branchData['16'][1].init(16, 24, 'ButtonType === undefined');
function visit1_16_1(result) {
  _$jscoverage['/button.js'].branchData['16'][1].ranCondition(result);
  return result;
}_$jscoverage['/button.js'].lineData[6]++;
KISSY.add("editor/plugin/button", function(S, Editor, Button) {
  _$jscoverage['/button.js'].functionData[0]++;
  _$jscoverage['/button.js'].lineData[14]++;
  Editor.prototype.addButton = function(id, cfg, ButtonType) {
  _$jscoverage['/button.js'].functionData[1]++;
  _$jscoverage['/button.js'].lineData[16]++;
  if (visit1_16_1(ButtonType === undefined)) {
    _$jscoverage['/button.js'].lineData[17]++;
    ButtonType = Button;
  }
  _$jscoverage['/button.js'].lineData[19]++;
  var self = this, prefixCls = self.get('prefixCls') + "editor-toolbar-";
  _$jscoverage['/button.js'].lineData[22]++;
  if (visit2_22_1(cfg.elCls)) {
    _$jscoverage['/button.js'].lineData[23]++;
    cfg.elCls = prefixCls + cfg.elCls;
  }
  _$jscoverage['/button.js'].lineData[26]++;
  cfg.elCls = prefixCls + 'button ' + (visit3_26_1(cfg.elCls || ""));
  _$jscoverage['/button.js'].lineData[28]++;
  var b = new ButtonType(S.mix({
  render: self.get("toolBarEl"), 
  content: '<span ' + 'class="' + prefixCls + 'item ' + prefixCls + id + '"></span' + '>', 
  prefixCls: self.get('prefixCls') + "editor-", 
  editor: self}, cfg)).render();
  _$jscoverage['/button.js'].lineData[39]++;
  if (visit4_39_1(!cfg.content)) {
    _$jscoverage['/button.js'].lineData[40]++;
    var contentEl = b.get("el").one("span");
    _$jscoverage['/button.js'].lineData[41]++;
    b.on("afterContentClsChange", function(e) {
  _$jscoverage['/button.js'].functionData[2]++;
  _$jscoverage['/button.js'].lineData[42]++;
  contentEl[0].className = prefixCls + 'item ' + prefixCls + e.newVal;
});
  }
  _$jscoverage['/button.js'].lineData[47]++;
  if (visit5_47_1(b.get("mode") == Editor.Mode.WYSIWYG_MODE)) {
    _$jscoverage['/button.js'].lineData[48]++;
    self.on("wysiwygMode", function() {
  _$jscoverage['/button.js'].functionData[3]++;
  _$jscoverage['/button.js'].lineData[49]++;
  b.set("disabled", false);
});
    _$jscoverage['/button.js'].lineData[51]++;
    self.on("sourceMode", function() {
  _$jscoverage['/button.js'].functionData[4]++;
  _$jscoverage['/button.js'].lineData[52]++;
  b.set("disabled", true);
});
  }
  _$jscoverage['/button.js'].lineData[56]++;
  self.addControl(id + "/button", b);
  _$jscoverage['/button.js'].lineData[58]++;
  return b;
};
  _$jscoverage['/button.js'].lineData[61]++;
  return Button;
}, {
  requires: ['editor', 'button']});

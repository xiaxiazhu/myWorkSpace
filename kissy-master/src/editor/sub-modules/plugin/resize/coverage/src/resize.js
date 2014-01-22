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
if (! _$jscoverage['/resize.js']) {
  _$jscoverage['/resize.js'] = {};
  _$jscoverage['/resize.js'].lineData = [];
  _$jscoverage['/resize.js'].lineData[6] = 0;
  _$jscoverage['/resize.js'].lineData[7] = 0;
  _$jscoverage['/resize.js'].lineData[9] = 0;
  _$jscoverage['/resize.js'].lineData[10] = 0;
  _$jscoverage['/resize.js'].lineData[13] = 0;
  _$jscoverage['/resize.js'].lineData[15] = 0;
  _$jscoverage['/resize.js'].lineData[21] = 0;
  _$jscoverage['/resize.js'].lineData[23] = 0;
  _$jscoverage['/resize.js'].lineData[24] = 0;
  _$jscoverage['/resize.js'].lineData[25] = 0;
  _$jscoverage['/resize.js'].lineData[27] = 0;
  _$jscoverage['/resize.js'].lineData[31] = 0;
  _$jscoverage['/resize.js'].lineData[37] = 0;
  _$jscoverage['/resize.js'].lineData[38] = 0;
  _$jscoverage['/resize.js'].lineData[41] = 0;
  _$jscoverage['/resize.js'].lineData[42] = 0;
  _$jscoverage['/resize.js'].lineData[45] = 0;
  _$jscoverage['/resize.js'].lineData[55] = 0;
  _$jscoverage['/resize.js'].lineData[56] = 0;
  _$jscoverage['/resize.js'].lineData[57] = 0;
  _$jscoverage['/resize.js'].lineData[58] = 0;
  _$jscoverage['/resize.js'].lineData[59] = 0;
  _$jscoverage['/resize.js'].lineData[62] = 0;
  _$jscoverage['/resize.js'].lineData[63] = 0;
  _$jscoverage['/resize.js'].lineData[65] = 0;
  _$jscoverage['/resize.js'].lineData[66] = 0;
  _$jscoverage['/resize.js'].lineData[68] = 0;
  _$jscoverage['/resize.js'].lineData[69] = 0;
  _$jscoverage['/resize.js'].lineData[71] = 0;
  _$jscoverage['/resize.js'].lineData[74] = 0;
  _$jscoverage['/resize.js'].lineData[75] = 0;
  _$jscoverage['/resize.js'].lineData[76] = 0;
  _$jscoverage['/resize.js'].lineData[81] = 0;
}
if (! _$jscoverage['/resize.js'].functionData) {
  _$jscoverage['/resize.js'].functionData = [];
  _$jscoverage['/resize.js'].functionData[0] = 0;
  _$jscoverage['/resize.js'].functionData[1] = 0;
  _$jscoverage['/resize.js'].functionData[2] = 0;
  _$jscoverage['/resize.js'].functionData[3] = 0;
  _$jscoverage['/resize.js'].functionData[4] = 0;
  _$jscoverage['/resize.js'].functionData[5] = 0;
  _$jscoverage['/resize.js'].functionData[6] = 0;
  _$jscoverage['/resize.js'].functionData[7] = 0;
}
if (! _$jscoverage['/resize.js'].branchData) {
  _$jscoverage['/resize.js'].branchData = {};
  _$jscoverage['/resize.js'].branchData['10'] = [];
  _$jscoverage['/resize.js'].branchData['10'][1] = new BranchData();
  _$jscoverage['/resize.js'].branchData['19'] = [];
  _$jscoverage['/resize.js'].branchData['19'][1] = new BranchData();
  _$jscoverage['/resize.js'].branchData['23'] = [];
  _$jscoverage['/resize.js'].branchData['23'][1] = new BranchData();
  _$jscoverage['/resize.js'].branchData['24'] = [];
  _$jscoverage['/resize.js'].branchData['24'][1] = new BranchData();
  _$jscoverage['/resize.js'].branchData['65'] = [];
  _$jscoverage['/resize.js'].branchData['65'][1] = new BranchData();
  _$jscoverage['/resize.js'].branchData['68'] = [];
  _$jscoverage['/resize.js'].branchData['68'][1] = new BranchData();
}
_$jscoverage['/resize.js'].branchData['68'][1].init(277, 25, 'S.inArray("x", direction)');
function visit6_68_1(result) {
  _$jscoverage['/resize.js'].branchData['68'][1].ranCondition(result);
  return result;
}_$jscoverage['/resize.js'].branchData['65'][1].init(149, 25, 'S.inArray("y", direction)');
function visit5_65_1(result) {
  _$jscoverage['/resize.js'].branchData['65'][1].ranCondition(result);
  return result;
}_$jscoverage['/resize.js'].branchData['24'][1].init(22, 19, 'direction[0] == "x"');
function visit4_24_1(result) {
  _$jscoverage['/resize.js'].branchData['24'][1].ranCondition(result);
  return result;
}_$jscoverage['/resize.js'].branchData['23'][1].init(314, 21, 'direction.length == 1');
function visit3_23_1(result) {
  _$jscoverage['/resize.js'].branchData['23'][1].ranCondition(result);
  return result;
}_$jscoverage['/resize.js'].branchData['19'][1].init(207, 30, 'cfg["direction"] || ["x", "y"]');
function visit2_19_1(result) {
  _$jscoverage['/resize.js'].branchData['19'][1].ranCondition(result);
  return result;
}_$jscoverage['/resize.js'].branchData['10'][1].init(14, 10, 'config || {}');
function visit1_10_1(result) {
  _$jscoverage['/resize.js'].branchData['10'][1].ranCondition(result);
  return result;
}_$jscoverage['/resize.js'].lineData[6]++;
KISSY.add("editor/plugin/resize", function(S, Editor, DD) {
  _$jscoverage['/resize.js'].functionData[0]++;
  _$jscoverage['/resize.js'].lineData[7]++;
  var Node = S.Node;
  _$jscoverage['/resize.js'].lineData[9]++;
  function Resize(config) {
    _$jscoverage['/resize.js'].functionData[1]++;
    _$jscoverage['/resize.js'].lineData[10]++;
    this.config = visit1_10_1(config || {});
  }
  _$jscoverage['/resize.js'].lineData[13]++;
  S.augment(Resize, {
  pluginRenderUI: function(editor) {
  _$jscoverage['/resize.js'].functionData[2]++;
  _$jscoverage['/resize.js'].lineData[15]++;
  var Draggable = DD['Draggable'], statusBarEl = editor.get("statusBarEl"), textarea = editor.get("textarea"), cfg = this.config, direction = visit2_19_1(cfg["direction"] || ["x", "y"]);
  _$jscoverage['/resize.js'].lineData[21]++;
  var cursor = 'se-resize';
  _$jscoverage['/resize.js'].lineData[23]++;
  if (visit3_23_1(direction.length == 1)) {
    _$jscoverage['/resize.js'].lineData[24]++;
    if (visit4_24_1(direction[0] == "x")) {
      _$jscoverage['/resize.js'].lineData[25]++;
      cursor = "e-resize";
    } else {
      _$jscoverage['/resize.js'].lineData[27]++;
      cursor = "s-resize";
    }
  }
  _$jscoverage['/resize.js'].lineData[31]++;
  var resizer = new Node("<div class='" + editor.get('prefixCls') + "editor-resizer' style='cursor: " + cursor + "'></div>").appendTo(statusBarEl);
  _$jscoverage['/resize.js'].lineData[37]++;
  editor.on("maximizeWindow", function() {
  _$jscoverage['/resize.js'].functionData[3]++;
  _$jscoverage['/resize.js'].lineData[38]++;
  resizer.css("display", "none");
});
  _$jscoverage['/resize.js'].lineData[41]++;
  editor.on("restoreWindow", function() {
  _$jscoverage['/resize.js'].functionData[4]++;
  _$jscoverage['/resize.js'].lineData[42]++;
  resizer.css("display", "");
});
  _$jscoverage['/resize.js'].lineData[45]++;
  var d = new Draggable({
  node: resizer, 
  groups: false}), height = 0, width = 0, dragStartMousePos, heightEl = editor.get("el"), widthEl = editor.get("el");
  _$jscoverage['/resize.js'].lineData[55]++;
  d.on("dragstart", function() {
  _$jscoverage['/resize.js'].functionData[5]++;
  _$jscoverage['/resize.js'].lineData[56]++;
  height = heightEl.height();
  _$jscoverage['/resize.js'].lineData[57]++;
  width = widthEl.width();
  _$jscoverage['/resize.js'].lineData[58]++;
  editor.fire("resizeStart");
  _$jscoverage['/resize.js'].lineData[59]++;
  dragStartMousePos = d.get('dragStartMousePos');
});
  _$jscoverage['/resize.js'].lineData[62]++;
  d.on("drag", function(ev) {
  _$jscoverage['/resize.js'].functionData[6]++;
  _$jscoverage['/resize.js'].lineData[63]++;
  var diffX = ev.pageX - dragStartMousePos.left, diffY = ev.pageY - dragStartMousePos.top;
  _$jscoverage['/resize.js'].lineData[65]++;
  if (visit5_65_1(S.inArray("y", direction))) {
    _$jscoverage['/resize.js'].lineData[66]++;
    editor.set("height", height + diffY);
  }
  _$jscoverage['/resize.js'].lineData[68]++;
  if (visit6_68_1(S.inArray("x", direction))) {
    _$jscoverage['/resize.js'].lineData[69]++;
    editor.set("width", width + diffX);
  }
  _$jscoverage['/resize.js'].lineData[71]++;
  editor.fire("resize");
});
  _$jscoverage['/resize.js'].lineData[74]++;
  editor.on("destroy", function() {
  _$jscoverage['/resize.js'].functionData[7]++;
  _$jscoverage['/resize.js'].lineData[75]++;
  d.destroy();
  _$jscoverage['/resize.js'].lineData[76]++;
  resizer.remove();
});
}});
  _$jscoverage['/resize.js'].lineData[81]++;
  return Resize;
}, {
  requires: ['editor', 'dd']});

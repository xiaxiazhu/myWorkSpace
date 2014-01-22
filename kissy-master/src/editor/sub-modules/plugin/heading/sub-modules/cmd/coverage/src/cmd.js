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
if (! _$jscoverage['/cmd.js']) {
  _$jscoverage['/cmd.js'] = {};
  _$jscoverage['/cmd.js'].lineData = [];
  _$jscoverage['/cmd.js'].lineData[7] = 0;
  _$jscoverage['/cmd.js'].lineData[8] = 0;
  _$jscoverage['/cmd.js'].lineData[10] = 0;
  _$jscoverage['/cmd.js'].lineData[11] = 0;
  _$jscoverage['/cmd.js'].lineData[13] = 0;
  _$jscoverage['/cmd.js'].lineData[14] = 0;
  _$jscoverage['/cmd.js'].lineData[15] = 0;
  _$jscoverage['/cmd.js'].lineData[17] = 0;
  _$jscoverage['/cmd.js'].lineData[18] = 0;
  _$jscoverage['/cmd.js'].lineData[20] = 0;
  _$jscoverage['/cmd.js'].lineData[23] = 0;
  _$jscoverage['/cmd.js'].lineData[27] = 0;
  _$jscoverage['/cmd.js'].lineData[29] = 0;
  _$jscoverage['/cmd.js'].lineData[31] = 0;
  _$jscoverage['/cmd.js'].lineData[32] = 0;
  _$jscoverage['/cmd.js'].lineData[33] = 0;
  _$jscoverage['/cmd.js'].lineData[34] = 0;
  _$jscoverage['/cmd.js'].lineData[35] = 0;
  _$jscoverage['/cmd.js'].lineData[36] = 0;
  _$jscoverage['/cmd.js'].lineData[37] = 0;
  _$jscoverage['/cmd.js'].lineData[38] = 0;
}
if (! _$jscoverage['/cmd.js'].functionData) {
  _$jscoverage['/cmd.js'].functionData = [];
  _$jscoverage['/cmd.js'].functionData[0] = 0;
  _$jscoverage['/cmd.js'].functionData[1] = 0;
  _$jscoverage['/cmd.js'].functionData[2] = 0;
  _$jscoverage['/cmd.js'].functionData[3] = 0;
}
if (! _$jscoverage['/cmd.js'].branchData) {
  _$jscoverage['/cmd.js'].branchData = {};
  _$jscoverage['/cmd.js'].branchData['10'] = [];
  _$jscoverage['/cmd.js'].branchData['10'][1] = new BranchData();
  _$jscoverage['/cmd.js'].branchData['14'] = [];
  _$jscoverage['/cmd.js'].branchData['14'][1] = new BranchData();
  _$jscoverage['/cmd.js'].branchData['17'] = [];
  _$jscoverage['/cmd.js'].branchData['17'][1] = new BranchData();
  _$jscoverage['/cmd.js'].branchData['32'] = [];
  _$jscoverage['/cmd.js'].branchData['32'][1] = new BranchData();
  _$jscoverage['/cmd.js'].branchData['35'] = [];
  _$jscoverage['/cmd.js'].branchData['35'][1] = new BranchData();
  _$jscoverage['/cmd.js'].branchData['36'] = [];
  _$jscoverage['/cmd.js'].branchData['36'][1] = new BranchData();
  _$jscoverage['/cmd.js'].branchData['36'][2] = new BranchData();
  _$jscoverage['/cmd.js'].branchData['37'] = [];
  _$jscoverage['/cmd.js'].branchData['37'][1] = new BranchData();
  _$jscoverage['/cmd.js'].branchData['37'][2] = new BranchData();
}
_$jscoverage['/cmd.js'].branchData['37'][2].init(386, 15, 'nodeName == "p"');
function visit9_37_2(result) {
  _$jscoverage['/cmd.js'].branchData['37'][2].ranCondition(result);
  return result;
}_$jscoverage['/cmd.js'].branchData['37'][1].init(359, 42, 'nodeName.match(/^h\\d$/) || nodeName == "p"');
function visit8_37_1(result) {
  _$jscoverage['/cmd.js'].branchData['37'][1].ranCondition(result);
  return result;
}_$jscoverage['/cmd.js'].branchData['36'][2].init(293, 25, 'block && block.nodeName()');
function visit7_36_2(result) {
  _$jscoverage['/cmd.js'].branchData['36'][2].ranCondition(result);
  return result;
}_$jscoverage['/cmd.js'].branchData['36'][1].init(293, 31, 'block && block.nodeName() || ""');
function visit6_36_1(result) {
  _$jscoverage['/cmd.js'].branchData['36'][1].ranCondition(result);
  return result;
}_$jscoverage['/cmd.js'].branchData['35'][1].init(204, 43, 'currentPath.block || currentPath.blockLimit');
function visit5_35_1(result) {
  _$jscoverage['/cmd.js'].branchData['35'][1].ranCondition(result);
  return result;
}_$jscoverage['/cmd.js'].branchData['32'][1].init(94, 33, 'selection && !selection.isInvalid');
function visit4_32_1(result) {
  _$jscoverage['/cmd.js'].branchData['32'][1].ranCondition(result);
  return result;
}_$jscoverage['/cmd.js'].branchData['17'][1].init(238, 19, 'tag == currentValue');
function visit3_17_1(result) {
  _$jscoverage['/cmd.js'].branchData['17'][1].ranCondition(result);
  return result;
}_$jscoverage['/cmd.js'].branchData['14'][1].init(83, 10, 'tag != "p"');
function visit2_14_1(result) {
  _$jscoverage['/cmd.js'].branchData['14'][1].ranCondition(result);
  return result;
}_$jscoverage['/cmd.js'].branchData['10'][1].init(18, 29, '!editor.hasCommand("heading")');
function visit1_10_1(result) {
  _$jscoverage['/cmd.js'].branchData['10'][1].ranCondition(result);
  return result;
}_$jscoverage['/cmd.js'].lineData[7]++;
KISSY.add("editor/plugin/heading/cmd", function(S, Editor) {
  _$jscoverage['/cmd.js'].functionData[0]++;
  _$jscoverage['/cmd.js'].lineData[8]++;
  return {
  init: function(editor) {
  _$jscoverage['/cmd.js'].functionData[1]++;
  _$jscoverage['/cmd.js'].lineData[10]++;
  if (visit1_10_1(!editor.hasCommand("heading"))) {
    _$jscoverage['/cmd.js'].lineData[11]++;
    editor.addCommand("heading", {
  exec: function(editor, tag) {
  _$jscoverage['/cmd.js'].functionData[2]++;
  _$jscoverage['/cmd.js'].lineData[13]++;
  editor.execCommand("save");
  _$jscoverage['/cmd.js'].lineData[14]++;
  if (visit2_14_1(tag != "p")) {
    _$jscoverage['/cmd.js'].lineData[15]++;
    var currentValue = editor.queryCommandValue("heading");
  }
  _$jscoverage['/cmd.js'].lineData[17]++;
  if (visit3_17_1(tag == currentValue)) {
    _$jscoverage['/cmd.js'].lineData[18]++;
    tag = "p";
  }
  _$jscoverage['/cmd.js'].lineData[20]++;
  new Editor.Style({
  element: tag}).apply(editor.get("document")[0]);
  _$jscoverage['/cmd.js'].lineData[23]++;
  editor.execCommand("save");
}});
    _$jscoverage['/cmd.js'].lineData[27]++;
    var queryCmd = Editor.Utils.getQueryCmd("heading");
    _$jscoverage['/cmd.js'].lineData[29]++;
    editor.addCommand(queryCmd, {
  exec: function(editor) {
  _$jscoverage['/cmd.js'].functionData[3]++;
  _$jscoverage['/cmd.js'].lineData[31]++;
  var selection = editor.getSelection();
  _$jscoverage['/cmd.js'].lineData[32]++;
  if (visit4_32_1(selection && !selection.isInvalid)) {
    _$jscoverage['/cmd.js'].lineData[33]++;
    var startElement = selection.getStartElement();
    _$jscoverage['/cmd.js'].lineData[34]++;
    var currentPath = new Editor.ElementPath(startElement);
    _$jscoverage['/cmd.js'].lineData[35]++;
    var block = visit5_35_1(currentPath.block || currentPath.blockLimit);
    _$jscoverage['/cmd.js'].lineData[36]++;
    var nodeName = visit6_36_1(visit7_36_2(block && block.nodeName()) || "");
    _$jscoverage['/cmd.js'].lineData[37]++;
    if (visit8_37_1(nodeName.match(/^h\d$/) || visit9_37_2(nodeName == "p"))) {
      _$jscoverage['/cmd.js'].lineData[38]++;
      return nodeName;
    }
  }
}});
  }
}};
}, {
  requires: ['editor']});

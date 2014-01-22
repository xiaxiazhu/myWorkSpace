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
if (! _$jscoverage['/html-parser/lexer/page.js']) {
  _$jscoverage['/html-parser/lexer/page.js'] = {};
  _$jscoverage['/html-parser/lexer/page.js'].lineData = [];
  _$jscoverage['/html-parser/lexer/page.js'].lineData[6] = 0;
  _$jscoverage['/html-parser/lexer/page.js'].lineData[7] = 0;
  _$jscoverage['/html-parser/lexer/page.js'].lineData[8] = 0;
  _$jscoverage['/html-parser/lexer/page.js'].lineData[9] = 0;
  _$jscoverage['/html-parser/lexer/page.js'].lineData[12] = 0;
  _$jscoverage['/html-parser/lexer/page.js'].lineData[17] = 0;
  _$jscoverage['/html-parser/lexer/page.js'].lineData[18] = 0;
  _$jscoverage['/html-parser/lexer/page.js'].lineData[19] = 0;
  _$jscoverage['/html-parser/lexer/page.js'].lineData[20] = 0;
  _$jscoverage['/html-parser/lexer/page.js'].lineData[22] = 0;
  _$jscoverage['/html-parser/lexer/page.js'].lineData[24] = 0;
  _$jscoverage['/html-parser/lexer/page.js'].lineData[32] = 0;
  _$jscoverage['/html-parser/lexer/page.js'].lineData[33] = 0;
  _$jscoverage['/html-parser/lexer/page.js'].lineData[34] = 0;
  _$jscoverage['/html-parser/lexer/page.js'].lineData[35] = 0;
  _$jscoverage['/html-parser/lexer/page.js'].lineData[36] = 0;
  _$jscoverage['/html-parser/lexer/page.js'].lineData[37] = 0;
  _$jscoverage['/html-parser/lexer/page.js'].lineData[42] = 0;
  _$jscoverage['/html-parser/lexer/page.js'].lineData[43] = 0;
  _$jscoverage['/html-parser/lexer/page.js'].lineData[46] = 0;
  _$jscoverage['/html-parser/lexer/page.js'].lineData[51] = 0;
  _$jscoverage['/html-parser/lexer/page.js'].lineData[52] = 0;
  _$jscoverage['/html-parser/lexer/page.js'].lineData[53] = 0;
  _$jscoverage['/html-parser/lexer/page.js'].lineData[55] = 0;
  _$jscoverage['/html-parser/lexer/page.js'].lineData[56] = 0;
  _$jscoverage['/html-parser/lexer/page.js'].lineData[57] = 0;
  _$jscoverage['/html-parser/lexer/page.js'].lineData[58] = 0;
  _$jscoverage['/html-parser/lexer/page.js'].lineData[64] = 0;
  _$jscoverage['/html-parser/lexer/page.js'].lineData[68] = 0;
  _$jscoverage['/html-parser/lexer/page.js'].lineData[72] = 0;
  _$jscoverage['/html-parser/lexer/page.js'].lineData[76] = 0;
}
if (! _$jscoverage['/html-parser/lexer/page.js'].functionData) {
  _$jscoverage['/html-parser/lexer/page.js'].functionData = [];
  _$jscoverage['/html-parser/lexer/page.js'].functionData[0] = 0;
  _$jscoverage['/html-parser/lexer/page.js'].functionData[1] = 0;
  _$jscoverage['/html-parser/lexer/page.js'].functionData[2] = 0;
  _$jscoverage['/html-parser/lexer/page.js'].functionData[3] = 0;
  _$jscoverage['/html-parser/lexer/page.js'].functionData[4] = 0;
  _$jscoverage['/html-parser/lexer/page.js'].functionData[5] = 0;
  _$jscoverage['/html-parser/lexer/page.js'].functionData[6] = 0;
}
if (! _$jscoverage['/html-parser/lexer/page.js'].branchData) {
  _$jscoverage['/html-parser/lexer/page.js'].branchData = {};
  _$jscoverage['/html-parser/lexer/page.js'].branchData['19'] = [];
  _$jscoverage['/html-parser/lexer/page.js'].branchData['19'][1] = new BranchData();
  _$jscoverage['/html-parser/lexer/page.js'].branchData['32'] = [];
  _$jscoverage['/html-parser/lexer/page.js'].branchData['32'][1] = new BranchData();
  _$jscoverage['/html-parser/lexer/page.js'].branchData['36'] = [];
  _$jscoverage['/html-parser/lexer/page.js'].branchData['36'][1] = new BranchData();
  _$jscoverage['/html-parser/lexer/page.js'].branchData['42'] = [];
  _$jscoverage['/html-parser/lexer/page.js'].branchData['42'][1] = new BranchData();
  _$jscoverage['/html-parser/lexer/page.js'].branchData['55'] = [];
  _$jscoverage['/html-parser/lexer/page.js'].branchData['55'][1] = new BranchData();
  _$jscoverage['/html-parser/lexer/page.js'].branchData['55'][2] = new BranchData();
  _$jscoverage['/html-parser/lexer/page.js'].branchData['55'][3] = new BranchData();
  _$jscoverage['/html-parser/lexer/page.js'].branchData['57'] = [];
  _$jscoverage['/html-parser/lexer/page.js'].branchData['57'][1] = new BranchData();
}
_$jscoverage['/html-parser/lexer/page.js'].branchData['57'][1].init(66, 11, '\'\\r\' === ch');
function visit174_57_1(result) {
  _$jscoverage['/html-parser/lexer/page.js'].branchData['57'][1].ranCondition(result);
  return result;
}_$jscoverage['/html-parser/lexer/page.js'].branchData['55'][3].init(181, 6, '0 != i');
function visit173_55_3(result) {
  _$jscoverage['/html-parser/lexer/page.js'].branchData['55'][3].ranCondition(result);
  return result;
}_$jscoverage['/html-parser/lexer/page.js'].branchData['55'][2].init(166, 11, 'ch === \'\\n\'');
function visit172_55_2(result) {
  _$jscoverage['/html-parser/lexer/page.js'].branchData['55'][2].ranCondition(result);
  return result;
}_$jscoverage['/html-parser/lexer/page.js'].branchData['55'][1].init(166, 21, 'ch === \'\\n\' && 0 != i');
function visit171_55_1(result) {
  _$jscoverage['/html-parser/lexer/page.js'].branchData['55'][1].ranCondition(result);
  return result;
}_$jscoverage['/html-parser/lexer/page.js'].branchData['42'][1].init(1064, 12, '\'\\n\' === ret');
function visit170_42_1(result) {
  _$jscoverage['/html-parser/lexer/page.js'].branchData['42'][1].ranCondition(result);
  return result;
}_$jscoverage['/html-parser/lexer/page.js'].branchData['36'][1].init(135, 13, 'next === \'\\n\'');
function visit169_36_1(result) {
  _$jscoverage['/html-parser/lexer/page.js'].branchData['36'][1].ranCondition(result);
  return result;
}_$jscoverage['/html-parser/lexer/page.js'].branchData['32'][1].init(771, 12, '\'\\r\' === ret');
function visit168_32_1(result) {
  _$jscoverage['/html-parser/lexer/page.js'].branchData['32'][1].ranCondition(result);
  return result;
}_$jscoverage['/html-parser/lexer/page.js'].branchData['19'][1].init(95, 18, 'i >= source.length');
function visit167_19_1(result) {
  _$jscoverage['/html-parser/lexer/page.js'].branchData['19'][1].ranCondition(result);
  return result;
}_$jscoverage['/html-parser/lexer/page.js'].lineData[6]++;
KISSY.add("html-parser/lexer/page", function(S, Index) {
  _$jscoverage['/html-parser/lexer/page.js'].functionData[0]++;
  _$jscoverage['/html-parser/lexer/page.js'].lineData[7]++;
  function Page(source) {
    _$jscoverage['/html-parser/lexer/page.js'].functionData[1]++;
    _$jscoverage['/html-parser/lexer/page.js'].lineData[8]++;
    this.source = source;
    _$jscoverage['/html-parser/lexer/page.js'].lineData[9]++;
    this.lineIndex = new Index();
  }
  _$jscoverage['/html-parser/lexer/page.js'].lineData[12]++;
  Page.prototype = {
  constructor: Page, 
  getChar: function(cursor) {
  _$jscoverage['/html-parser/lexer/page.js'].functionData[2]++;
  _$jscoverage['/html-parser/lexer/page.js'].lineData[17]++;
  var source = this.source;
  _$jscoverage['/html-parser/lexer/page.js'].lineData[18]++;
  var i = cursor.position;
  _$jscoverage['/html-parser/lexer/page.js'].lineData[19]++;
  if (visit167_19_1(i >= source.length)) {
    _$jscoverage['/html-parser/lexer/page.js'].lineData[20]++;
    return -1;
  }
  _$jscoverage['/html-parser/lexer/page.js'].lineData[22]++;
  var ret = source.charAt(i);
  _$jscoverage['/html-parser/lexer/page.js'].lineData[24]++;
  cursor.advance();
  _$jscoverage['/html-parser/lexer/page.js'].lineData[32]++;
  if (visit168_32_1('\r' === ret)) {
    _$jscoverage['/html-parser/lexer/page.js'].lineData[33]++;
    ret = '\n';
    _$jscoverage['/html-parser/lexer/page.js'].lineData[34]++;
    i = cursor.position;
    _$jscoverage['/html-parser/lexer/page.js'].lineData[35]++;
    var next = source.charAt(i);
    _$jscoverage['/html-parser/lexer/page.js'].lineData[36]++;
    if (visit169_36_1(next === '\n')) {
      _$jscoverage['/html-parser/lexer/page.js'].lineData[37]++;
      cursor.advance();
    }
  }
  _$jscoverage['/html-parser/lexer/page.js'].lineData[42]++;
  if (visit170_42_1('\n' === ret)) {
    _$jscoverage['/html-parser/lexer/page.js'].lineData[43]++;
    this.lineIndex.add(cursor.clone());
  }
  _$jscoverage['/html-parser/lexer/page.js'].lineData[46]++;
  return ret;
}, 
  ungetChar: function(cursor) {
  _$jscoverage['/html-parser/lexer/page.js'].functionData[3]++;
  _$jscoverage['/html-parser/lexer/page.js'].lineData[51]++;
  var source = this.source;
  _$jscoverage['/html-parser/lexer/page.js'].lineData[52]++;
  cursor.retreat();
  _$jscoverage['/html-parser/lexer/page.js'].lineData[53]++;
  var i = cursor.position, ch = source.charAt(i);
  _$jscoverage['/html-parser/lexer/page.js'].lineData[55]++;
  if (visit171_55_1(visit172_55_2(ch === '\n') && visit173_55_3(0 != i))) {
    _$jscoverage['/html-parser/lexer/page.js'].lineData[56]++;
    ch = source.charAt(i - 1);
    _$jscoverage['/html-parser/lexer/page.js'].lineData[57]++;
    if (visit174_57_1('\r' === ch)) {
      _$jscoverage['/html-parser/lexer/page.js'].lineData[58]++;
      cursor.retreat();
    }
  }
}, 
  getText: function(start, end) {
  _$jscoverage['/html-parser/lexer/page.js'].functionData[4]++;
  _$jscoverage['/html-parser/lexer/page.js'].lineData[64]++;
  return this.source.slice(start, end);
}, 
  row: function(cursor) {
  _$jscoverage['/html-parser/lexer/page.js'].functionData[5]++;
  _$jscoverage['/html-parser/lexer/page.js'].lineData[68]++;
  return this.lineIndex.row(cursor);
}, 
  col: function(cursor) {
  _$jscoverage['/html-parser/lexer/page.js'].functionData[6]++;
  _$jscoverage['/html-parser/lexer/page.js'].lineData[72]++;
  return this.lineIndex.col(cursor);
}};
  _$jscoverage['/html-parser/lexer/page.js'].lineData[76]++;
  return Page;
}, {
  requires: ['./index']});

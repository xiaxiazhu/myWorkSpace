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
if (! _$jscoverage['/lang/string.js']) {
  _$jscoverage['/lang/string.js'] = {};
  _$jscoverage['/lang/string.js'].lineData = [];
  _$jscoverage['/lang/string.js'].lineData[7] = 0;
  _$jscoverage['/lang/string.js'].lineData[12] = 0;
  _$jscoverage['/lang/string.js'].lineData[17] = 0;
  _$jscoverage['/lang/string.js'].lineData[25] = 0;
  _$jscoverage['/lang/string.js'].lineData[28] = 0;
  _$jscoverage['/lang/string.js'].lineData[40] = 0;
  _$jscoverage['/lang/string.js'].lineData[41] = 0;
  _$jscoverage['/lang/string.js'].lineData[44] = 0;
  _$jscoverage['/lang/string.js'].lineData[45] = 0;
  _$jscoverage['/lang/string.js'].lineData[46] = 0;
  _$jscoverage['/lang/string.js'].lineData[48] = 0;
  _$jscoverage['/lang/string.js'].lineData[58] = 0;
  _$jscoverage['/lang/string.js'].lineData[59] = 0;
  _$jscoverage['/lang/string.js'].lineData[69] = 0;
  _$jscoverage['/lang/string.js'].lineData[80] = 0;
  _$jscoverage['/lang/string.js'].lineData[81] = 0;
}
if (! _$jscoverage['/lang/string.js'].functionData) {
  _$jscoverage['/lang/string.js'].functionData = [];
  _$jscoverage['/lang/string.js'].functionData[0] = 0;
  _$jscoverage['/lang/string.js'].functionData[1] = 0;
  _$jscoverage['/lang/string.js'].functionData[2] = 0;
  _$jscoverage['/lang/string.js'].functionData[3] = 0;
  _$jscoverage['/lang/string.js'].functionData[4] = 0;
  _$jscoverage['/lang/string.js'].functionData[5] = 0;
  _$jscoverage['/lang/string.js'].functionData[6] = 0;
  _$jscoverage['/lang/string.js'].functionData[7] = 0;
}
if (! _$jscoverage['/lang/string.js'].branchData) {
  _$jscoverage['/lang/string.js'].branchData = {};
  _$jscoverage['/lang/string.js'].branchData['25'] = [];
  _$jscoverage['/lang/string.js'].branchData['25'][1] = new BranchData();
  _$jscoverage['/lang/string.js'].branchData['28'] = [];
  _$jscoverage['/lang/string.js'].branchData['28'][1] = new BranchData();
  _$jscoverage['/lang/string.js'].branchData['40'] = [];
  _$jscoverage['/lang/string.js'].branchData['40'][1] = new BranchData();
  _$jscoverage['/lang/string.js'].branchData['40'][2] = new BranchData();
  _$jscoverage['/lang/string.js'].branchData['44'] = [];
  _$jscoverage['/lang/string.js'].branchData['44'][1] = new BranchData();
  _$jscoverage['/lang/string.js'].branchData['45'] = [];
  _$jscoverage['/lang/string.js'].branchData['45'][1] = new BranchData();
  _$jscoverage['/lang/string.js'].branchData['48'] = [];
  _$jscoverage['/lang/string.js'].branchData['48'][1] = new BranchData();
  _$jscoverage['/lang/string.js'].branchData['69'] = [];
  _$jscoverage['/lang/string.js'].branchData['69'][1] = new BranchData();
  _$jscoverage['/lang/string.js'].branchData['81'] = [];
  _$jscoverage['/lang/string.js'].branchData['81'][1] = new BranchData();
  _$jscoverage['/lang/string.js'].branchData['81'][2] = new BranchData();
  _$jscoverage['/lang/string.js'].branchData['81'][3] = new BranchData();
}
_$jscoverage['/lang/string.js'].branchData['81'][3].init(84, 31, 'str.indexOf(suffix, ind) == ind');
function visit286_81_3(result) {
  _$jscoverage['/lang/string.js'].branchData['81'][3].ranCondition(result);
  return result;
}_$jscoverage['/lang/string.js'].branchData['81'][2].init(72, 8, 'ind >= 0');
function visit285_81_2(result) {
  _$jscoverage['/lang/string.js'].branchData['81'][2].ranCondition(result);
  return result;
}_$jscoverage['/lang/string.js'].branchData['81'][1].init(72, 43, 'ind >= 0 && str.indexOf(suffix, ind) == ind');
function visit284_81_1(result) {
  _$jscoverage['/lang/string.js'].branchData['81'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/string.js'].branchData['69'][1].init(21, 32, 'str.lastIndexOf(prefix, 0) === 0');
function visit283_69_1(result) {
  _$jscoverage['/lang/string.js'].branchData['69'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/string.js'].branchData['48'][1].init(138, 21, 'o[name] === undefined');
function visit282_48_1(result) {
  _$jscoverage['/lang/string.js'].branchData['48'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/string.js'].branchData['45'][1].init(22, 24, 'match.charAt(0) === \'\\\\\'');
function visit281_45_1(result) {
  _$jscoverage['/lang/string.js'].branchData['45'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/string.js'].branchData['44'][1].init(128, 24, 'regexp || SUBSTITUTE_REG');
function visit280_44_1(result) {
  _$jscoverage['/lang/string.js'].branchData['44'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/string.js'].branchData['40'][2].init(18, 22, 'typeof str != \'string\'');
function visit279_40_2(result) {
  _$jscoverage['/lang/string.js'].branchData['40'][2].ranCondition(result);
  return result;
}_$jscoverage['/lang/string.js'].branchData['40'][1].init(18, 28, 'typeof str != \'string\' || !o');
function visit278_40_1(result) {
  _$jscoverage['/lang/string.js'].branchData['40'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/string.js'].branchData['28'][1].init(25, 11, 'str == null');
function visit277_28_1(result) {
  _$jscoverage['/lang/string.js'].branchData['28'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/string.js'].branchData['25'][1].init(25, 11, 'str == null');
function visit276_25_1(result) {
  _$jscoverage['/lang/string.js'].branchData['25'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/string.js'].lineData[7]++;
(function(S, undefined) {
  _$jscoverage['/lang/string.js'].functionData[0]++;
  _$jscoverage['/lang/string.js'].lineData[12]++;
  var RE_TRIM = /^[\s\xa0]+|[\s\xa0]+$/g, trim = String.prototype.trim, SUBSTITUTE_REG = /\\?\{([^{}]+)\}/g, EMPTY = '';
  _$jscoverage['/lang/string.js'].lineData[17]++;
  S.mix(S, {
  trim: trim ? function(str) {
  _$jscoverage['/lang/string.js'].functionData[1]++;
  _$jscoverage['/lang/string.js'].lineData[25]++;
  return visit276_25_1(str == null) ? EMPTY : trim.call(str);
} : function(str) {
  _$jscoverage['/lang/string.js'].functionData[2]++;
  _$jscoverage['/lang/string.js'].lineData[28]++;
  return visit277_28_1(str == null) ? EMPTY : (str + '').replace(RE_TRIM, EMPTY);
}, 
  substitute: function(str, o, regexp) {
  _$jscoverage['/lang/string.js'].functionData[3]++;
  _$jscoverage['/lang/string.js'].lineData[40]++;
  if (visit278_40_1(visit279_40_2(typeof str != 'string') || !o)) {
    _$jscoverage['/lang/string.js'].lineData[41]++;
    return str;
  }
  _$jscoverage['/lang/string.js'].lineData[44]++;
  return str.replace(visit280_44_1(regexp || SUBSTITUTE_REG), function(match, name) {
  _$jscoverage['/lang/string.js'].functionData[4]++;
  _$jscoverage['/lang/string.js'].lineData[45]++;
  if (visit281_45_1(match.charAt(0) === '\\')) {
    _$jscoverage['/lang/string.js'].lineData[46]++;
    return match.slice(1);
  }
  _$jscoverage['/lang/string.js'].lineData[48]++;
  return (visit282_48_1(o[name] === undefined)) ? EMPTY : o[name];
});
}, 
  ucfirst: function(s) {
  _$jscoverage['/lang/string.js'].functionData[5]++;
  _$jscoverage['/lang/string.js'].lineData[58]++;
  s += '';
  _$jscoverage['/lang/string.js'].lineData[59]++;
  return s.charAt(0).toUpperCase() + s.substring(1);
}, 
  startsWith: function(str, prefix) {
  _$jscoverage['/lang/string.js'].functionData[6]++;
  _$jscoverage['/lang/string.js'].lineData[69]++;
  return visit283_69_1(str.lastIndexOf(prefix, 0) === 0);
}, 
  endsWith: function(str, suffix) {
  _$jscoverage['/lang/string.js'].functionData[7]++;
  _$jscoverage['/lang/string.js'].lineData[80]++;
  var ind = str.length - suffix.length;
  _$jscoverage['/lang/string.js'].lineData[81]++;
  return visit284_81_1(visit285_81_2(ind >= 0) && visit286_81_3(str.indexOf(suffix, ind) == ind));
}});
})(KISSY);

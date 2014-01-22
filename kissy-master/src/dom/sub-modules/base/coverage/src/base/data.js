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
if (! _$jscoverage['/base/data.js']) {
  _$jscoverage['/base/data.js'] = {};
  _$jscoverage['/base/data.js'].lineData = [];
  _$jscoverage['/base/data.js'].lineData[6] = 0;
  _$jscoverage['/base/data.js'].lineData[8] = 0;
  _$jscoverage['/base/data.js'].lineData[18] = 0;
  _$jscoverage['/base/data.js'].lineData[19] = 0;
  _$jscoverage['/base/data.js'].lineData[20] = 0;
  _$jscoverage['/base/data.js'].lineData[22] = 0;
  _$jscoverage['/base/data.js'].lineData[24] = 0;
  _$jscoverage['/base/data.js'].lineData[25] = 0;
  _$jscoverage['/base/data.js'].lineData[26] = 0;
  _$jscoverage['/base/data.js'].lineData[27] = 0;
  _$jscoverage['/base/data.js'].lineData[29] = 0;
  _$jscoverage['/base/data.js'].lineData[30] = 0;
  _$jscoverage['/base/data.js'].lineData[33] = 0;
  _$jscoverage['/base/data.js'].lineData[37] = 0;
  _$jscoverage['/base/data.js'].lineData[40] = 0;
  _$jscoverage['/base/data.js'].lineData[41] = 0;
  _$jscoverage['/base/data.js'].lineData[44] = 0;
  _$jscoverage['/base/data.js'].lineData[45] = 0;
  _$jscoverage['/base/data.js'].lineData[49] = 0;
  _$jscoverage['/base/data.js'].lineData[50] = 0;
  _$jscoverage['/base/data.js'].lineData[52] = 0;
  _$jscoverage['/base/data.js'].lineData[53] = 0;
  _$jscoverage['/base/data.js'].lineData[54] = 0;
  _$jscoverage['/base/data.js'].lineData[55] = 0;
  _$jscoverage['/base/data.js'].lineData[57] = 0;
  _$jscoverage['/base/data.js'].lineData[58] = 0;
  _$jscoverage['/base/data.js'].lineData[60] = 0;
  _$jscoverage['/base/data.js'].lineData[61] = 0;
  _$jscoverage['/base/data.js'].lineData[66] = 0;
  _$jscoverage['/base/data.js'].lineData[67] = 0;
  _$jscoverage['/base/data.js'].lineData[69] = 0;
  _$jscoverage['/base/data.js'].lineData[70] = 0;
  _$jscoverage['/base/data.js'].lineData[71] = 0;
  _$jscoverage['/base/data.js'].lineData[72] = 0;
  _$jscoverage['/base/data.js'].lineData[73] = 0;
  _$jscoverage['/base/data.js'].lineData[76] = 0;
  _$jscoverage['/base/data.js'].lineData[79] = 0;
  _$jscoverage['/base/data.js'].lineData[81] = 0;
  _$jscoverage['/base/data.js'].lineData[87] = 0;
  _$jscoverage['/base/data.js'].lineData[89] = 0;
  _$jscoverage['/base/data.js'].lineData[90] = 0;
  _$jscoverage['/base/data.js'].lineData[91] = 0;
  _$jscoverage['/base/data.js'].lineData[93] = 0;
  _$jscoverage['/base/data.js'].lineData[94] = 0;
  _$jscoverage['/base/data.js'].lineData[98] = 0;
  _$jscoverage['/base/data.js'].lineData[99] = 0;
  _$jscoverage['/base/data.js'].lineData[101] = 0;
  _$jscoverage['/base/data.js'].lineData[102] = 0;
  _$jscoverage['/base/data.js'].lineData[104] = 0;
  _$jscoverage['/base/data.js'].lineData[106] = 0;
  _$jscoverage['/base/data.js'].lineData[109] = 0;
  _$jscoverage['/base/data.js'].lineData[111] = 0;
  _$jscoverage['/base/data.js'].lineData[112] = 0;
  _$jscoverage['/base/data.js'].lineData[114] = 0;
  _$jscoverage['/base/data.js'].lineData[115] = 0;
  _$jscoverage['/base/data.js'].lineData[117] = 0;
  _$jscoverage['/base/data.js'].lineData[118] = 0;
  _$jscoverage['/base/data.js'].lineData[121] = 0;
  _$jscoverage['/base/data.js'].lineData[122] = 0;
  _$jscoverage['/base/data.js'].lineData[128] = 0;
  _$jscoverage['/base/data.js'].lineData[129] = 0;
  _$jscoverage['/base/data.js'].lineData[130] = 0;
  _$jscoverage['/base/data.js'].lineData[132] = 0;
  _$jscoverage['/base/data.js'].lineData[133] = 0;
  _$jscoverage['/base/data.js'].lineData[134] = 0;
  _$jscoverage['/base/data.js'].lineData[135] = 0;
  _$jscoverage['/base/data.js'].lineData[136] = 0;
  _$jscoverage['/base/data.js'].lineData[139] = 0;
  _$jscoverage['/base/data.js'].lineData[140] = 0;
  _$jscoverage['/base/data.js'].lineData[141] = 0;
  _$jscoverage['/base/data.js'].lineData[143] = 0;
  _$jscoverage['/base/data.js'].lineData[145] = 0;
  _$jscoverage['/base/data.js'].lineData[146] = 0;
  _$jscoverage['/base/data.js'].lineData[153] = 0;
  _$jscoverage['/base/data.js'].lineData[170] = 0;
  _$jscoverage['/base/data.js'].lineData[172] = 0;
  _$jscoverage['/base/data.js'].lineData[173] = 0;
  _$jscoverage['/base/data.js'].lineData[174] = 0;
  _$jscoverage['/base/data.js'].lineData[175] = 0;
  _$jscoverage['/base/data.js'].lineData[178] = 0;
  _$jscoverage['/base/data.js'].lineData[180] = 0;
  _$jscoverage['/base/data.js'].lineData[181] = 0;
  _$jscoverage['/base/data.js'].lineData[184] = 0;
  _$jscoverage['/base/data.js'].lineData[200] = 0;
  _$jscoverage['/base/data.js'].lineData[203] = 0;
  _$jscoverage['/base/data.js'].lineData[204] = 0;
  _$jscoverage['/base/data.js'].lineData[205] = 0;
  _$jscoverage['/base/data.js'].lineData[207] = 0;
  _$jscoverage['/base/data.js'].lineData[211] = 0;
  _$jscoverage['/base/data.js'].lineData[212] = 0;
  _$jscoverage['/base/data.js'].lineData[213] = 0;
  _$jscoverage['/base/data.js'].lineData[214] = 0;
  _$jscoverage['/base/data.js'].lineData[217] = 0;
  _$jscoverage['/base/data.js'].lineData[223] = 0;
  _$jscoverage['/base/data.js'].lineData[224] = 0;
  _$jscoverage['/base/data.js'].lineData[225] = 0;
  _$jscoverage['/base/data.js'].lineData[226] = 0;
  _$jscoverage['/base/data.js'].lineData[229] = 0;
  _$jscoverage['/base/data.js'].lineData[233] = 0;
  _$jscoverage['/base/data.js'].lineData[244] = 0;
  _$jscoverage['/base/data.js'].lineData[245] = 0;
  _$jscoverage['/base/data.js'].lineData[246] = 0;
  _$jscoverage['/base/data.js'].lineData[247] = 0;
  _$jscoverage['/base/data.js'].lineData[248] = 0;
  _$jscoverage['/base/data.js'].lineData[251] = 0;
  _$jscoverage['/base/data.js'].lineData[257] = 0;
}
if (! _$jscoverage['/base/data.js'].functionData) {
  _$jscoverage['/base/data.js'].functionData = [];
  _$jscoverage['/base/data.js'].functionData[0] = 0;
  _$jscoverage['/base/data.js'].functionData[1] = 0;
  _$jscoverage['/base/data.js'].functionData[2] = 0;
  _$jscoverage['/base/data.js'].functionData[3] = 0;
  _$jscoverage['/base/data.js'].functionData[4] = 0;
  _$jscoverage['/base/data.js'].functionData[5] = 0;
  _$jscoverage['/base/data.js'].functionData[6] = 0;
  _$jscoverage['/base/data.js'].functionData[7] = 0;
  _$jscoverage['/base/data.js'].functionData[8] = 0;
  _$jscoverage['/base/data.js'].functionData[9] = 0;
  _$jscoverage['/base/data.js'].functionData[10] = 0;
}
if (! _$jscoverage['/base/data.js'].branchData) {
  _$jscoverage['/base/data.js'].branchData = {};
  _$jscoverage['/base/data.js'].branchData['24'] = [];
  _$jscoverage['/base/data.js'].branchData['24'][1] = new BranchData();
  _$jscoverage['/base/data.js'].branchData['25'] = [];
  _$jscoverage['/base/data.js'].branchData['25'][1] = new BranchData();
  _$jscoverage['/base/data.js'].branchData['26'] = [];
  _$jscoverage['/base/data.js'].branchData['26'][1] = new BranchData();
  _$jscoverage['/base/data.js'].branchData['29'] = [];
  _$jscoverage['/base/data.js'].branchData['29'][1] = new BranchData();
  _$jscoverage['/base/data.js'].branchData['40'] = [];
  _$jscoverage['/base/data.js'].branchData['40'][1] = new BranchData();
  _$jscoverage['/base/data.js'].branchData['49'] = [];
  _$jscoverage['/base/data.js'].branchData['49'][1] = new BranchData();
  _$jscoverage['/base/data.js'].branchData['53'] = [];
  _$jscoverage['/base/data.js'].branchData['53'][1] = new BranchData();
  _$jscoverage['/base/data.js'].branchData['54'] = [];
  _$jscoverage['/base/data.js'].branchData['54'][1] = new BranchData();
  _$jscoverage['/base/data.js'].branchData['57'] = [];
  _$jscoverage['/base/data.js'].branchData['57'][1] = new BranchData();
  _$jscoverage['/base/data.js'].branchData['58'] = [];
  _$jscoverage['/base/data.js'].branchData['58'][1] = new BranchData();
  _$jscoverage['/base/data.js'].branchData['60'] = [];
  _$jscoverage['/base/data.js'].branchData['60'][1] = new BranchData();
  _$jscoverage['/base/data.js'].branchData['66'] = [];
  _$jscoverage['/base/data.js'].branchData['66'][1] = new BranchData();
  _$jscoverage['/base/data.js'].branchData['70'] = [];
  _$jscoverage['/base/data.js'].branchData['70'][1] = new BranchData();
  _$jscoverage['/base/data.js'].branchData['72'] = [];
  _$jscoverage['/base/data.js'].branchData['72'][1] = new BranchData();
  _$jscoverage['/base/data.js'].branchData['90'] = [];
  _$jscoverage['/base/data.js'].branchData['90'][1] = new BranchData();
  _$jscoverage['/base/data.js'].branchData['98'] = [];
  _$jscoverage['/base/data.js'].branchData['98'][1] = new BranchData();
  _$jscoverage['/base/data.js'].branchData['102'] = [];
  _$jscoverage['/base/data.js'].branchData['102'][1] = new BranchData();
  _$jscoverage['/base/data.js'].branchData['104'] = [];
  _$jscoverage['/base/data.js'].branchData['104'][1] = new BranchData();
  _$jscoverage['/base/data.js'].branchData['104'][2] = new BranchData();
  _$jscoverage['/base/data.js'].branchData['105'] = [];
  _$jscoverage['/base/data.js'].branchData['105'][1] = new BranchData();
  _$jscoverage['/base/data.js'].branchData['112'] = [];
  _$jscoverage['/base/data.js'].branchData['112'][1] = new BranchData();
  _$jscoverage['/base/data.js'].branchData['114'] = [];
  _$jscoverage['/base/data.js'].branchData['114'][1] = new BranchData();
  _$jscoverage['/base/data.js'].branchData['117'] = [];
  _$jscoverage['/base/data.js'].branchData['117'][1] = new BranchData();
  _$jscoverage['/base/data.js'].branchData['118'] = [];
  _$jscoverage['/base/data.js'].branchData['118'][1] = new BranchData();
  _$jscoverage['/base/data.js'].branchData['121'] = [];
  _$jscoverage['/base/data.js'].branchData['121'][1] = new BranchData();
  _$jscoverage['/base/data.js'].branchData['129'] = [];
  _$jscoverage['/base/data.js'].branchData['129'][1] = new BranchData();
  _$jscoverage['/base/data.js'].branchData['133'] = [];
  _$jscoverage['/base/data.js'].branchData['133'][1] = new BranchData();
  _$jscoverage['/base/data.js'].branchData['135'] = [];
  _$jscoverage['/base/data.js'].branchData['135'][1] = new BranchData();
  _$jscoverage['/base/data.js'].branchData['145'] = [];
  _$jscoverage['/base/data.js'].branchData['145'][1] = new BranchData();
  _$jscoverage['/base/data.js'].branchData['172'] = [];
  _$jscoverage['/base/data.js'].branchData['172'][1] = new BranchData();
  _$jscoverage['/base/data.js'].branchData['174'] = [];
  _$jscoverage['/base/data.js'].branchData['174'][1] = new BranchData();
  _$jscoverage['/base/data.js'].branchData['180'] = [];
  _$jscoverage['/base/data.js'].branchData['180'][1] = new BranchData();
  _$jscoverage['/base/data.js'].branchData['203'] = [];
  _$jscoverage['/base/data.js'].branchData['203'][1] = new BranchData();
  _$jscoverage['/base/data.js'].branchData['211'] = [];
  _$jscoverage['/base/data.js'].branchData['211'][1] = new BranchData();
  _$jscoverage['/base/data.js'].branchData['212'] = [];
  _$jscoverage['/base/data.js'].branchData['212'][1] = new BranchData();
  _$jscoverage['/base/data.js'].branchData['213'] = [];
  _$jscoverage['/base/data.js'].branchData['213'][1] = new BranchData();
  _$jscoverage['/base/data.js'].branchData['223'] = [];
  _$jscoverage['/base/data.js'].branchData['223'][1] = new BranchData();
  _$jscoverage['/base/data.js'].branchData['225'] = [];
  _$jscoverage['/base/data.js'].branchData['225'][1] = new BranchData();
  _$jscoverage['/base/data.js'].branchData['245'] = [];
  _$jscoverage['/base/data.js'].branchData['245'][1] = new BranchData();
  _$jscoverage['/base/data.js'].branchData['247'] = [];
  _$jscoverage['/base/data.js'].branchData['247'][1] = new BranchData();
}
_$jscoverage['/base/data.js'].branchData['247'][1].init(62, 13, 'elem.nodeType');
function visit226_247_1(result) {
  _$jscoverage['/base/data.js'].branchData['247'][1].ranCondition(result);
  return result;
}_$jscoverage['/base/data.js'].branchData['245'][1].init(100, 6, 'i >= 0');
function visit225_245_1(result) {
  _$jscoverage['/base/data.js'].branchData['245'][1].ranCondition(result);
  return result;
}_$jscoverage['/base/data.js'].branchData['225'][1].init(72, 13, 'elem.nodeType');
function visit224_225_1(result) {
  _$jscoverage['/base/data.js'].branchData['225'][1].ranCondition(result);
  return result;
}_$jscoverage['/base/data.js'].branchData['223'][1].init(53, 6, 'i >= 0');
function visit223_223_1(result) {
  _$jscoverage['/base/data.js'].branchData['223'][1].ranCondition(result);
  return result;
}_$jscoverage['/base/data.js'].branchData['213'][1].init(30, 13, 'elem.nodeType');
function visit222_213_1(result) {
  _$jscoverage['/base/data.js'].branchData['213'][1].ranCondition(result);
  return result;
}_$jscoverage['/base/data.js'].branchData['212'][1].init(26, 4, 'elem');
function visit221_212_1(result) {
  _$jscoverage['/base/data.js'].branchData['212'][1].ranCondition(result);
  return result;
}_$jscoverage['/base/data.js'].branchData['211'][1].init(380, 18, 'data === undefined');
function visit220_211_1(result) {
  _$jscoverage['/base/data.js'].branchData['211'][1].ranCondition(result);
  return result;
}_$jscoverage['/base/data.js'].branchData['203'][1].init(127, 21, 'S.isPlainObject(name)');
function visit219_203_1(result) {
  _$jscoverage['/base/data.js'].branchData['203'][1].ranCondition(result);
  return result;
}_$jscoverage['/base/data.js'].branchData['180'][1].init(319, 3, 'ret');
function visit218_180_1(result) {
  _$jscoverage['/base/data.js'].branchData['180'][1].ranCondition(result);
  return result;
}_$jscoverage['/base/data.js'].branchData['174'][1].init(68, 13, 'elem.nodeType');
function visit217_174_1(result) {
  _$jscoverage['/base/data.js'].branchData['174'][1].ranCondition(result);
  return result;
}_$jscoverage['/base/data.js'].branchData['172'][1].init(118, 16, 'i < elems.length');
function visit216_172_1(result) {
  _$jscoverage['/base/data.js'].branchData['172'][1].ranCondition(result);
  return result;
}_$jscoverage['/base/data.js'].branchData['145'][1].init(226, 20, 'elem.removeAttribute');
function visit215_145_1(result) {
  _$jscoverage['/base/data.js'].branchData['145'][1].ranCondition(result);
  return result;
}_$jscoverage['/base/data.js'].branchData['135'][1].init(59, 22, 'S.isEmptyObject(cache)');
function visit214_135_1(result) {
  _$jscoverage['/base/data.js'].branchData['135'][1].ranCondition(result);
  return result;
}_$jscoverage['/base/data.js'].branchData['133'][1].init(165, 18, 'name !== undefined');
function visit213_133_1(result) {
  _$jscoverage['/base/data.js'].branchData['133'][1].ranCondition(result);
  return result;
}_$jscoverage['/base/data.js'].branchData['129'][1].init(63, 4, '!key');
function visit212_129_1(result) {
  _$jscoverage['/base/data.js'].branchData['129'][1].ranCondition(result);
  return result;
}_$jscoverage['/base/data.js'].branchData['121'][1].init(76, 20, 'dataCache[key] || {}');
function visit211_121_1(result) {
  _$jscoverage['/base/data.js'].branchData['121'][1].ranCondition(result);
  return result;
}_$jscoverage['/base/data.js'].branchData['118'][1].init(29, 20, 'cache && cache[name]');
function visit210_118_1(result) {
  _$jscoverage['/base/data.js'].branchData['118'][1].ranCondition(result);
  return result;
}_$jscoverage['/base/data.js'].branchData['117'][1].init(22, 18, 'name !== undefined');
function visit209_117_1(result) {
  _$jscoverage['/base/data.js'].branchData['117'][1].ranCondition(result);
  return result;
}_$jscoverage['/base/data.js'].branchData['114'][1].init(68, 20, 'dataCache[key] || {}');
function visit208_114_1(result) {
  _$jscoverage['/base/data.js'].branchData['114'][1].ranCondition(result);
  return result;
}_$jscoverage['/base/data.js'].branchData['112'][1].init(500, 19, 'value !== undefined');
function visit207_112_1(result) {
  _$jscoverage['/base/data.js'].branchData['112'][1].ranCondition(result);
  return result;
}_$jscoverage['/base/data.js'].branchData['105'][1].init(42, 19, 'value === undefined');
function visit206_105_1(result) {
  _$jscoverage['/base/data.js'].branchData['105'][1].ranCondition(result);
  return result;
}_$jscoverage['/base/data.js'].branchData['104'][2].init(51, 18, 'name !== undefined');
function visit205_104_2(result) {
  _$jscoverage['/base/data.js'].branchData['104'][2].ranCondition(result);
  return result;
}_$jscoverage['/base/data.js'].branchData['104'][1].init(51, 62, 'name !== undefined && value === undefined');
function visit204_104_1(result) {
  _$jscoverage['/base/data.js'].branchData['104'][1].ranCondition(result);
  return result;
}_$jscoverage['/base/data.js'].branchData['102'][1].init(169, 4, '!key');
function visit203_102_1(result) {
  _$jscoverage['/base/data.js'].branchData['102'][1].ranCondition(result);
  return result;
}_$jscoverage['/base/data.js'].branchData['98'][1].init(18, 35, 'noData[elem.nodeName.toLowerCase()]');
function visit202_98_1(result) {
  _$jscoverage['/base/data.js'].branchData['98'][1].ranCondition(result);
  return result;
}_$jscoverage['/base/data.js'].branchData['90'][1].init(56, 4, '!key');
function visit201_90_1(result) {
  _$jscoverage['/base/data.js'].branchData['90'][1].ranCondition(result);
  return result;
}_$jscoverage['/base/data.js'].branchData['72'][1].init(59, 22, 'S.isEmptyObject(cache)');
function visit200_72_1(result) {
  _$jscoverage['/base/data.js'].branchData['72'][1].ranCondition(result);
  return result;
}_$jscoverage['/base/data.js'].branchData['70'][1].init(167, 18, 'name !== undefined');
function visit199_70_1(result) {
  _$jscoverage['/base/data.js'].branchData['70'][1].ranCondition(result);
  return result;
}_$jscoverage['/base/data.js'].branchData['66'][1].init(18, 9, 'ob == win');
function visit198_66_1(result) {
  _$jscoverage['/base/data.js'].branchData['66'][1].ranCondition(result);
  return result;
}_$jscoverage['/base/data.js'].branchData['60'][1].init(44, 17, 'ob[EXPANDO] || {}');
function visit197_60_1(result) {
  _$jscoverage['/base/data.js'].branchData['60'][1].ranCondition(result);
  return result;
}_$jscoverage['/base/data.js'].branchData['58'][1].init(29, 20, 'cache && cache[name]');
function visit196_58_1(result) {
  _$jscoverage['/base/data.js'].branchData['58'][1].ranCondition(result);
  return result;
}_$jscoverage['/base/data.js'].branchData['57'][1].init(22, 18, 'name !== undefined');
function visit195_57_1(result) {
  _$jscoverage['/base/data.js'].branchData['57'][1].ranCondition(result);
  return result;
}_$jscoverage['/base/data.js'].branchData['54'][1].init(40, 17, 'ob[EXPANDO] || {}');
function visit194_54_1(result) {
  _$jscoverage['/base/data.js'].branchData['54'][1].ranCondition(result);
  return result;
}_$jscoverage['/base/data.js'].branchData['53'][1].init(168, 19, 'value !== undefined');
function visit193_53_1(result) {
  _$jscoverage['/base/data.js'].branchData['53'][1].ranCondition(result);
  return result;
}_$jscoverage['/base/data.js'].branchData['49'][1].init(18, 9, 'ob == win');
function visit192_49_1(result) {
  _$jscoverage['/base/data.js'].branchData['49'][1].ranCondition(result);
  return result;
}_$jscoverage['/base/data.js'].branchData['40'][1].init(63, 9, 'ob == win');
function visit191_40_1(result) {
  _$jscoverage['/base/data.js'].branchData['40'][1].ranCondition(result);
  return result;
}_$jscoverage['/base/data.js'].branchData['29'][1].init(176, 23, '!S.isEmptyObject(cache)');
function visit190_29_1(result) {
  _$jscoverage['/base/data.js'].branchData['29'][1].ranCondition(result);
  return result;
}_$jscoverage['/base/data.js'].branchData['26'][1].init(26, 13, 'name in cache');
function visit189_26_1(result) {
  _$jscoverage['/base/data.js'].branchData['26'][1].ranCondition(result);
  return result;
}_$jscoverage['/base/data.js'].branchData['25'][1].init(22, 18, 'name !== undefined');
function visit188_25_1(result) {
  _$jscoverage['/base/data.js'].branchData['25'][1].ranCondition(result);
  return result;
}_$jscoverage['/base/data.js'].branchData['24'][1].init(18, 5, 'cache');
function visit187_24_1(result) {
  _$jscoverage['/base/data.js'].branchData['24'][1].ranCondition(result);
  return result;
}_$jscoverage['/base/data.js'].lineData[6]++;
KISSY.add('dom/base/data', function(S, Dom, undefined) {
  _$jscoverage['/base/data.js'].functionData[0]++;
  _$jscoverage['/base/data.js'].lineData[8]++;
  var win = S.Env.host, EXPANDO = '_ks_data_' + S.now(), dataCache = {}, winDataCache = {}, noData = {};
  _$jscoverage['/base/data.js'].lineData[18]++;
  noData['applet'] = 1;
  _$jscoverage['/base/data.js'].lineData[19]++;
  noData['object'] = 1;
  _$jscoverage['/base/data.js'].lineData[20]++;
  noData['embed'] = 1;
  _$jscoverage['/base/data.js'].lineData[22]++;
  var commonOps = {
  hasData: function(cache, name) {
  _$jscoverage['/base/data.js'].functionData[1]++;
  _$jscoverage['/base/data.js'].lineData[24]++;
  if (visit187_24_1(cache)) {
    _$jscoverage['/base/data.js'].lineData[25]++;
    if (visit188_25_1(name !== undefined)) {
      _$jscoverage['/base/data.js'].lineData[26]++;
      if (visit189_26_1(name in cache)) {
        _$jscoverage['/base/data.js'].lineData[27]++;
        return true;
      }
    } else {
      _$jscoverage['/base/data.js'].lineData[29]++;
      if (visit190_29_1(!S.isEmptyObject(cache))) {
        _$jscoverage['/base/data.js'].lineData[30]++;
        return true;
      }
    }
  }
  _$jscoverage['/base/data.js'].lineData[33]++;
  return false;
}};
  _$jscoverage['/base/data.js'].lineData[37]++;
  var objectOps = {
  hasData: function(ob, name) {
  _$jscoverage['/base/data.js'].functionData[2]++;
  _$jscoverage['/base/data.js'].lineData[40]++;
  if (visit191_40_1(ob == win)) {
    _$jscoverage['/base/data.js'].lineData[41]++;
    return objectOps.hasData(winDataCache, name);
  }
  _$jscoverage['/base/data.js'].lineData[44]++;
  var thisCache = ob[EXPANDO];
  _$jscoverage['/base/data.js'].lineData[45]++;
  return commonOps.hasData(thisCache, name);
}, 
  data: function(ob, name, value) {
  _$jscoverage['/base/data.js'].functionData[3]++;
  _$jscoverage['/base/data.js'].lineData[49]++;
  if (visit192_49_1(ob == win)) {
    _$jscoverage['/base/data.js'].lineData[50]++;
    return objectOps.data(winDataCache, name, value);
  }
  _$jscoverage['/base/data.js'].lineData[52]++;
  var cache = ob[EXPANDO];
  _$jscoverage['/base/data.js'].lineData[53]++;
  if (visit193_53_1(value !== undefined)) {
    _$jscoverage['/base/data.js'].lineData[54]++;
    cache = ob[EXPANDO] = visit194_54_1(ob[EXPANDO] || {});
    _$jscoverage['/base/data.js'].lineData[55]++;
    cache[name] = value;
  } else {
    _$jscoverage['/base/data.js'].lineData[57]++;
    if (visit195_57_1(name !== undefined)) {
      _$jscoverage['/base/data.js'].lineData[58]++;
      return visit196_58_1(cache && cache[name]);
    } else {
      _$jscoverage['/base/data.js'].lineData[60]++;
      cache = ob[EXPANDO] = visit197_60_1(ob[EXPANDO] || {});
      _$jscoverage['/base/data.js'].lineData[61]++;
      return cache;
    }
  }
}, 
  removeData: function(ob, name) {
  _$jscoverage['/base/data.js'].functionData[4]++;
  _$jscoverage['/base/data.js'].lineData[66]++;
  if (visit198_66_1(ob == win)) {
    _$jscoverage['/base/data.js'].lineData[67]++;
    return objectOps.removeData(winDataCache, name);
  }
  _$jscoverage['/base/data.js'].lineData[69]++;
  var cache = ob[EXPANDO];
  _$jscoverage['/base/data.js'].lineData[70]++;
  if (visit199_70_1(name !== undefined)) {
    _$jscoverage['/base/data.js'].lineData[71]++;
    delete cache[name];
    _$jscoverage['/base/data.js'].lineData[72]++;
    if (visit200_72_1(S.isEmptyObject(cache))) {
      _$jscoverage['/base/data.js'].lineData[73]++;
      objectOps.removeData(ob);
    }
  } else {
    _$jscoverage['/base/data.js'].lineData[76]++;
    try {
      _$jscoverage['/base/data.js'].lineData[79]++;
      delete ob[EXPANDO];
    }    catch (e) {
  _$jscoverage['/base/data.js'].lineData[81]++;
  ob[EXPANDO] = undefined;
}
  }
}};
  _$jscoverage['/base/data.js'].lineData[87]++;
  var domOps = {
  hasData: function(elem, name) {
  _$jscoverage['/base/data.js'].functionData[5]++;
  _$jscoverage['/base/data.js'].lineData[89]++;
  var key = elem[EXPANDO];
  _$jscoverage['/base/data.js'].lineData[90]++;
  if (visit201_90_1(!key)) {
    _$jscoverage['/base/data.js'].lineData[91]++;
    return false;
  }
  _$jscoverage['/base/data.js'].lineData[93]++;
  var thisCache = dataCache[key];
  _$jscoverage['/base/data.js'].lineData[94]++;
  return commonOps.hasData(thisCache, name);
}, 
  data: function(elem, name, value) {
  _$jscoverage['/base/data.js'].functionData[6]++;
  _$jscoverage['/base/data.js'].lineData[98]++;
  if (visit202_98_1(noData[elem.nodeName.toLowerCase()])) {
    _$jscoverage['/base/data.js'].lineData[99]++;
    return undefined;
  }
  _$jscoverage['/base/data.js'].lineData[101]++;
  var key = elem[EXPANDO], cache;
  _$jscoverage['/base/data.js'].lineData[102]++;
  if (visit203_102_1(!key)) {
    _$jscoverage['/base/data.js'].lineData[104]++;
    if (visit204_104_1(visit205_104_2(name !== undefined) && visit206_105_1(value === undefined))) {
      _$jscoverage['/base/data.js'].lineData[106]++;
      return undefined;
    }
    _$jscoverage['/base/data.js'].lineData[109]++;
    key = elem[EXPANDO] = S.guid();
  }
  _$jscoverage['/base/data.js'].lineData[111]++;
  cache = dataCache[key];
  _$jscoverage['/base/data.js'].lineData[112]++;
  if (visit207_112_1(value !== undefined)) {
    _$jscoverage['/base/data.js'].lineData[114]++;
    cache = dataCache[key] = visit208_114_1(dataCache[key] || {});
    _$jscoverage['/base/data.js'].lineData[115]++;
    cache[name] = value;
  } else {
    _$jscoverage['/base/data.js'].lineData[117]++;
    if (visit209_117_1(name !== undefined)) {
      _$jscoverage['/base/data.js'].lineData[118]++;
      return visit210_118_1(cache && cache[name]);
    } else {
      _$jscoverage['/base/data.js'].lineData[121]++;
      cache = dataCache[key] = visit211_121_1(dataCache[key] || {});
      _$jscoverage['/base/data.js'].lineData[122]++;
      return cache;
    }
  }
}, 
  removeData: function(elem, name) {
  _$jscoverage['/base/data.js'].functionData[7]++;
  _$jscoverage['/base/data.js'].lineData[128]++;
  var key = elem[EXPANDO], cache;
  _$jscoverage['/base/data.js'].lineData[129]++;
  if (visit212_129_1(!key)) {
    _$jscoverage['/base/data.js'].lineData[130]++;
    return;
  }
  _$jscoverage['/base/data.js'].lineData[132]++;
  cache = dataCache[key];
  _$jscoverage['/base/data.js'].lineData[133]++;
  if (visit213_133_1(name !== undefined)) {
    _$jscoverage['/base/data.js'].lineData[134]++;
    delete cache[name];
    _$jscoverage['/base/data.js'].lineData[135]++;
    if (visit214_135_1(S.isEmptyObject(cache))) {
      _$jscoverage['/base/data.js'].lineData[136]++;
      domOps.removeData(elem);
    }
  } else {
    _$jscoverage['/base/data.js'].lineData[139]++;
    delete dataCache[key];
    _$jscoverage['/base/data.js'].lineData[140]++;
    try {
      _$jscoverage['/base/data.js'].lineData[141]++;
      delete elem[EXPANDO];
    }    catch (e) {
  _$jscoverage['/base/data.js'].lineData[143]++;
  elem[EXPANDO] = undefined;
}
    _$jscoverage['/base/data.js'].lineData[145]++;
    if (visit215_145_1(elem.removeAttribute)) {
      _$jscoverage['/base/data.js'].lineData[146]++;
      elem.removeAttribute(EXPANDO);
    }
  }
}};
  _$jscoverage['/base/data.js'].lineData[153]++;
  S.mix(Dom, {
  __EXPANDO: EXPANDO, 
  hasData: function(selector, name) {
  _$jscoverage['/base/data.js'].functionData[8]++;
  _$jscoverage['/base/data.js'].lineData[170]++;
  var ret = false, elems = Dom.query(selector);
  _$jscoverage['/base/data.js'].lineData[172]++;
  for (var i = 0; visit216_172_1(i < elems.length); i++) {
    _$jscoverage['/base/data.js'].lineData[173]++;
    var elem = elems[i];
    _$jscoverage['/base/data.js'].lineData[174]++;
    if (visit217_174_1(elem.nodeType)) {
      _$jscoverage['/base/data.js'].lineData[175]++;
      ret = domOps.hasData(elem, name);
    } else {
      _$jscoverage['/base/data.js'].lineData[178]++;
      ret = objectOps.hasData(elem, name);
    }
    _$jscoverage['/base/data.js'].lineData[180]++;
    if (visit218_180_1(ret)) {
      _$jscoverage['/base/data.js'].lineData[181]++;
      return ret;
    }
  }
  _$jscoverage['/base/data.js'].lineData[184]++;
  return ret;
}, 
  data: function(selector, name, data) {
  _$jscoverage['/base/data.js'].functionData[9]++;
  _$jscoverage['/base/data.js'].lineData[200]++;
  var elems = Dom.query(selector), elem = elems[0];
  _$jscoverage['/base/data.js'].lineData[203]++;
  if (visit219_203_1(S.isPlainObject(name))) {
    _$jscoverage['/base/data.js'].lineData[204]++;
    for (var k in name) {
      _$jscoverage['/base/data.js'].lineData[205]++;
      Dom.data(elems, k, name[k]);
    }
    _$jscoverage['/base/data.js'].lineData[207]++;
    return undefined;
  }
  _$jscoverage['/base/data.js'].lineData[211]++;
  if (visit220_211_1(data === undefined)) {
    _$jscoverage['/base/data.js'].lineData[212]++;
    if (visit221_212_1(elem)) {
      _$jscoverage['/base/data.js'].lineData[213]++;
      if (visit222_213_1(elem.nodeType)) {
        _$jscoverage['/base/data.js'].lineData[214]++;
        return domOps.data(elem, name);
      } else {
        _$jscoverage['/base/data.js'].lineData[217]++;
        return objectOps.data(elem, name);
      }
    }
  } else {
    _$jscoverage['/base/data.js'].lineData[223]++;
    for (var i = elems.length - 1; visit223_223_1(i >= 0); i--) {
      _$jscoverage['/base/data.js'].lineData[224]++;
      elem = elems[i];
      _$jscoverage['/base/data.js'].lineData[225]++;
      if (visit224_225_1(elem.nodeType)) {
        _$jscoverage['/base/data.js'].lineData[226]++;
        domOps.data(elem, name, data);
      } else {
        _$jscoverage['/base/data.js'].lineData[229]++;
        objectOps.data(elem, name, data);
      }
    }
  }
  _$jscoverage['/base/data.js'].lineData[233]++;
  return undefined;
}, 
  removeData: function(selector, name) {
  _$jscoverage['/base/data.js'].functionData[10]++;
  _$jscoverage['/base/data.js'].lineData[244]++;
  var els = Dom.query(selector), elem, i;
  _$jscoverage['/base/data.js'].lineData[245]++;
  for (i = els.length - 1; visit225_245_1(i >= 0); i--) {
    _$jscoverage['/base/data.js'].lineData[246]++;
    elem = els[i];
    _$jscoverage['/base/data.js'].lineData[247]++;
    if (visit226_247_1(elem.nodeType)) {
      _$jscoverage['/base/data.js'].lineData[248]++;
      domOps.removeData(elem, name);
    } else {
      _$jscoverage['/base/data.js'].lineData[251]++;
      objectOps.removeData(elem, name);
    }
  }
}});
  _$jscoverage['/base/data.js'].lineData[257]++;
  return Dom;
}, {
  requires: ['./api']});

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
if (! _$jscoverage['/loader/get-script.js']) {
  _$jscoverage['/loader/get-script.js'] = {};
  _$jscoverage['/loader/get-script.js'].lineData = [];
  _$jscoverage['/loader/get-script.js'].lineData[6] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[7] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[43] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[46] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[54] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[55] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[58] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[59] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[60] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[61] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[62] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[63] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[66] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[68] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[70] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[71] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[74] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[76] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[77] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[78] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[82] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[83] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[84] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[88] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[89] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[92] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[93] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[94] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[96] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[97] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[100] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[102] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[103] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[105] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[106] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[107] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[108] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[111] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[114] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[120] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[122] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[123] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[126] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[127] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[128] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[131] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[132] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[137] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[138] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[139] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[140] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[141] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[145] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[146] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[147] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[150] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[153] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[154] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[155] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[158] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[159] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[161] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[164] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[167] = 0;
  _$jscoverage['/loader/get-script.js'].lineData[169] = 0;
}
if (! _$jscoverage['/loader/get-script.js'].functionData) {
  _$jscoverage['/loader/get-script.js'].functionData = [];
  _$jscoverage['/loader/get-script.js'].functionData[0] = 0;
  _$jscoverage['/loader/get-script.js'].functionData[1] = 0;
  _$jscoverage['/loader/get-script.js'].functionData[2] = 0;
  _$jscoverage['/loader/get-script.js'].functionData[3] = 0;
  _$jscoverage['/loader/get-script.js'].functionData[4] = 0;
  _$jscoverage['/loader/get-script.js'].functionData[5] = 0;
  _$jscoverage['/loader/get-script.js'].functionData[6] = 0;
  _$jscoverage['/loader/get-script.js'].functionData[7] = 0;
  _$jscoverage['/loader/get-script.js'].functionData[8] = 0;
  _$jscoverage['/loader/get-script.js'].functionData[9] = 0;
}
if (! _$jscoverage['/loader/get-script.js'].branchData) {
  _$jscoverage['/loader/get-script.js'].branchData = {};
  _$jscoverage['/loader/get-script.js'].branchData['54'] = [];
  _$jscoverage['/loader/get-script.js'].branchData['54'][1] = new BranchData();
  _$jscoverage['/loader/get-script.js'].branchData['58'] = [];
  _$jscoverage['/loader/get-script.js'].branchData['58'][1] = new BranchData();
  _$jscoverage['/loader/get-script.js'].branchData['66'] = [];
  _$jscoverage['/loader/get-script.js'].branchData['66'][1] = new BranchData();
  _$jscoverage['/loader/get-script.js'].branchData['70'] = [];
  _$jscoverage['/loader/get-script.js'].branchData['70'][1] = new BranchData();
  _$jscoverage['/loader/get-script.js'].branchData['76'] = [];
  _$jscoverage['/loader/get-script.js'].branchData['76'][1] = new BranchData();
  _$jscoverage['/loader/get-script.js'].branchData['82'] = [];
  _$jscoverage['/loader/get-script.js'].branchData['82'][1] = new BranchData();
  _$jscoverage['/loader/get-script.js'].branchData['88'] = [];
  _$jscoverage['/loader/get-script.js'].branchData['88'][1] = new BranchData();
  _$jscoverage['/loader/get-script.js'].branchData['92'] = [];
  _$jscoverage['/loader/get-script.js'].branchData['92'][1] = new BranchData();
  _$jscoverage['/loader/get-script.js'].branchData['107'] = [];
  _$jscoverage['/loader/get-script.js'].branchData['107'][1] = new BranchData();
  _$jscoverage['/loader/get-script.js'].branchData['120'] = [];
  _$jscoverage['/loader/get-script.js'].branchData['120'][1] = new BranchData();
  _$jscoverage['/loader/get-script.js'].branchData['120'][2] = new BranchData();
  _$jscoverage['/loader/get-script.js'].branchData['120'][3] = new BranchData();
  _$jscoverage['/loader/get-script.js'].branchData['122'] = [];
  _$jscoverage['/loader/get-script.js'].branchData['122'][1] = new BranchData();
  _$jscoverage['/loader/get-script.js'].branchData['122'][2] = new BranchData();
  _$jscoverage['/loader/get-script.js'].branchData['128'] = [];
  _$jscoverage['/loader/get-script.js'].branchData['128'][1] = new BranchData();
  _$jscoverage['/loader/get-script.js'].branchData['129'] = [];
  _$jscoverage['/loader/get-script.js'].branchData['129'][1] = new BranchData();
  _$jscoverage['/loader/get-script.js'].branchData['129'][2] = new BranchData();
  _$jscoverage['/loader/get-script.js'].branchData['130'] = [];
  _$jscoverage['/loader/get-script.js'].branchData['130'][1] = new BranchData();
  _$jscoverage['/loader/get-script.js'].branchData['137'] = [];
  _$jscoverage['/loader/get-script.js'].branchData['137'][1] = new BranchData();
  _$jscoverage['/loader/get-script.js'].branchData['145'] = [];
  _$jscoverage['/loader/get-script.js'].branchData['145'][1] = new BranchData();
  _$jscoverage['/loader/get-script.js'].branchData['153'] = [];
  _$jscoverage['/loader/get-script.js'].branchData['153'][1] = new BranchData();
  _$jscoverage['/loader/get-script.js'].branchData['158'] = [];
  _$jscoverage['/loader/get-script.js'].branchData['158'][1] = new BranchData();
  _$jscoverage['/loader/get-script.js'].branchData['161'] = [];
  _$jscoverage['/loader/get-script.js'].branchData['161'][1] = new BranchData();
}
_$jscoverage['/loader/get-script.js'].branchData['161'][1].init(3437, 3, 'css');
function visit434_161_1(result) {
  _$jscoverage['/loader/get-script.js'].branchData['161'][1].ranCondition(result);
  return result;
}_$jscoverage['/loader/get-script.js'].branchData['158'][1].init(3359, 9, '!headNode');
function visit433_158_1(result) {
  _$jscoverage['/loader/get-script.js'].branchData['158'][1].ranCondition(result);
  return result;
}_$jscoverage['/loader/get-script.js'].branchData['153'][1].init(3205, 7, 'timeout');
function visit432_153_1(result) {
  _$jscoverage['/loader/get-script.js'].branchData['153'][1].ranCondition(result);
  return result;
}_$jscoverage['/loader/get-script.js'].branchData['145'][1].init(3019, 3, 'css');
function visit431_145_1(result) {
  _$jscoverage['/loader/get-script.js'].branchData['145'][1].ranCondition(result);
  return result;
}_$jscoverage['/loader/get-script.js'].branchData['137'][1].init(2781, 9, 'useNative');
function visit430_137_1(result) {
  _$jscoverage['/loader/get-script.js'].branchData['137'][1].ranCondition(result);
  return result;
}_$jscoverage['/loader/get-script.js'].branchData['130'][1].init(42, 24, 'readyState == "complete"');
function visit429_130_1(result) {
  _$jscoverage['/loader/get-script.js'].branchData['130'][1].ranCondition(result);
  return result;
}_$jscoverage['/loader/get-script.js'].branchData['129'][2].init(99, 22, 'readyState == "loaded"');
function visit428_129_2(result) {
  _$jscoverage['/loader/get-script.js'].branchData['129'][2].ranCondition(result);
  return result;
}_$jscoverage['/loader/get-script.js'].branchData['129'][1].init(31, 67, 'readyState == "loaded" || readyState == "complete"');
function visit427_129_1(result) {
  _$jscoverage['/loader/get-script.js'].branchData['129'][1].ranCondition(result);
  return result;
}_$jscoverage['/loader/get-script.js'].branchData['128'][1].init(65, 99, '!readyState || readyState == "loaded" || readyState == "complete"');
function visit426_128_1(result) {
  _$jscoverage['/loader/get-script.js'].branchData['128'][1].ranCondition(result);
  return result;
}_$jscoverage['/loader/get-script.js'].branchData['122'][2].init(2346, 25, 'forceCssPoll && useNative');
function visit425_122_2(result) {
  _$jscoverage['/loader/get-script.js'].branchData['122'][2].ranCondition(result);
  return result;
}_$jscoverage['/loader/get-script.js'].branchData['122'][1].init(2339, 32, 'css && forceCssPoll && useNative');
function visit424_122_1(result) {
  _$jscoverage['/loader/get-script.js'].branchData['122'][1].ranCondition(result);
  return result;
}_$jscoverage['/loader/get-script.js'].branchData['120'][3].init(2306, 15, 'UA.webkit < 536');
function visit423_120_3(result) {
  _$jscoverage['/loader/get-script.js'].branchData['120'][3].ranCondition(result);
  return result;
}_$jscoverage['/loader/get-script.js'].branchData['120'][2].init(2293, 28, 'UA.webkit && UA.webkit < 536');
function visit422_120_2(result) {
  _$jscoverage['/loader/get-script.js'].branchData['120'][2].ranCondition(result);
  return result;
}_$jscoverage['/loader/get-script.js'].branchData['120'][1].init(2264, 58, 'S.Config[\'forceCssPoll\'] || (UA.webkit && UA.webkit < 536)');
function visit421_120_1(result) {
  _$jscoverage['/loader/get-script.js'].branchData['120'][1].ranCondition(result);
  return result;
}_$jscoverage['/loader/get-script.js'].branchData['107'][1].init(22, 20, 'fn = callback[index]');
function visit420_107_1(result) {
  _$jscoverage['/loader/get-script.js'].branchData['107'][1].ranCondition(result);
  return result;
}_$jscoverage['/loader/get-script.js'].branchData['92'][1].init(1333, 3, 'css');
function visit419_92_1(result) {
  _$jscoverage['/loader/get-script.js'].branchData['92'][1].ranCondition(result);
  return result;
}_$jscoverage['/loader/get-script.js'].branchData['88'][1].init(1259, 7, 'charset');
function visit418_88_1(result) {
  _$jscoverage['/loader/get-script.js'].branchData['88'][1].ranCondition(result);
  return result;
}_$jscoverage['/loader/get-script.js'].branchData['82'][1].init(1120, 5, 'attrs');
function visit417_82_1(result) {
  _$jscoverage['/loader/get-script.js'].branchData['82'][1].ranCondition(result);
  return result;
}_$jscoverage['/loader/get-script.js'].branchData['76'][1].init(22, 5, 'timer');
function visit416_76_1(result) {
  _$jscoverage['/loader/get-script.js'].branchData['76'][1].ranCondition(result);
  return result;
}_$jscoverage['/loader/get-script.js'].branchData['70'][1].init(786, 20, 'callbacks.length > 1');
function visit415_70_1(result) {
  _$jscoverage['/loader/get-script.js'].branchData['70'][1].ranCondition(result);
  return result;
}_$jscoverage['/loader/get-script.js'].branchData['66'][1].init(699, 25, 'jsCssCallbacks[url] || []');
function visit414_66_1(result) {
  _$jscoverage['/loader/get-script.js'].branchData['66'][1].ranCondition(result);
  return result;
}_$jscoverage['/loader/get-script.js'].branchData['58'][1].init(414, 23, 'S.isPlainObject(config)');
function visit413_58_1(result) {
  _$jscoverage['/loader/get-script.js'].branchData['58'][1].ranCondition(result);
  return result;
}_$jscoverage['/loader/get-script.js'].branchData['54'][1].init(309, 53, 'S.startsWith(Path.extname(url).toLowerCase(), \'.css\')');
function visit412_54_1(result) {
  _$jscoverage['/loader/get-script.js'].branchData['54'][1].ranCondition(result);
  return result;
}_$jscoverage['/loader/get-script.js'].lineData[6]++;
(function(S) {
  _$jscoverage['/loader/get-script.js'].functionData[0]++;
  _$jscoverage['/loader/get-script.js'].lineData[7]++;
  var MILLISECONDS_OF_SECOND = 1000, doc = S.Env.host.document, Utils = S.Loader.Utils, Path = S.Path, jsCssCallbacks = {}, headNode, UA = S.UA;
  _$jscoverage['/loader/get-script.js'].lineData[43]++;
  S.getScript = function(url, success, charset) {
  _$jscoverage['/loader/get-script.js'].functionData[1]++;
  _$jscoverage['/loader/get-script.js'].lineData[46]++;
  var config = success, css = 0, error, timeout, attrs, callbacks, timer;
  _$jscoverage['/loader/get-script.js'].lineData[54]++;
  if (visit412_54_1(S.startsWith(Path.extname(url).toLowerCase(), '.css'))) {
    _$jscoverage['/loader/get-script.js'].lineData[55]++;
    css = 1;
  }
  _$jscoverage['/loader/get-script.js'].lineData[58]++;
  if (visit413_58_1(S.isPlainObject(config))) {
    _$jscoverage['/loader/get-script.js'].lineData[59]++;
    success = config['success'];
    _$jscoverage['/loader/get-script.js'].lineData[60]++;
    error = config['error'];
    _$jscoverage['/loader/get-script.js'].lineData[61]++;
    timeout = config['timeout'];
    _$jscoverage['/loader/get-script.js'].lineData[62]++;
    charset = config['charset'];
    _$jscoverage['/loader/get-script.js'].lineData[63]++;
    attrs = config['attrs'];
  }
  _$jscoverage['/loader/get-script.js'].lineData[66]++;
  callbacks = jsCssCallbacks[url] = visit414_66_1(jsCssCallbacks[url] || []);
  _$jscoverage['/loader/get-script.js'].lineData[68]++;
  callbacks.push([success, error]);
  _$jscoverage['/loader/get-script.js'].lineData[70]++;
  if (visit415_70_1(callbacks.length > 1)) {
    _$jscoverage['/loader/get-script.js'].lineData[71]++;
    return callbacks.node;
  }
  _$jscoverage['/loader/get-script.js'].lineData[74]++;
  var node = doc.createElement(css ? 'link' : 'script'), clearTimer = function() {
  _$jscoverage['/loader/get-script.js'].functionData[2]++;
  _$jscoverage['/loader/get-script.js'].lineData[76]++;
  if (visit416_76_1(timer)) {
    _$jscoverage['/loader/get-script.js'].lineData[77]++;
    timer.cancel();
    _$jscoverage['/loader/get-script.js'].lineData[78]++;
    timer = undefined;
  }
};
  _$jscoverage['/loader/get-script.js'].lineData[82]++;
  if (visit417_82_1(attrs)) {
    _$jscoverage['/loader/get-script.js'].lineData[83]++;
    S.each(attrs, function(v, n) {
  _$jscoverage['/loader/get-script.js'].functionData[3]++;
  _$jscoverage['/loader/get-script.js'].lineData[84]++;
  node.setAttribute(n, v);
});
  }
  _$jscoverage['/loader/get-script.js'].lineData[88]++;
  if (visit418_88_1(charset)) {
    _$jscoverage['/loader/get-script.js'].lineData[89]++;
    node.charset = charset;
  }
  _$jscoverage['/loader/get-script.js'].lineData[92]++;
  if (visit419_92_1(css)) {
    _$jscoverage['/loader/get-script.js'].lineData[93]++;
    node.href = url;
    _$jscoverage['/loader/get-script.js'].lineData[94]++;
    node.rel = 'stylesheet';
  } else {
    _$jscoverage['/loader/get-script.js'].lineData[96]++;
    node.src = url;
    _$jscoverage['/loader/get-script.js'].lineData[97]++;
    node.async = true;
  }
  _$jscoverage['/loader/get-script.js'].lineData[100]++;
  callbacks.node = node;
  _$jscoverage['/loader/get-script.js'].lineData[102]++;
  var end = function(error) {
  _$jscoverage['/loader/get-script.js'].functionData[4]++;
  _$jscoverage['/loader/get-script.js'].lineData[103]++;
  var index = error, fn;
  _$jscoverage['/loader/get-script.js'].lineData[105]++;
  clearTimer();
  _$jscoverage['/loader/get-script.js'].lineData[106]++;
  S.each(jsCssCallbacks[url], function(callback) {
  _$jscoverage['/loader/get-script.js'].functionData[5]++;
  _$jscoverage['/loader/get-script.js'].lineData[107]++;
  if (visit420_107_1(fn = callback[index])) {
    _$jscoverage['/loader/get-script.js'].lineData[108]++;
    fn.call(node);
  }
});
  _$jscoverage['/loader/get-script.js'].lineData[111]++;
  delete jsCssCallbacks[url];
};
  _$jscoverage['/loader/get-script.js'].lineData[114]++;
  var useNative = 'onload' in node;
  _$jscoverage['/loader/get-script.js'].lineData[120]++;
  var forceCssPoll = visit421_120_1(S.Config['forceCssPoll'] || (visit422_120_2(UA.webkit && visit423_120_3(UA.webkit < 536))));
  _$jscoverage['/loader/get-script.js'].lineData[122]++;
  if (visit424_122_1(css && visit425_122_2(forceCssPoll && useNative))) {
    _$jscoverage['/loader/get-script.js'].lineData[123]++;
    useNative = false;
  }
  _$jscoverage['/loader/get-script.js'].lineData[126]++;
  function onload() {
    _$jscoverage['/loader/get-script.js'].functionData[6]++;
    _$jscoverage['/loader/get-script.js'].lineData[127]++;
    var readyState = node.readyState;
    _$jscoverage['/loader/get-script.js'].lineData[128]++;
    if (visit426_128_1(!readyState || visit427_129_1(visit428_129_2(readyState == "loaded") || visit429_130_1(readyState == "complete")))) {
      _$jscoverage['/loader/get-script.js'].lineData[131]++;
      node.onreadystatechange = node.onload = null;
      _$jscoverage['/loader/get-script.js'].lineData[132]++;
      end(0);
    }
  }
  _$jscoverage['/loader/get-script.js'].lineData[137]++;
  if (visit430_137_1(useNative)) {
    _$jscoverage['/loader/get-script.js'].lineData[138]++;
    node.onload = onload;
    _$jscoverage['/loader/get-script.js'].lineData[139]++;
    node.onerror = function() {
  _$jscoverage['/loader/get-script.js'].functionData[7]++;
  _$jscoverage['/loader/get-script.js'].lineData[140]++;
  node.onerror = null;
  _$jscoverage['/loader/get-script.js'].lineData[141]++;
  end(1);
};
  } else {
    _$jscoverage['/loader/get-script.js'].lineData[145]++;
    if (visit431_145_1(css)) {
      _$jscoverage['/loader/get-script.js'].lineData[146]++;
      Utils.pollCss(node, function() {
  _$jscoverage['/loader/get-script.js'].functionData[8]++;
  _$jscoverage['/loader/get-script.js'].lineData[147]++;
  end(0);
});
    } else {
      _$jscoverage['/loader/get-script.js'].lineData[150]++;
      node.onreadystatechange = onload;
    }
  }
  _$jscoverage['/loader/get-script.js'].lineData[153]++;
  if (visit432_153_1(timeout)) {
    _$jscoverage['/loader/get-script.js'].lineData[154]++;
    timer = S.later(function() {
  _$jscoverage['/loader/get-script.js'].functionData[9]++;
  _$jscoverage['/loader/get-script.js'].lineData[155]++;
  end(1);
}, timeout * MILLISECONDS_OF_SECOND);
  }
  _$jscoverage['/loader/get-script.js'].lineData[158]++;
  if (visit433_158_1(!headNode)) {
    _$jscoverage['/loader/get-script.js'].lineData[159]++;
    headNode = Utils.docHead();
  }
  _$jscoverage['/loader/get-script.js'].lineData[161]++;
  if (visit434_161_1(css)) {
    _$jscoverage['/loader/get-script.js'].lineData[164]++;
    headNode.appendChild(node);
  } else {
    _$jscoverage['/loader/get-script.js'].lineData[167]++;
    headNode.insertBefore(node, headNode.firstChild);
  }
  _$jscoverage['/loader/get-script.js'].lineData[169]++;
  return node;
};
})(KISSY);

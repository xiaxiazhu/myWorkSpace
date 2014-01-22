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
if (! _$jscoverage['/ie/style.js']) {
  _$jscoverage['/ie/style.js'] = {};
  _$jscoverage['/ie/style.js'].lineData = [];
  _$jscoverage['/ie/style.js'].lineData[6] = 0;
  _$jscoverage['/ie/style.js'].lineData[7] = 0;
  _$jscoverage['/ie/style.js'].lineData[26] = 0;
  _$jscoverage['/ie/style.js'].lineData[29] = 0;
  _$jscoverage['/ie/style.js'].lineData[31] = 0;
  _$jscoverage['/ie/style.js'].lineData[32] = 0;
  _$jscoverage['/ie/style.js'].lineData[36] = 0;
  _$jscoverage['/ie/style.js'].lineData[42] = 0;
  _$jscoverage['/ie/style.js'].lineData[43] = 0;
  _$jscoverage['/ie/style.js'].lineData[44] = 0;
  _$jscoverage['/ie/style.js'].lineData[49] = 0;
  _$jscoverage['/ie/style.js'].lineData[58] = 0;
  _$jscoverage['/ie/style.js'].lineData[60] = 0;
  _$jscoverage['/ie/style.js'].lineData[66] = 0;
  _$jscoverage['/ie/style.js'].lineData[70] = 0;
  _$jscoverage['/ie/style.js'].lineData[75] = 0;
  _$jscoverage['/ie/style.js'].lineData[77] = 0;
  _$jscoverage['/ie/style.js'].lineData[81] = 0;
  _$jscoverage['/ie/style.js'].lineData[87] = 0;
  _$jscoverage['/ie/style.js'].lineData[94] = 0;
  _$jscoverage['/ie/style.js'].lineData[102] = 0;
  _$jscoverage['/ie/style.js'].lineData[106] = 0;
  _$jscoverage['/ie/style.js'].lineData[107] = 0;
  _$jscoverage['/ie/style.js'].lineData[108] = 0;
  _$jscoverage['/ie/style.js'].lineData[110] = 0;
  _$jscoverage['/ie/style.js'].lineData[111] = 0;
  _$jscoverage['/ie/style.js'].lineData[114] = 0;
  _$jscoverage['/ie/style.js'].lineData[117] = 0;
  _$jscoverage['/ie/style.js'].lineData[120] = 0;
  _$jscoverage['/ie/style.js'].lineData[122] = 0;
  _$jscoverage['/ie/style.js'].lineData[123] = 0;
  _$jscoverage['/ie/style.js'].lineData[126] = 0;
  _$jscoverage['/ie/style.js'].lineData[129] = 0;
  _$jscoverage['/ie/style.js'].lineData[134] = 0;
  _$jscoverage['/ie/style.js'].lineData[135] = 0;
  _$jscoverage['/ie/style.js'].lineData[138] = 0;
  _$jscoverage['/ie/style.js'].lineData[150] = 0;
  _$jscoverage['/ie/style.js'].lineData[152] = 0;
  _$jscoverage['/ie/style.js'].lineData[157] = 0;
  _$jscoverage['/ie/style.js'].lineData[160] = 0;
  _$jscoverage['/ie/style.js'].lineData[161] = 0;
  _$jscoverage['/ie/style.js'].lineData[164] = 0;
  _$jscoverage['/ie/style.js'].lineData[166] = 0;
  _$jscoverage['/ie/style.js'].lineData[168] = 0;
}
if (! _$jscoverage['/ie/style.js'].functionData) {
  _$jscoverage['/ie/style.js'].functionData = [];
  _$jscoverage['/ie/style.js'].functionData[0] = 0;
  _$jscoverage['/ie/style.js'].functionData[1] = 0;
  _$jscoverage['/ie/style.js'].functionData[2] = 0;
  _$jscoverage['/ie/style.js'].functionData[3] = 0;
  _$jscoverage['/ie/style.js'].functionData[4] = 0;
  _$jscoverage['/ie/style.js'].functionData[5] = 0;
  _$jscoverage['/ie/style.js'].functionData[6] = 0;
}
if (! _$jscoverage['/ie/style.js'].branchData) {
  _$jscoverage['/ie/style.js'].branchData = {};
  _$jscoverage['/ie/style.js'].branchData['12'] = [];
  _$jscoverage['/ie/style.js'].branchData['12'][1] = new BranchData();
  _$jscoverage['/ie/style.js'].branchData['31'] = [];
  _$jscoverage['/ie/style.js'].branchData['31'][1] = new BranchData();
  _$jscoverage['/ie/style.js'].branchData['43'] = [];
  _$jscoverage['/ie/style.js'].branchData['43'][1] = new BranchData();
  _$jscoverage['/ie/style.js'].branchData['49'] = [];
  _$jscoverage['/ie/style.js'].branchData['49'][1] = new BranchData();
  _$jscoverage['/ie/style.js'].branchData['50'] = [];
  _$jscoverage['/ie/style.js'].branchData['50'][1] = new BranchData();
  _$jscoverage['/ie/style.js'].branchData['63'] = [];
  _$jscoverage['/ie/style.js'].branchData['63'][1] = new BranchData();
  _$jscoverage['/ie/style.js'].branchData['63'][2] = new BranchData();
  _$jscoverage['/ie/style.js'].branchData['63'][3] = new BranchData();
  _$jscoverage['/ie/style.js'].branchData['70'] = [];
  _$jscoverage['/ie/style.js'].branchData['70'][1] = new BranchData();
  _$jscoverage['/ie/style.js'].branchData['70'][2] = new BranchData();
  _$jscoverage['/ie/style.js'].branchData['70'][3] = new BranchData();
  _$jscoverage['/ie/style.js'].branchData['78'] = [];
  _$jscoverage['/ie/style.js'].branchData['78'][1] = new BranchData();
  _$jscoverage['/ie/style.js'].branchData['80'] = [];
  _$jscoverage['/ie/style.js'].branchData['80'][1] = new BranchData();
  _$jscoverage['/ie/style.js'].branchData['102'] = [];
  _$jscoverage['/ie/style.js'].branchData['102'][1] = new BranchData();
  _$jscoverage['/ie/style.js'].branchData['118'] = [];
  _$jscoverage['/ie/style.js'].branchData['118'][1] = new BranchData();
  _$jscoverage['/ie/style.js'].branchData['118'][2] = new BranchData();
  _$jscoverage['/ie/style.js'].branchData['120'] = [];
  _$jscoverage['/ie/style.js'].branchData['120'][1] = new BranchData();
  _$jscoverage['/ie/style.js'].branchData['120'][2] = new BranchData();
  _$jscoverage['/ie/style.js'].branchData['122'] = [];
  _$jscoverage['/ie/style.js'].branchData['122'][1] = new BranchData();
  _$jscoverage['/ie/style.js'].branchData['122'][2] = new BranchData();
  _$jscoverage['/ie/style.js'].branchData['135'] = [];
  _$jscoverage['/ie/style.js'].branchData['135'][1] = new BranchData();
  _$jscoverage['/ie/style.js'].branchData['138'] = [];
  _$jscoverage['/ie/style.js'].branchData['138'][1] = new BranchData();
  _$jscoverage['/ie/style.js'].branchData['150'] = [];
  _$jscoverage['/ie/style.js'].branchData['150'][1] = new BranchData();
  _$jscoverage['/ie/style.js'].branchData['160'] = [];
  _$jscoverage['/ie/style.js'].branchData['160'][1] = new BranchData();
  _$jscoverage['/ie/style.js'].branchData['160'][2] = new BranchData();
  _$jscoverage['/ie/style.js'].branchData['168'] = [];
  _$jscoverage['/ie/style.js'].branchData['168'][1] = new BranchData();
}
_$jscoverage['/ie/style.js'].branchData['168'][1].init(1483, 10, 'ret === \'\'');
function visit85_168_1(result) {
  _$jscoverage['/ie/style.js'].branchData['168'][1].ranCondition(result);
  return result;
}_$jscoverage['/ie/style.js'].branchData['160'][2].init(414, 8, 'ret || 0');
function visit84_160_2(result) {
  _$jscoverage['/ie/style.js'].branchData['160'][2].ranCondition(result);
  return result;
}_$jscoverage['/ie/style.js'].branchData['160'][1].init(383, 19, 'name === \'fontSize\'');
function visit83_160_1(result) {
  _$jscoverage['/ie/style.js'].branchData['160'][1].ranCondition(result);
  return result;
}_$jscoverage['/ie/style.js'].branchData['150'][1].init(807, 49, 'Dom._RE_NUM_NO_PX.test(ret) && !RE_POS.test(name)');
function visit82_150_1(result) {
  _$jscoverage['/ie/style.js'].branchData['150'][1].ranCondition(result);
  return result;
}_$jscoverage['/ie/style.js'].branchData['138'][1].init(162, 48, 'elem[CURRENT_STYLE] && elem[CURRENT_STYLE][name]');
function visit81_138_1(result) {
  _$jscoverage['/ie/style.js'].branchData['138'][1].ranCondition(result);
  return result;
}_$jscoverage['/ie/style.js'].branchData['135'][1].init(17, 22, 'cssProps[name] || name');
function visit80_135_1(result) {
  _$jscoverage['/ie/style.js'].branchData['135'][1].ranCondition(result);
  return result;
}_$jscoverage['/ie/style.js'].branchData['122'][2].init(80, 34, 'currentStyle[styleName] !== \'none\'');
function visit79_122_2(result) {
  _$jscoverage['/ie/style.js'].branchData['122'][2].ranCondition(result);
  return result;
}_$jscoverage['/ie/style.js'].branchData['122'][1].init(57, 57, 'BORDER_MAP[current] && currentStyle[styleName] !== \'none\'');
function visit78_122_1(result) {
  _$jscoverage['/ie/style.js'].branchData['122'][1].ranCondition(result);
  return result;
}_$jscoverage['/ie/style.js'].branchData['120'][2].init(290, 25, 'current.indexOf(\'px\') < 0');
function visit77_120_2(result) {
  _$jscoverage['/ie/style.js'].branchData['120'][2].ranCondition(result);
  return result;
}_$jscoverage['/ie/style.js'].branchData['120'][1].init(279, 36, 'current && current.indexOf(\'px\') < 0');
function visit76_120_1(result) {
  _$jscoverage['/ie/style.js'].branchData['120'][1].ranCondition(result);
  return result;
}_$jscoverage['/ie/style.js'].branchData['118'][2].init(85, 42, 'currentStyle && String(currentStyle[name])');
function visit75_118_2(result) {
  _$jscoverage['/ie/style.js'].branchData['118'][2].ranCondition(result);
  return result;
}_$jscoverage['/ie/style.js'].branchData['118'][1].init(85, 55, 'currentStyle && String(currentStyle[name]) || undefined');
function visit74_118_1(result) {
  _$jscoverage['/ie/style.js'].branchData['118'][1].ranCondition(result);
  return result;
}_$jscoverage['/ie/style.js'].branchData['102'][1].init(3896, 13, 'UA[\'ie\'] == 8');
function visit73_102_1(result) {
  _$jscoverage['/ie/style.js'].branchData['102'][1].ranCondition(result);
  return result;
}_$jscoverage['/ie/style.js'].branchData['80'][1].init(143, 37, 'currentStyle && !currentStyle[FILTER]');
function visit72_80_1(result) {
  _$jscoverage['/ie/style.js'].branchData['80'][1].ranCondition(result);
  return result;
}_$jscoverage['/ie/style.js'].branchData['78'][1].init(56, 181, '!opacity || currentStyle && !currentStyle[FILTER]');
function visit71_78_1(result) {
  _$jscoverage['/ie/style.js'].branchData['78'][1].ranCondition(result);
  return result;
}_$jscoverage['/ie/style.js'].branchData['70'][3].init(647, 8, 'val >= 1');
function visit70_70_3(result) {
  _$jscoverage['/ie/style.js'].branchData['70'][3].ranCondition(result);
  return result;
}_$jscoverage['/ie/style.js'].branchData['70'][2].init(647, 20, 'val >= 1 || !opacity');
function visit69_70_2(result) {
  _$jscoverage['/ie/style.js'].branchData['70'][2].ranCondition(result);
  return result;
}_$jscoverage['/ie/style.js'].branchData['70'][1].init(647, 61, '(val >= 1 || !opacity) && !S.trim(filter.replace(R_ALPHA, \'\'))');
function visit68_70_1(result) {
  _$jscoverage['/ie/style.js'].branchData['70'][1].ranCondition(result);
  return result;
}_$jscoverage['/ie/style.js'].branchData['63'][3].init(39, 19, 'style[FILTER] || \'\'');
function visit67_63_3(result) {
  _$jscoverage['/ie/style.js'].branchData['63'][3].ranCondition(result);
  return result;
}_$jscoverage['/ie/style.js'].branchData['63'][2].init(16, 36, 'currentStyle && currentStyle[FILTER]');
function visit66_63_2(result) {
  _$jscoverage['/ie/style.js'].branchData['63'][2].ranCondition(result);
  return result;
}_$jscoverage['/ie/style.js'].branchData['63'][1].init(227, 59, 'currentStyle && currentStyle[FILTER] || style[FILTER] || \'\'');
function visit65_63_1(result) {
  _$jscoverage['/ie/style.js'].branchData['63'][1].ranCondition(result);
  return result;
}_$jscoverage['/ie/style.js'].branchData['50'][1].init(-1, 31, 'computed && elem[CURRENT_STYLE]');
function visit64_50_1(result) {
  _$jscoverage['/ie/style.js'].branchData['50'][1].ranCondition(result);
  return result;
}_$jscoverage['/ie/style.js'].branchData['49'][1].init(41, 148, '(computed && elem[CURRENT_STYLE] ? elem[CURRENT_STYLE][FILTER] : elem[STYLE][FILTER]) || \'\'');
function visit63_49_1(result) {
  _$jscoverage['/ie/style.js'].branchData['49'][1].ranCondition(result);
  return result;
}_$jscoverage['/ie/style.js'].branchData['43'][1].init(14, 30, 'docElem.style[OPACITY] == null');
function visit62_43_1(result) {
  _$jscoverage['/ie/style.js'].branchData['43'][1].ranCondition(result);
  return result;
}_$jscoverage['/ie/style.js'].branchData['31'][1].init(18, 8, 'computed');
function visit61_31_1(result) {
  _$jscoverage['/ie/style.js'].branchData['31'][1].ranCondition(result);
  return result;
}_$jscoverage['/ie/style.js'].branchData['12'][1].init(168, 26, 'doc && doc.documentElement');
function visit60_12_1(result) {
  _$jscoverage['/ie/style.js'].branchData['12'][1].ranCondition(result);
  return result;
}_$jscoverage['/ie/style.js'].lineData[6]++;
KISSY.add('dom/ie/style', function(S, Dom) {
  _$jscoverage['/ie/style.js'].functionData[0]++;
  _$jscoverage['/ie/style.js'].lineData[7]++;
  var cssProps = Dom._cssProps, UA = S.UA, logger = S.getLogger('s/dom'), HUNDRED = 100, doc = S.Env.host.document, docElem = visit60_12_1(doc && doc.documentElement), OPACITY = 'opacity', STYLE = 'style', RE_POS = /^(top|right|bottom|left)$/, FILTER = 'filter', CURRENT_STYLE = 'currentStyle', RUNTIME_STYLE = 'runtimeStyle', LEFT = 'left', PX = 'px', cssHooks = Dom._cssHooks, backgroundPosition = 'backgroundPosition', R_OPACITY = /opacity\s*=\s*([^)]*)/, R_ALPHA = /alpha\([^)]*\)/i;
  _$jscoverage['/ie/style.js'].lineData[26]++;
  cssProps['float'] = 'styleFloat';
  _$jscoverage['/ie/style.js'].lineData[29]++;
  cssHooks[backgroundPosition] = {
  get: function(elem, computed) {
  _$jscoverage['/ie/style.js'].functionData[1]++;
  _$jscoverage['/ie/style.js'].lineData[31]++;
  if (visit61_31_1(computed)) {
    _$jscoverage['/ie/style.js'].lineData[32]++;
    return elem[CURRENT_STYLE][backgroundPosition + 'X'] + ' ' + elem[CURRENT_STYLE][backgroundPosition + 'Y'];
  } else {
    _$jscoverage['/ie/style.js'].lineData[36]++;
    return elem[STYLE][backgroundPosition];
  }
}};
  _$jscoverage['/ie/style.js'].lineData[42]++;
  try {
    _$jscoverage['/ie/style.js'].lineData[43]++;
    if (visit62_43_1(docElem.style[OPACITY] == null)) {
      _$jscoverage['/ie/style.js'].lineData[44]++;
      cssHooks[OPACITY] = {
  get: function(elem, computed) {
  _$jscoverage['/ie/style.js'].functionData[2]++;
  _$jscoverage['/ie/style.js'].lineData[49]++;
  return R_OPACITY.test(visit63_49_1((visit64_50_1(computed && elem[CURRENT_STYLE]) ? elem[CURRENT_STYLE][FILTER] : elem[STYLE][FILTER]) || '')) ? (parseFloat(RegExp.$1) / HUNDRED) + '' : computed ? '1' : '';
}, 
  set: function(elem, val) {
  _$jscoverage['/ie/style.js'].functionData[3]++;
  _$jscoverage['/ie/style.js'].lineData[58]++;
  val = parseFloat(val);
  _$jscoverage['/ie/style.js'].lineData[60]++;
  var style = elem[STYLE], currentStyle = elem[CURRENT_STYLE], opacity = isNaN(val) ? '' : 'alpha(' + OPACITY + '=' + val * HUNDRED + ')', filter = S.trim(visit65_63_1(visit66_63_2(currentStyle && currentStyle[FILTER]) || visit67_63_3(style[FILTER] || '')));
  _$jscoverage['/ie/style.js'].lineData[66]++;
  style.zoom = 1;
  _$jscoverage['/ie/style.js'].lineData[70]++;
  if (visit68_70_1((visit69_70_2(visit70_70_3(val >= 1) || !opacity)) && !S.trim(filter.replace(R_ALPHA, '')))) {
    _$jscoverage['/ie/style.js'].lineData[75]++;
    style.removeAttribute(FILTER);
    _$jscoverage['/ie/style.js'].lineData[77]++;
    if (visit71_78_1(!opacity || visit72_80_1(currentStyle && !currentStyle[FILTER]))) {
      _$jscoverage['/ie/style.js'].lineData[81]++;
      return;
    }
  }
  _$jscoverage['/ie/style.js'].lineData[87]++;
  style.filter = R_ALPHA.test(filter) ? filter.replace(R_ALPHA, opacity) : filter + (filter ? ', ' : '') + opacity;
}};
    }
  }  catch (ex) {
  _$jscoverage['/ie/style.js'].lineData[94]++;
  logger.debug('IE filters ActiveX is disabled. ex = ' + ex);
}
  _$jscoverage['/ie/style.js'].lineData[102]++;
  var IE8 = visit73_102_1(UA['ie'] == 8), BORDER_MAP = {}, BORDERS = ['', 'Top', 'Left', 'Right', 'Bottom'];
  _$jscoverage['/ie/style.js'].lineData[106]++;
  BORDER_MAP['thin'] = IE8 ? '1px' : '2px';
  _$jscoverage['/ie/style.js'].lineData[107]++;
  BORDER_MAP['medium'] = IE8 ? '3px' : '4px';
  _$jscoverage['/ie/style.js'].lineData[108]++;
  BORDER_MAP['thick'] = IE8 ? '5px' : '6px';
  _$jscoverage['/ie/style.js'].lineData[110]++;
  S.each(BORDERS, function(b) {
  _$jscoverage['/ie/style.js'].functionData[4]++;
  _$jscoverage['/ie/style.js'].lineData[111]++;
  var name = 'border' + b + 'Width', styleName = 'border' + b + 'Style';
  _$jscoverage['/ie/style.js'].lineData[114]++;
  cssHooks[name] = {
  get: function(elem, computed) {
  _$jscoverage['/ie/style.js'].functionData[5]++;
  _$jscoverage['/ie/style.js'].lineData[117]++;
  var currentStyle = computed ? elem[CURRENT_STYLE] : 0, current = visit74_118_1(visit75_118_2(currentStyle && String(currentStyle[name])) || undefined);
  _$jscoverage['/ie/style.js'].lineData[120]++;
  if (visit76_120_1(current && visit77_120_2(current.indexOf('px') < 0))) {
    _$jscoverage['/ie/style.js'].lineData[122]++;
    if (visit78_122_1(BORDER_MAP[current] && visit79_122_2(currentStyle[styleName] !== 'none'))) {
      _$jscoverage['/ie/style.js'].lineData[123]++;
      current = BORDER_MAP[current];
    } else {
      _$jscoverage['/ie/style.js'].lineData[126]++;
      current = 0;
    }
  }
  _$jscoverage['/ie/style.js'].lineData[129]++;
  return current;
}};
});
  _$jscoverage['/ie/style.js'].lineData[134]++;
  Dom._getComputedStyle = function(elem, name) {
  _$jscoverage['/ie/style.js'].functionData[6]++;
  _$jscoverage['/ie/style.js'].lineData[135]++;
  name = visit80_135_1(cssProps[name] || name);
  _$jscoverage['/ie/style.js'].lineData[138]++;
  var ret = visit81_138_1(elem[CURRENT_STYLE] && elem[CURRENT_STYLE][name]);
  _$jscoverage['/ie/style.js'].lineData[150]++;
  if (visit82_150_1(Dom._RE_NUM_NO_PX.test(ret) && !RE_POS.test(name))) {
    _$jscoverage['/ie/style.js'].lineData[152]++;
    var style = elem[STYLE], left = style[LEFT], rsLeft = elem[RUNTIME_STYLE][LEFT];
    _$jscoverage['/ie/style.js'].lineData[157]++;
    elem[RUNTIME_STYLE][LEFT] = elem[CURRENT_STYLE][LEFT];
    _$jscoverage['/ie/style.js'].lineData[160]++;
    style[LEFT] = visit83_160_1(name === 'fontSize') ? '1em' : (visit84_160_2(ret || 0));
    _$jscoverage['/ie/style.js'].lineData[161]++;
    ret = style['pixelLeft'] + PX;
    _$jscoverage['/ie/style.js'].lineData[164]++;
    style[LEFT] = left;
    _$jscoverage['/ie/style.js'].lineData[166]++;
    elem[RUNTIME_STYLE][LEFT] = rsLeft;
  }
  _$jscoverage['/ie/style.js'].lineData[168]++;
  return visit85_168_1(ret === '') ? 'auto' : ret;
};
}, {
  requires: ['dom/base']});

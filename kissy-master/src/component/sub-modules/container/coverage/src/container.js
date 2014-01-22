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
if (! _$jscoverage['/container.js']) {
  _$jscoverage['/container.js'] = {};
  _$jscoverage['/container.js'].lineData = [];
  _$jscoverage['/container.js'].lineData[6] = 0;
  _$jscoverage['/container.js'].lineData[7] = 0;
  _$jscoverage['/container.js'].lineData[8] = 0;
  _$jscoverage['/container.js'].lineData[9] = 0;
  _$jscoverage['/container.js'].lineData[10] = 0;
  _$jscoverage['/container.js'].lineData[12] = 0;
  _$jscoverage['/container.js'].lineData[16] = 0;
  _$jscoverage['/container.js'].lineData[19] = 0;
  _$jscoverage['/container.js'].lineData[21] = 0;
  _$jscoverage['/container.js'].lineData[23] = 0;
  _$jscoverage['/container.js'].lineData[25] = 0;
  _$jscoverage['/container.js'].lineData[26] = 0;
  _$jscoverage['/container.js'].lineData[28] = 0;
  _$jscoverage['/container.js'].lineData[34] = 0;
  _$jscoverage['/container.js'].lineData[35] = 0;
  _$jscoverage['/container.js'].lineData[37] = 0;
  _$jscoverage['/container.js'].lineData[38] = 0;
  _$jscoverage['/container.js'].lineData[41] = 0;
  _$jscoverage['/container.js'].lineData[48] = 0;
  _$jscoverage['/container.js'].lineData[49] = 0;
  _$jscoverage['/container.js'].lineData[52] = 0;
  _$jscoverage['/container.js'].lineData[54] = 0;
  _$jscoverage['/container.js'].lineData[56] = 0;
  _$jscoverage['/container.js'].lineData[57] = 0;
  _$jscoverage['/container.js'].lineData[59] = 0;
  _$jscoverage['/container.js'].lineData[60] = 0;
  _$jscoverage['/container.js'].lineData[61] = 0;
  _$jscoverage['/container.js'].lineData[66] = 0;
  _$jscoverage['/container.js'].lineData[77] = 0;
  _$jscoverage['/container.js'].lineData[81] = 0;
  _$jscoverage['/container.js'].lineData[85] = 0;
  _$jscoverage['/container.js'].lineData[89] = 0;
  _$jscoverage['/container.js'].lineData[93] = 0;
  _$jscoverage['/container.js'].lineData[97] = 0;
  _$jscoverage['/container.js'].lineData[101] = 0;
  _$jscoverage['/container.js'].lineData[105] = 0;
  _$jscoverage['/container.js'].lineData[108] = 0;
  _$jscoverage['/container.js'].lineData[109] = 0;
  _$jscoverage['/container.js'].lineData[114] = 0;
  _$jscoverage['/container.js'].lineData[117] = 0;
  _$jscoverage['/container.js'].lineData[118] = 0;
  _$jscoverage['/container.js'].lineData[135] = 0;
  _$jscoverage['/container.js'].lineData[137] = 0;
  _$jscoverage['/container.js'].lineData[138] = 0;
  _$jscoverage['/container.js'].lineData[140] = 0;
  _$jscoverage['/container.js'].lineData[147] = 0;
  _$jscoverage['/container.js'].lineData[150] = 0;
  _$jscoverage['/container.js'].lineData[152] = 0;
  _$jscoverage['/container.js'].lineData[159] = 0;
  _$jscoverage['/container.js'].lineData[166] = 0;
  _$jscoverage['/container.js'].lineData[167] = 0;
  _$jscoverage['/container.js'].lineData[168] = 0;
  _$jscoverage['/container.js'].lineData[169] = 0;
  _$jscoverage['/container.js'].lineData[170] = 0;
  _$jscoverage['/container.js'].lineData[171] = 0;
  _$jscoverage['/container.js'].lineData[172] = 0;
  _$jscoverage['/container.js'].lineData[173] = 0;
  _$jscoverage['/container.js'].lineData[176] = 0;
  _$jscoverage['/container.js'].lineData[177] = 0;
  _$jscoverage['/container.js'].lineData[179] = 0;
  _$jscoverage['/container.js'].lineData[181] = 0;
  _$jscoverage['/container.js'].lineData[183] = 0;
  _$jscoverage['/container.js'].lineData[188] = 0;
  _$jscoverage['/container.js'].lineData[204] = 0;
  _$jscoverage['/container.js'].lineData[205] = 0;
  _$jscoverage['/container.js'].lineData[207] = 0;
  _$jscoverage['/container.js'].lineData[222] = 0;
  _$jscoverage['/container.js'].lineData[225] = 0;
  _$jscoverage['/container.js'].lineData[226] = 0;
  _$jscoverage['/container.js'].lineData[228] = 0;
  _$jscoverage['/container.js'].lineData[237] = 0;
  _$jscoverage['/container.js'].lineData[238] = 0;
  _$jscoverage['/container.js'].lineData[246] = 0;
  _$jscoverage['/container.js'].lineData[248] = 0;
  _$jscoverage['/container.js'].lineData[249] = 0;
  _$jscoverage['/container.js'].lineData[264] = 0;
  _$jscoverage['/container.js'].lineData[268] = 0;
  _$jscoverage['/container.js'].lineData[269] = 0;
  _$jscoverage['/container.js'].lineData[270] = 0;
  _$jscoverage['/container.js'].lineData[271] = 0;
  _$jscoverage['/container.js'].lineData[272] = 0;
  _$jscoverage['/container.js'].lineData[273] = 0;
  _$jscoverage['/container.js'].lineData[276] = 0;
  _$jscoverage['/container.js'].lineData[279] = 0;
  _$jscoverage['/container.js'].lineData[282] = 0;
  _$jscoverage['/container.js'].lineData[283] = 0;
  _$jscoverage['/container.js'].lineData[284] = 0;
  _$jscoverage['/container.js'].lineData[285] = 0;
}
if (! _$jscoverage['/container.js'].functionData) {
  _$jscoverage['/container.js'].functionData = [];
  _$jscoverage['/container.js'].functionData[0] = 0;
  _$jscoverage['/container.js'].functionData[1] = 0;
  _$jscoverage['/container.js'].functionData[2] = 0;
  _$jscoverage['/container.js'].functionData[3] = 0;
  _$jscoverage['/container.js'].functionData[4] = 0;
  _$jscoverage['/container.js'].functionData[5] = 0;
  _$jscoverage['/container.js'].functionData[6] = 0;
  _$jscoverage['/container.js'].functionData[7] = 0;
  _$jscoverage['/container.js'].functionData[8] = 0;
  _$jscoverage['/container.js'].functionData[9] = 0;
  _$jscoverage['/container.js'].functionData[10] = 0;
  _$jscoverage['/container.js'].functionData[11] = 0;
  _$jscoverage['/container.js'].functionData[12] = 0;
  _$jscoverage['/container.js'].functionData[13] = 0;
  _$jscoverage['/container.js'].functionData[14] = 0;
  _$jscoverage['/container.js'].functionData[15] = 0;
  _$jscoverage['/container.js'].functionData[16] = 0;
}
if (! _$jscoverage['/container.js'].branchData) {
  _$jscoverage['/container.js'].branchData = {};
  _$jscoverage['/container.js'].branchData['9'] = [];
  _$jscoverage['/container.js'].branchData['9'][1] = new BranchData();
  _$jscoverage['/container.js'].branchData['25'] = [];
  _$jscoverage['/container.js'].branchData['25'][1] = new BranchData();
  _$jscoverage['/container.js'].branchData['37'] = [];
  _$jscoverage['/container.js'].branchData['37'][1] = new BranchData();
  _$jscoverage['/container.js'].branchData['48'] = [];
  _$jscoverage['/container.js'].branchData['48'][1] = new BranchData();
  _$jscoverage['/container.js'].branchData['54'] = [];
  _$jscoverage['/container.js'].branchData['54'][1] = new BranchData();
  _$jscoverage['/container.js'].branchData['56'] = [];
  _$jscoverage['/container.js'].branchData['56'][1] = new BranchData();
  _$jscoverage['/container.js'].branchData['59'] = [];
  _$jscoverage['/container.js'].branchData['59'][1] = new BranchData();
  _$jscoverage['/container.js'].branchData['60'] = [];
  _$jscoverage['/container.js'].branchData['60'][1] = new BranchData();
  _$jscoverage['/container.js'].branchData['93'] = [];
  _$jscoverage['/container.js'].branchData['93'][1] = new BranchData();
  _$jscoverage['/container.js'].branchData['108'] = [];
  _$jscoverage['/container.js'].branchData['108'][1] = new BranchData();
  _$jscoverage['/container.js'].branchData['117'] = [];
  _$jscoverage['/container.js'].branchData['117'][1] = new BranchData();
  _$jscoverage['/container.js'].branchData['137'] = [];
  _$jscoverage['/container.js'].branchData['137'][1] = new BranchData();
  _$jscoverage['/container.js'].branchData['169'] = [];
  _$jscoverage['/container.js'].branchData['169'][1] = new BranchData();
  _$jscoverage['/container.js'].branchData['170'] = [];
  _$jscoverage['/container.js'].branchData['170'][1] = new BranchData();
  _$jscoverage['/container.js'].branchData['172'] = [];
  _$jscoverage['/container.js'].branchData['172'][1] = new BranchData();
  _$jscoverage['/container.js'].branchData['176'] = [];
  _$jscoverage['/container.js'].branchData['176'][1] = new BranchData();
  _$jscoverage['/container.js'].branchData['204'] = [];
  _$jscoverage['/container.js'].branchData['204'][1] = new BranchData();
  _$jscoverage['/container.js'].branchData['225'] = [];
  _$jscoverage['/container.js'].branchData['225'][1] = new BranchData();
  _$jscoverage['/container.js'].branchData['238'] = [];
  _$jscoverage['/container.js'].branchData['238'][1] = new BranchData();
  _$jscoverage['/container.js'].branchData['248'] = [];
  _$jscoverage['/container.js'].branchData['248'][1] = new BranchData();
  _$jscoverage['/container.js'].branchData['249'] = [];
  _$jscoverage['/container.js'].branchData['249'][1] = new BranchData();
  _$jscoverage['/container.js'].branchData['268'] = [];
  _$jscoverage['/container.js'].branchData['268'][1] = new BranchData();
  _$jscoverage['/container.js'].branchData['270'] = [];
  _$jscoverage['/container.js'].branchData['270'][1] = new BranchData();
  _$jscoverage['/container.js'].branchData['271'] = [];
  _$jscoverage['/container.js'].branchData['271'][1] = new BranchData();
  _$jscoverage['/container.js'].branchData['282'] = [];
  _$jscoverage['/container.js'].branchData['282'][1] = new BranchData();
  _$jscoverage['/container.js'].branchData['284'] = [];
  _$jscoverage['/container.js'].branchData['284'][1] = new BranchData();
}
_$jscoverage['/container.js'].branchData['284'][1].init(65, 11, 'c.isControl');
function visit29_284_1(result) {
  _$jscoverage['/container.js'].branchData['284'][1].ranCondition(result);
  return result;
}_$jscoverage['/container.js'].branchData['282'][1].init(115, 12, 'i < v.length');
function visit28_282_1(result) {
  _$jscoverage['/container.js'].branchData['282'][1].ranCondition(result);
  return result;
}_$jscoverage['/container.js'].branchData['271'][1].init(48, 46, 'defaultChildCfg || self.get(\'defaultChildCfg\')');
function visit27_271_1(result) {
  _$jscoverage['/container.js'].branchData['271'][1].ranCondition(result);
  return result;
}_$jscoverage['/container.js'].branchData['270'][1].init(65, 12, '!c.isControl');
function visit26_270_1(result) {
  _$jscoverage['/container.js'].branchData['270'][1].ranCondition(result);
  return result;
}_$jscoverage['/container.js'].branchData['268'][1].init(177, 12, 'i < v.length');
function visit25_268_1(result) {
  _$jscoverage['/container.js'].branchData['268'][1].ranCondition(result);
  return result;
}_$jscoverage['/container.js'].branchData['249'][1].init(18, 44, 'children[i].destroy && children[i].destroy()');
function visit24_249_1(result) {
  _$jscoverage['/container.js'].branchData['249'][1].ranCondition(result);
  return result;
}_$jscoverage['/container.js'].branchData['248'][1].init(96, 19, 'i < children.length');
function visit23_248_1(result) {
  _$jscoverage['/container.js'].branchData['248'][1].ranCondition(result);
  return result;
}_$jscoverage['/container.js'].branchData['238'][1].init(71, 23, 'children[index] || null');
function visit22_238_1(result) {
  _$jscoverage['/container.js'].branchData['238'][1].ranCondition(result);
  return result;
}_$jscoverage['/container.js'].branchData['225'][1].init(130, 12, 'i < t.length');
function visit21_225_1(result) {
  _$jscoverage['/container.js'].branchData['225'][1].ranCondition(result);
  return result;
}_$jscoverage['/container.js'].branchData['204'][1].init(18, 21, 'destroy === undefined');
function visit20_204_1(result) {
  _$jscoverage['/container.js'].branchData['204'][1].ranCondition(result);
  return result;
}_$jscoverage['/container.js'].branchData['176'][1].init(22, 8, 'elBefore');
function visit19_176_1(result) {
  _$jscoverage['/container.js'].branchData['176'][1].ranCondition(result);
  return result;
}_$jscoverage['/container.js'].branchData['172'][1].init(51, 30, 'cEl.parentNode != domContentEl');
function visit18_172_1(result) {
  _$jscoverage['/container.js'].branchData['172'][1].ranCondition(result);
  return result;
}_$jscoverage['/container.js'].branchData['170'][1].init(435, 17, 'c.get(\'rendered\')');
function visit17_170_1(result) {
  _$jscoverage['/container.js'].branchData['170'][1].ranCondition(result);
  return result;
}_$jscoverage['/container.js'].branchData['169'][1].init(375, 41, 'domContentEl.children[childIndex] || null');
function visit16_169_1(result) {
  _$jscoverage['/container.js'].branchData['169'][1].ranCondition(result);
  return result;
}_$jscoverage['/container.js'].branchData['137'][1].init(98, 19, 'index === undefined');
function visit15_137_1(result) {
  _$jscoverage['/container.js'].branchData['137'][1].ranCondition(result);
  return result;
}_$jscoverage['/container.js'].branchData['117'][1].init(126, 19, 'i < children.length');
function visit14_117_1(result) {
  _$jscoverage['/container.js'].branchData['117'][1].ranCondition(result);
  return result;
}_$jscoverage['/container.js'].branchData['108'][1].init(126, 19, 'i < children.length');
function visit13_108_1(result) {
  _$jscoverage['/container.js'].branchData['108'][1].ranCondition(result);
  return result;
}_$jscoverage['/container.js'].branchData['93'][1].init(406, 38, 'defaultChildCfg.prefixCls || prefixCls');
function visit12_93_1(result) {
  _$jscoverage['/container.js'].branchData['93'][1].ranCondition(result);
  return result;
}_$jscoverage['/container.js'].branchData['60'][1].init(22, 32, 'cDOMParentEl = cDOMEl.parentNode');
function visit11_60_1(result) {
  _$jscoverage['/container.js'].branchData['60'][1].ranCondition(result);
  return result;
}_$jscoverage['/container.js'].branchData['59'][1].init(18, 24, 'c.get && (cDOMEl = c.el)');
function visit10_59_1(result) {
  _$jscoverage['/container.js'].branchData['59'][1].ranCondition(result);
  return result;
}_$jscoverage['/container.js'].branchData['56'][1].init(50, 9, 'c.destroy');
function visit9_56_1(result) {
  _$jscoverage['/container.js'].branchData['56'][1].ranCondition(result);
  return result;
}_$jscoverage['/container.js'].branchData['54'][1].init(423, 7, 'destroy');
function visit8_54_1(result) {
  _$jscoverage['/container.js'].branchData['54'][1].ranCondition(result);
  return result;
}_$jscoverage['/container.js'].branchData['48'][1].init(300, 11, 'index != -1');
function visit7_48_1(result) {
  _$jscoverage['/container.js'].branchData['48'][1].ranCondition(result);
  return result;
}_$jscoverage['/container.js'].branchData['37'][1].init(42, 17, 'e.target !== self');
function visit6_37_1(result) {
  _$jscoverage['/container.js'].branchData['37'][1].ranCondition(result);
  return result;
}_$jscoverage['/container.js'].branchData['25'][1].init(395, 20, 'self.get(\'rendered\')');
function visit5_25_1(result) {
  _$jscoverage['/container.js'].branchData['25'][1].ranCondition(result);
  return result;
}_$jscoverage['/container.js'].branchData['9'][1].init(40, 17, 'e.target !== self');
function visit4_9_1(result) {
  _$jscoverage['/container.js'].branchData['9'][1].ranCondition(result);
  return result;
}_$jscoverage['/container.js'].lineData[6]++;
KISSY.add('component/container', function(S, Control, ContainerRender) {
  _$jscoverage['/container.js'].functionData[0]++;
  _$jscoverage['/container.js'].lineData[7]++;
  function defAddChild(e) {
    _$jscoverage['/container.js'].functionData[1]++;
    _$jscoverage['/container.js'].lineData[8]++;
    var self = this;
    _$jscoverage['/container.js'].lineData[9]++;
    if (visit4_9_1(e.target !== self)) {
      _$jscoverage['/container.js'].lineData[10]++;
      return;
    }
    _$jscoverage['/container.js'].lineData[12]++;
    var c = e.component, children = self.get('children'), index = e.index;
    _$jscoverage['/container.js'].lineData[16]++;
    children.splice(index, 0, c);
    _$jscoverage['/container.js'].lineData[19]++;
    children = self.get('children');
    _$jscoverage['/container.js'].lineData[21]++;
    c = children[index];
    _$jscoverage['/container.js'].lineData[23]++;
    c.setInternal('parent', self);
    _$jscoverage['/container.js'].lineData[25]++;
    if (visit5_25_1(self.get('rendered'))) {
      _$jscoverage['/container.js'].lineData[26]++;
      self.renderChild(index);
    }
    _$jscoverage['/container.js'].lineData[28]++;
    self.fire('afterAddChild', {
  component: c, 
  index: index});
  }
  _$jscoverage['/container.js'].lineData[34]++;
  function defRemoveChild(e) {
    _$jscoverage['/container.js'].functionData[2]++;
    _$jscoverage['/container.js'].lineData[35]++;
    var self = this;
    _$jscoverage['/container.js'].lineData[37]++;
    if (visit6_37_1(e.target !== self)) {
      _$jscoverage['/container.js'].lineData[38]++;
      return;
    }
    _$jscoverage['/container.js'].lineData[41]++;
    var c = e.component, cDOMParentEl, cDOMEl, destroy = e.destroy, children = self.get('children'), index = e.index;
    _$jscoverage['/container.js'].lineData[48]++;
    if (visit7_48_1(index != -1)) {
      _$jscoverage['/container.js'].lineData[49]++;
      children.splice(index, 1);
    }
    _$jscoverage['/container.js'].lineData[52]++;
    c.setInternal('parent', null);
    _$jscoverage['/container.js'].lineData[54]++;
    if (visit8_54_1(destroy)) {
      _$jscoverage['/container.js'].lineData[56]++;
      if (visit9_56_1(c.destroy)) {
        _$jscoverage['/container.js'].lineData[57]++;
        c.destroy();
      }
    } else {
      _$jscoverage['/container.js'].lineData[59]++;
      if (visit10_59_1(c.get && (cDOMEl = c.el))) {
        _$jscoverage['/container.js'].lineData[60]++;
        if (visit11_60_1(cDOMParentEl = cDOMEl.parentNode)) {
          _$jscoverage['/container.js'].lineData[61]++;
          cDOMParentEl.removeChild(cDOMEl);
        }
      }
    }
    _$jscoverage['/container.js'].lineData[66]++;
    self.fire('afterRemoveChild', {
  component: c, 
  index: index});
  }
  _$jscoverage['/container.js'].lineData[77]++;
  return Control.extend({
  isContainer: true, 
  initializer: function() {
  _$jscoverage['/container.js'].functionData[3]++;
  _$jscoverage['/container.js'].lineData[81]++;
  var self = this, prefixCls = self.get('prefixCls'), defaultChildCfg = self.get('defaultChildCfg');
  _$jscoverage['/container.js'].lineData[85]++;
  self.publish('beforeAddChild', {
  defaultFn: defAddChild});
  _$jscoverage['/container.js'].lineData[89]++;
  self.publish('beforeRemoveChild', {
  defaultFn: defRemoveChild});
  _$jscoverage['/container.js'].lineData[93]++;
  defaultChildCfg.prefixCls = visit12_93_1(defaultChildCfg.prefixCls || prefixCls);
}, 
  createDom: function() {
  _$jscoverage['/container.js'].functionData[4]++;
  _$jscoverage['/container.js'].lineData[97]++;
  this.createChildren();
}, 
  renderUI: function() {
  _$jscoverage['/container.js'].functionData[5]++;
  _$jscoverage['/container.js'].lineData[101]++;
  this.renderChildren();
}, 
  renderChildren: function() {
  _$jscoverage['/container.js'].functionData[6]++;
  _$jscoverage['/container.js'].lineData[105]++;
  var i, self = this, children = self.get("children");
  _$jscoverage['/container.js'].lineData[108]++;
  for (i = 0; visit13_108_1(i < children.length); i++) {
    _$jscoverage['/container.js'].lineData[109]++;
    self.renderChild(i);
  }
}, 
  createChildren: function() {
  _$jscoverage['/container.js'].functionData[7]++;
  _$jscoverage['/container.js'].lineData[114]++;
  var i, self = this, children = self.get("children");
  _$jscoverage['/container.js'].lineData[117]++;
  for (i = 0; visit14_117_1(i < children.length); i++) {
    _$jscoverage['/container.js'].lineData[118]++;
    self.createChild(i);
  }
}, 
  addChild: function(c, index) {
  _$jscoverage['/container.js'].functionData[8]++;
  _$jscoverage['/container.js'].lineData[135]++;
  var self = this, children = self.get("children");
  _$jscoverage['/container.js'].lineData[137]++;
  if (visit15_137_1(index === undefined)) {
    _$jscoverage['/container.js'].lineData[138]++;
    index = children.length;
  }
  _$jscoverage['/container.js'].lineData[140]++;
  self.fire('beforeAddChild', {
  component: c, 
  index: index});
}, 
  renderChild: function(childIndex) {
  _$jscoverage['/container.js'].functionData[9]++;
  _$jscoverage['/container.js'].lineData[147]++;
  var self = this, children = self.get('children');
  _$jscoverage['/container.js'].lineData[150]++;
  self.createChild(childIndex).render();
  _$jscoverage['/container.js'].lineData[152]++;
  self.fire('afterRenderChild', {
  component: children[childIndex], 
  index: childIndex});
}, 
  createChild: function(childIndex) {
  _$jscoverage['/container.js'].functionData[10]++;
  _$jscoverage['/container.js'].lineData[159]++;
  var self = this, c, elBefore, domContentEl, children = self.get('children'), cEl, contentEl;
  _$jscoverage['/container.js'].lineData[166]++;
  c = children[childIndex];
  _$jscoverage['/container.js'].lineData[167]++;
  contentEl = self.view.getChildrenContainerEl();
  _$jscoverage['/container.js'].lineData[168]++;
  domContentEl = contentEl[0];
  _$jscoverage['/container.js'].lineData[169]++;
  elBefore = visit16_169_1(domContentEl.children[childIndex] || null);
  _$jscoverage['/container.js'].lineData[170]++;
  if (visit17_170_1(c.get('rendered'))) {
    _$jscoverage['/container.js'].lineData[171]++;
    cEl = c.el;
    _$jscoverage['/container.js'].lineData[172]++;
    if (visit18_172_1(cEl.parentNode != domContentEl)) {
      _$jscoverage['/container.js'].lineData[173]++;
      domContentEl.insertBefore(cEl, elBefore);
    }
  } else {
    _$jscoverage['/container.js'].lineData[176]++;
    if (visit19_176_1(elBefore)) {
      _$jscoverage['/container.js'].lineData[177]++;
      c.set("elBefore", elBefore);
    } else {
      _$jscoverage['/container.js'].lineData[179]++;
      c.set("render", contentEl);
    }
    _$jscoverage['/container.js'].lineData[181]++;
    c.create();
  }
  _$jscoverage['/container.js'].lineData[183]++;
  self.fire('afterCreateChild', {
  component: c, 
  index: childIndex});
  _$jscoverage['/container.js'].lineData[188]++;
  return c;
}, 
  removeChild: function(c, destroy) {
  _$jscoverage['/container.js'].functionData[11]++;
  _$jscoverage['/container.js'].lineData[204]++;
  if (visit20_204_1(destroy === undefined)) {
    _$jscoverage['/container.js'].lineData[205]++;
    destroy = true;
  }
  _$jscoverage['/container.js'].lineData[207]++;
  this.fire('beforeRemoveChild', {
  component: c, 
  index: S.indexOf(c, this.get('children')), 
  destroy: destroy});
}, 
  removeChildren: function(destroy) {
  _$jscoverage['/container.js'].functionData[12]++;
  _$jscoverage['/container.js'].lineData[222]++;
  var self = this, i, t = [].concat(self.get("children"));
  _$jscoverage['/container.js'].lineData[225]++;
  for (i = 0; visit21_225_1(i < t.length); i++) {
    _$jscoverage['/container.js'].lineData[226]++;
    self.removeChild(t[i], destroy);
  }
  _$jscoverage['/container.js'].lineData[228]++;
  return self;
}, 
  getChildAt: function(index) {
  _$jscoverage['/container.js'].functionData[13]++;
  _$jscoverage['/container.js'].lineData[237]++;
  var children = this.get("children");
  _$jscoverage['/container.js'].lineData[238]++;
  return visit22_238_1(children[index] || null);
}, 
  destructor: function() {
  _$jscoverage['/container.js'].functionData[14]++;
  _$jscoverage['/container.js'].lineData[246]++;
  var i, children = this.get("children");
  _$jscoverage['/container.js'].lineData[248]++;
  for (i = 0; visit23_248_1(i < children.length); i++) {
    _$jscoverage['/container.js'].lineData[249]++;
    visit24_249_1(children[i].destroy && children[i].destroy());
  }
}}, {
  ATTRS: {
  children: {
  value: [], 
  getter: function(v) {
  _$jscoverage['/container.js'].functionData[15]++;
  _$jscoverage['/container.js'].lineData[264]++;
  var defaultChildCfg = null, i, c, self = this;
  _$jscoverage['/container.js'].lineData[268]++;
  for (i = 0; visit25_268_1(i < v.length); i++) {
    _$jscoverage['/container.js'].lineData[269]++;
    c = v[i];
    _$jscoverage['/container.js'].lineData[270]++;
    if (visit26_270_1(!c.isControl)) {
      _$jscoverage['/container.js'].lineData[271]++;
      defaultChildCfg = visit27_271_1(defaultChildCfg || self.get('defaultChildCfg'));
      _$jscoverage['/container.js'].lineData[272]++;
      S.mix(c, defaultChildCfg, false);
      _$jscoverage['/container.js'].lineData[273]++;
      v[i] = this.createComponent(c);
    }
  }
  _$jscoverage['/container.js'].lineData[276]++;
  return v;
}, 
  setter: function(v) {
  _$jscoverage['/container.js'].functionData[16]++;
  _$jscoverage['/container.js'].lineData[279]++;
  var i, c;
  _$jscoverage['/container.js'].lineData[282]++;
  for (i = 0; visit28_282_1(i < v.length); i++) {
    _$jscoverage['/container.js'].lineData[283]++;
    c = v[i];
    _$jscoverage['/container.js'].lineData[284]++;
    if (visit29_284_1(c.isControl)) {
      _$jscoverage['/container.js'].lineData[285]++;
      c.setInternal('parent', this);
    }
  }
}}, 
  defaultChildCfg: {
  value: {}}, 
  xrender: {
  value: ContainerRender}}, 
  name: 'container'});
}, {
  requires: ['component/control', './container/render']});

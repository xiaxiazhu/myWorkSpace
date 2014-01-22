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
if (! _$jscoverage['/tree/node.js']) {
  _$jscoverage['/tree/node.js'] = {};
  _$jscoverage['/tree/node.js'].lineData = [];
  _$jscoverage['/tree/node.js'].lineData[6] = 0;
  _$jscoverage['/tree/node.js'].lineData[7] = 0;
  _$jscoverage['/tree/node.js'].lineData[15] = 0;
  _$jscoverage['/tree/node.js'].lineData[17] = 0;
  _$jscoverage['/tree/node.js'].lineData[18] = 0;
  _$jscoverage['/tree/node.js'].lineData[19] = 0;
  _$jscoverage['/tree/node.js'].lineData[24] = 0;
  _$jscoverage['/tree/node.js'].lineData[25] = 0;
  _$jscoverage['/tree/node.js'].lineData[31] = 0;
  _$jscoverage['/tree/node.js'].lineData[41] = 0;
  _$jscoverage['/tree/node.js'].lineData[43] = 0;
  _$jscoverage['/tree/node.js'].lineData[44] = 0;
  _$jscoverage['/tree/node.js'].lineData[49] = 0;
  _$jscoverage['/tree/node.js'].lineData[50] = 0;
  _$jscoverage['/tree/node.js'].lineData[55] = 0;
  _$jscoverage['/tree/node.js'].lineData[56] = 0;
  _$jscoverage['/tree/node.js'].lineData[61] = 0;
  _$jscoverage['/tree/node.js'].lineData[62] = 0;
  _$jscoverage['/tree/node.js'].lineData[67] = 0;
  _$jscoverage['/tree/node.js'].lineData[68] = 0;
  _$jscoverage['/tree/node.js'].lineData[73] = 0;
  _$jscoverage['/tree/node.js'].lineData[74] = 0;
  _$jscoverage['/tree/node.js'].lineData[76] = 0;
  _$jscoverage['/tree/node.js'].lineData[78] = 0;
  _$jscoverage['/tree/node.js'].lineData[83] = 0;
  _$jscoverage['/tree/node.js'].lineData[84] = 0;
  _$jscoverage['/tree/node.js'].lineData[85] = 0;
  _$jscoverage['/tree/node.js'].lineData[87] = 0;
  _$jscoverage['/tree/node.js'].lineData[90] = 0;
  _$jscoverage['/tree/node.js'].lineData[93] = 0;
  _$jscoverage['/tree/node.js'].lineData[94] = 0;
  _$jscoverage['/tree/node.js'].lineData[97] = 0;
  _$jscoverage['/tree/node.js'].lineData[98] = 0;
  _$jscoverage['/tree/node.js'].lineData[101] = 0;
  _$jscoverage['/tree/node.js'].lineData[105] = 0;
  _$jscoverage['/tree/node.js'].lineData[109] = 0;
  _$jscoverage['/tree/node.js'].lineData[110] = 0;
  _$jscoverage['/tree/node.js'].lineData[112] = 0;
  _$jscoverage['/tree/node.js'].lineData[113] = 0;
  _$jscoverage['/tree/node.js'].lineData[114] = 0;
  _$jscoverage['/tree/node.js'].lineData[115] = 0;
  _$jscoverage['/tree/node.js'].lineData[117] = 0;
  _$jscoverage['/tree/node.js'].lineData[121] = 0;
  _$jscoverage['/tree/node.js'].lineData[125] = 0;
  _$jscoverage['/tree/node.js'].lineData[126] = 0;
  _$jscoverage['/tree/node.js'].lineData[128] = 0;
  _$jscoverage['/tree/node.js'].lineData[129] = 0;
  _$jscoverage['/tree/node.js'].lineData[130] = 0;
  _$jscoverage['/tree/node.js'].lineData[131] = 0;
  _$jscoverage['/tree/node.js'].lineData[133] = 0;
  _$jscoverage['/tree/node.js'].lineData[140] = 0;
  _$jscoverage['/tree/node.js'].lineData[144] = 0;
  _$jscoverage['/tree/node.js'].lineData[148] = 0;
  _$jscoverage['/tree/node.js'].lineData[149] = 0;
  _$jscoverage['/tree/node.js'].lineData[150] = 0;
  _$jscoverage['/tree/node.js'].lineData[152] = 0;
  _$jscoverage['/tree/node.js'].lineData[153] = 0;
  _$jscoverage['/tree/node.js'].lineData[155] = 0;
  _$jscoverage['/tree/node.js'].lineData[162] = 0;
  _$jscoverage['/tree/node.js'].lineData[163] = 0;
  _$jscoverage['/tree/node.js'].lineData[165] = 0;
  _$jscoverage['/tree/node.js'].lineData[166] = 0;
  _$jscoverage['/tree/node.js'].lineData[171] = 0;
  _$jscoverage['/tree/node.js'].lineData[172] = 0;
  _$jscoverage['/tree/node.js'].lineData[173] = 0;
  _$jscoverage['/tree/node.js'].lineData[177] = 0;
  _$jscoverage['/tree/node.js'].lineData[178] = 0;
  _$jscoverage['/tree/node.js'].lineData[180] = 0;
  _$jscoverage['/tree/node.js'].lineData[188] = 0;
  _$jscoverage['/tree/node.js'].lineData[189] = 0;
  _$jscoverage['/tree/node.js'].lineData[190] = 0;
  _$jscoverage['/tree/node.js'].lineData[191] = 0;
  _$jscoverage['/tree/node.js'].lineData[199] = 0;
  _$jscoverage['/tree/node.js'].lineData[200] = 0;
  _$jscoverage['/tree/node.js'].lineData[201] = 0;
  _$jscoverage['/tree/node.js'].lineData[202] = 0;
  _$jscoverage['/tree/node.js'].lineData[279] = 0;
  _$jscoverage['/tree/node.js'].lineData[280] = 0;
  _$jscoverage['/tree/node.js'].lineData[281] = 0;
  _$jscoverage['/tree/node.js'].lineData[283] = 0;
  _$jscoverage['/tree/node.js'].lineData[310] = 0;
  _$jscoverage['/tree/node.js'].lineData[311] = 0;
  _$jscoverage['/tree/node.js'].lineData[312] = 0;
  _$jscoverage['/tree/node.js'].lineData[313] = 0;
  _$jscoverage['/tree/node.js'].lineData[317] = 0;
  _$jscoverage['/tree/node.js'].lineData[318] = 0;
  _$jscoverage['/tree/node.js'].lineData[319] = 0;
  _$jscoverage['/tree/node.js'].lineData[320] = 0;
  _$jscoverage['/tree/node.js'].lineData[321] = 0;
  _$jscoverage['/tree/node.js'].lineData[325] = 0;
  _$jscoverage['/tree/node.js'].lineData[326] = 0;
  _$jscoverage['/tree/node.js'].lineData[327] = 0;
  _$jscoverage['/tree/node.js'].lineData[328] = 0;
  _$jscoverage['/tree/node.js'].lineData[333] = 0;
  _$jscoverage['/tree/node.js'].lineData[334] = 0;
  _$jscoverage['/tree/node.js'].lineData[340] = 0;
  _$jscoverage['/tree/node.js'].lineData[343] = 0;
  _$jscoverage['/tree/node.js'].lineData[344] = 0;
  _$jscoverage['/tree/node.js'].lineData[346] = 0;
  _$jscoverage['/tree/node.js'].lineData[349] = 0;
  _$jscoverage['/tree/node.js'].lineData[350] = 0;
  _$jscoverage['/tree/node.js'].lineData[352] = 0;
  _$jscoverage['/tree/node.js'].lineData[353] = 0;
  _$jscoverage['/tree/node.js'].lineData[356] = 0;
  _$jscoverage['/tree/node.js'].lineData[360] = 0;
  _$jscoverage['/tree/node.js'].lineData[361] = 0;
  _$jscoverage['/tree/node.js'].lineData[362] = 0;
  _$jscoverage['/tree/node.js'].lineData[363] = 0;
  _$jscoverage['/tree/node.js'].lineData[365] = 0;
  _$jscoverage['/tree/node.js'].lineData[367] = 0;
  _$jscoverage['/tree/node.js'].lineData[371] = 0;
  _$jscoverage['/tree/node.js'].lineData[372] = 0;
  _$jscoverage['/tree/node.js'].lineData[375] = 0;
  _$jscoverage['/tree/node.js'].lineData[376] = 0;
  _$jscoverage['/tree/node.js'].lineData[380] = 0;
  _$jscoverage['/tree/node.js'].lineData[381] = 0;
  _$jscoverage['/tree/node.js'].lineData[382] = 0;
  _$jscoverage['/tree/node.js'].lineData[383] = 0;
  _$jscoverage['/tree/node.js'].lineData[385] = 0;
  _$jscoverage['/tree/node.js'].lineData[392] = 0;
  _$jscoverage['/tree/node.js'].lineData[393] = 0;
  _$jscoverage['/tree/node.js'].lineData[394] = 0;
  _$jscoverage['/tree/node.js'].lineData[398] = 0;
  _$jscoverage['/tree/node.js'].lineData[399] = 0;
  _$jscoverage['/tree/node.js'].lineData[400] = 0;
  _$jscoverage['/tree/node.js'].lineData[401] = 0;
  _$jscoverage['/tree/node.js'].lineData[402] = 0;
  _$jscoverage['/tree/node.js'].lineData[406] = 0;
  _$jscoverage['/tree/node.js'].lineData[407] = 0;
  _$jscoverage['/tree/node.js'].lineData[408] = 0;
  _$jscoverage['/tree/node.js'].lineData[410] = 0;
  _$jscoverage['/tree/node.js'].lineData[411] = 0;
  _$jscoverage['/tree/node.js'].lineData[412] = 0;
  _$jscoverage['/tree/node.js'].lineData[414] = 0;
  _$jscoverage['/tree/node.js'].lineData[419] = 0;
  _$jscoverage['/tree/node.js'].lineData[420] = 0;
  _$jscoverage['/tree/node.js'].lineData[421] = 0;
  _$jscoverage['/tree/node.js'].lineData[422] = 0;
  _$jscoverage['/tree/node.js'].lineData[425] = 0;
  _$jscoverage['/tree/node.js'].lineData[426] = 0;
  _$jscoverage['/tree/node.js'].lineData[427] = 0;
  _$jscoverage['/tree/node.js'].lineData[428] = 0;
}
if (! _$jscoverage['/tree/node.js'].functionData) {
  _$jscoverage['/tree/node.js'].functionData = [];
  _$jscoverage['/tree/node.js'].functionData[0] = 0;
  _$jscoverage['/tree/node.js'].functionData[1] = 0;
  _$jscoverage['/tree/node.js'].functionData[2] = 0;
  _$jscoverage['/tree/node.js'].functionData[3] = 0;
  _$jscoverage['/tree/node.js'].functionData[4] = 0;
  _$jscoverage['/tree/node.js'].functionData[5] = 0;
  _$jscoverage['/tree/node.js'].functionData[6] = 0;
  _$jscoverage['/tree/node.js'].functionData[7] = 0;
  _$jscoverage['/tree/node.js'].functionData[8] = 0;
  _$jscoverage['/tree/node.js'].functionData[9] = 0;
  _$jscoverage['/tree/node.js'].functionData[10] = 0;
  _$jscoverage['/tree/node.js'].functionData[11] = 0;
  _$jscoverage['/tree/node.js'].functionData[12] = 0;
  _$jscoverage['/tree/node.js'].functionData[13] = 0;
  _$jscoverage['/tree/node.js'].functionData[14] = 0;
  _$jscoverage['/tree/node.js'].functionData[15] = 0;
  _$jscoverage['/tree/node.js'].functionData[16] = 0;
  _$jscoverage['/tree/node.js'].functionData[17] = 0;
  _$jscoverage['/tree/node.js'].functionData[18] = 0;
  _$jscoverage['/tree/node.js'].functionData[19] = 0;
  _$jscoverage['/tree/node.js'].functionData[20] = 0;
  _$jscoverage['/tree/node.js'].functionData[21] = 0;
  _$jscoverage['/tree/node.js'].functionData[22] = 0;
  _$jscoverage['/tree/node.js'].functionData[23] = 0;
  _$jscoverage['/tree/node.js'].functionData[24] = 0;
  _$jscoverage['/tree/node.js'].functionData[25] = 0;
  _$jscoverage['/tree/node.js'].functionData[26] = 0;
  _$jscoverage['/tree/node.js'].functionData[27] = 0;
  _$jscoverage['/tree/node.js'].functionData[28] = 0;
}
if (! _$jscoverage['/tree/node.js'].branchData) {
  _$jscoverage['/tree/node.js'].branchData = {};
  _$jscoverage['/tree/node.js'].branchData['73'] = [];
  _$jscoverage['/tree/node.js'].branchData['73'][1] = new BranchData();
  _$jscoverage['/tree/node.js'].branchData['73'][2] = new BranchData();
  _$jscoverage['/tree/node.js'].branchData['73'][3] = new BranchData();
  _$jscoverage['/tree/node.js'].branchData['83'] = [];
  _$jscoverage['/tree/node.js'].branchData['83'][1] = new BranchData();
  _$jscoverage['/tree/node.js'].branchData['83'][2] = new BranchData();
  _$jscoverage['/tree/node.js'].branchData['84'] = [];
  _$jscoverage['/tree/node.js'].branchData['84'][1] = new BranchData();
  _$jscoverage['/tree/node.js'].branchData['97'] = [];
  _$jscoverage['/tree/node.js'].branchData['97'][1] = new BranchData();
  _$jscoverage['/tree/node.js'].branchData['109'] = [];
  _$jscoverage['/tree/node.js'].branchData['109'][1] = new BranchData();
  _$jscoverage['/tree/node.js'].branchData['114'] = [];
  _$jscoverage['/tree/node.js'].branchData['114'][1] = new BranchData();
  _$jscoverage['/tree/node.js'].branchData['125'] = [];
  _$jscoverage['/tree/node.js'].branchData['125'][1] = new BranchData();
  _$jscoverage['/tree/node.js'].branchData['130'] = [];
  _$jscoverage['/tree/node.js'].branchData['130'][1] = new BranchData();
  _$jscoverage['/tree/node.js'].branchData['149'] = [];
  _$jscoverage['/tree/node.js'].branchData['149'][1] = new BranchData();
  _$jscoverage['/tree/node.js'].branchData['165'] = [];
  _$jscoverage['/tree/node.js'].branchData['165'][1] = new BranchData();
  _$jscoverage['/tree/node.js'].branchData['178'] = [];
  _$jscoverage['/tree/node.js'].branchData['178'][1] = new BranchData();
  _$jscoverage['/tree/node.js'].branchData['280'] = [];
  _$jscoverage['/tree/node.js'].branchData['280'][1] = new BranchData();
  _$jscoverage['/tree/node.js'].branchData['312'] = [];
  _$jscoverage['/tree/node.js'].branchData['312'][1] = new BranchData();
  _$jscoverage['/tree/node.js'].branchData['319'] = [];
  _$jscoverage['/tree/node.js'].branchData['319'][1] = new BranchData();
  _$jscoverage['/tree/node.js'].branchData['327'] = [];
  _$jscoverage['/tree/node.js'].branchData['327'][1] = new BranchData();
  _$jscoverage['/tree/node.js'].branchData['335'] = [];
  _$jscoverage['/tree/node.js'].branchData['335'][1] = new BranchData();
  _$jscoverage['/tree/node.js'].branchData['336'] = [];
  _$jscoverage['/tree/node.js'].branchData['336'][1] = new BranchData();
  _$jscoverage['/tree/node.js'].branchData['340'] = [];
  _$jscoverage['/tree/node.js'].branchData['340'][1] = new BranchData();
  _$jscoverage['/tree/node.js'].branchData['340'][2] = new BranchData();
  _$jscoverage['/tree/node.js'].branchData['346'] = [];
  _$jscoverage['/tree/node.js'].branchData['346'][1] = new BranchData();
  _$jscoverage['/tree/node.js'].branchData['346'][2] = new BranchData();
  _$jscoverage['/tree/node.js'].branchData['346'][3] = new BranchData();
  _$jscoverage['/tree/node.js'].branchData['346'][4] = new BranchData();
  _$jscoverage['/tree/node.js'].branchData['352'] = [];
  _$jscoverage['/tree/node.js'].branchData['352'][1] = new BranchData();
  _$jscoverage['/tree/node.js'].branchData['362'] = [];
  _$jscoverage['/tree/node.js'].branchData['362'][1] = new BranchData();
  _$jscoverage['/tree/node.js'].branchData['375'] = [];
  _$jscoverage['/tree/node.js'].branchData['375'][1] = new BranchData();
  _$jscoverage['/tree/node.js'].branchData['382'] = [];
  _$jscoverage['/tree/node.js'].branchData['382'][1] = new BranchData();
  _$jscoverage['/tree/node.js'].branchData['393'] = [];
  _$jscoverage['/tree/node.js'].branchData['393'][1] = new BranchData();
  _$jscoverage['/tree/node.js'].branchData['400'] = [];
  _$jscoverage['/tree/node.js'].branchData['400'][1] = new BranchData();
  _$jscoverage['/tree/node.js'].branchData['407'] = [];
  _$jscoverage['/tree/node.js'].branchData['407'][1] = new BranchData();
  _$jscoverage['/tree/node.js'].branchData['411'] = [];
  _$jscoverage['/tree/node.js'].branchData['411'][1] = new BranchData();
  _$jscoverage['/tree/node.js'].branchData['425'] = [];
  _$jscoverage['/tree/node.js'].branchData['425'][1] = new BranchData();
}
_$jscoverage['/tree/node.js'].branchData['425'][1].init(183, 11, 'index < len');
function visit60_425_1(result) {
  _$jscoverage['/tree/node.js'].branchData['425'][1].ranCondition(result);
  return result;
}_$jscoverage['/tree/node.js'].branchData['411'][1].init(18, 27, 'typeof setDepth == \'number\'');
function visit59_411_1(result) {
  _$jscoverage['/tree/node.js'].branchData['411'][1].ranCondition(result);
  return result;
}_$jscoverage['/tree/node.js'].branchData['407'][1].init(14, 22, 'setDepth !== undefined');
function visit58_407_1(result) {
  _$jscoverage['/tree/node.js'].branchData['407'][1].ranCondition(result);
  return result;
}_$jscoverage['/tree/node.js'].branchData['400'][1].init(52, 4, 'tree');
function visit57_400_1(result) {
  _$jscoverage['/tree/node.js'].branchData['400'][1].ranCondition(result);
  return result;
}_$jscoverage['/tree/node.js'].branchData['393'][1].init(14, 21, 'self.get && self.view');
function visit56_393_1(result) {
  _$jscoverage['/tree/node.js'].branchData['393'][1].ranCondition(result);
  return result;
}_$jscoverage['/tree/node.js'].branchData['382'][1].init(298, 37, '!n && (parent = parent.get(\'parent\'))');
function visit55_382_1(result) {
  _$jscoverage['/tree/node.js'].branchData['382'][1].ranCondition(result);
  return result;
}_$jscoverage['/tree/node.js'].branchData['375'][1].init(97, 39, 'self.get("expanded") && children.length');
function visit54_375_1(result) {
  _$jscoverage['/tree/node.js'].branchData['375'][1].ranCondition(result);
  return result;
}_$jscoverage['/tree/node.js'].branchData['362'][1].init(47, 5, '!prev');
function visit53_362_1(result) {
  _$jscoverage['/tree/node.js'].branchData['362'][1].ranCondition(result);
  return result;
}_$jscoverage['/tree/node.js'].branchData['352'][1].init(95, 41, '!self.get("expanded") || !children.length');
function visit52_352_1(result) {
  _$jscoverage['/tree/node.js'].branchData['352'][1].ranCondition(result);
  return result;
}_$jscoverage['/tree/node.js'].branchData['346'][4].init(122, 20, 'isLeaf === undefined');
function visit51_346_4(result) {
  _$jscoverage['/tree/node.js'].branchData['346'][4].ranCondition(result);
  return result;
}_$jscoverage['/tree/node.js'].branchData['346'][3].init(122, 51, 'isLeaf === undefined && self.get("children").length');
function visit50_346_3(result) {
  _$jscoverage['/tree/node.js'].branchData['346'][3].ranCondition(result);
  return result;
}_$jscoverage['/tree/node.js'].branchData['346'][2].init(101, 16, 'isLeaf === false');
function visit49_346_2(result) {
  _$jscoverage['/tree/node.js'].branchData['346'][2].ranCondition(result);
  return result;
}_$jscoverage['/tree/node.js'].branchData['346'][1].init(101, 73, 'isLeaf === false || (isLeaf === undefined && self.get("children").length)');
function visit48_346_1(result) {
  _$jscoverage['/tree/node.js'].branchData['346'][1].ranCondition(result);
  return result;
}_$jscoverage['/tree/node.js'].branchData['340'][2].init(253, 17, 'lastChild == self');
function visit47_340_2(result) {
  _$jscoverage['/tree/node.js'].branchData['340'][2].ranCondition(result);
  return result;
}_$jscoverage['/tree/node.js'].branchData['340'][1].init(239, 31, '!lastChild || lastChild == self');
function visit46_340_1(result) {
  _$jscoverage['/tree/node.js'].branchData['340'][1].ranCondition(result);
  return result;
}_$jscoverage['/tree/node.js'].branchData['336'][1].init(115, 41, 'children && children[children.length - 1]');
function visit45_336_1(result) {
  _$jscoverage['/tree/node.js'].branchData['336'][1].ranCondition(result);
  return result;
}_$jscoverage['/tree/node.js'].branchData['335'][1].init(56, 32, 'parent && parent.get("children")');
function visit44_335_1(result) {
  _$jscoverage['/tree/node.js'].branchData['335'][1].ranCondition(result);
  return result;
}_$jscoverage['/tree/node.js'].branchData['327'][1].init(40, 17, 'e.target === self');
function visit43_327_1(result) {
  _$jscoverage['/tree/node.js'].branchData['327'][1].ranCondition(result);
  return result;
}_$jscoverage['/tree/node.js'].branchData['319'][1].init(40, 16, 'e.target == self');
function visit42_319_1(result) {
  _$jscoverage['/tree/node.js'].branchData['319'][1].ranCondition(result);
  return result;
}_$jscoverage['/tree/node.js'].branchData['312'][1].init(40, 16, 'e.target == self');
function visit41_312_1(result) {
  _$jscoverage['/tree/node.js'].branchData['312'][1].ranCondition(result);
  return result;
}_$jscoverage['/tree/node.js'].branchData['280'][1].init(67, 20, 'from && !from.isTree');
function visit40_280_1(result) {
  _$jscoverage['/tree/node.js'].branchData['280'][1].ranCondition(result);
  return result;
}_$jscoverage['/tree/node.js'].branchData['178'][1].init(60, 32, 'e && e.byPassSetTreeSelectedItem');
function visit39_178_1(result) {
  _$jscoverage['/tree/node.js'].branchData['178'][1].ranCondition(result);
  return result;
}_$jscoverage['/tree/node.js'].branchData['165'][1].init(158, 25, 'self === self.get(\'tree\')');
function visit38_165_1(result) {
  _$jscoverage['/tree/node.js'].branchData['165'][1].ranCondition(result);
  return result;
}_$jscoverage['/tree/node.js'].branchData['149'][1].init(206, 39, 'target.equals(self.get("expandIconEl"))');
function visit37_149_1(result) {
  _$jscoverage['/tree/node.js'].branchData['149'][1].ranCondition(result);
  return result;
}_$jscoverage['/tree/node.js'].branchData['130'][1].init(314, 11, 'index === 0');
function visit36_130_1(result) {
  _$jscoverage['/tree/node.js'].branchData['130'][1].ranCondition(result);
  return result;
}_$jscoverage['/tree/node.js'].branchData['125'][1].init(145, 7, '!parent');
function visit35_125_1(result) {
  _$jscoverage['/tree/node.js'].branchData['125'][1].ranCondition(result);
  return result;
}_$jscoverage['/tree/node.js'].branchData['114'][1].init(314, 28, 'index == siblings.length - 1');
function visit34_114_1(result) {
  _$jscoverage['/tree/node.js'].branchData['114'][1].ranCondition(result);
  return result;
}_$jscoverage['/tree/node.js'].branchData['109'][1].init(145, 7, '!parent');
function visit33_109_1(result) {
  _$jscoverage['/tree/node.js'].branchData['109'][1].ranCondition(result);
  return result;
}_$jscoverage['/tree/node.js'].branchData['97'][1].init(2193, 16, 'nodeToBeSelected');
function visit32_97_1(result) {
  _$jscoverage['/tree/node.js'].branchData['97'][1].ranCondition(result);
  return result;
}_$jscoverage['/tree/node.js'].branchData['84'][1].init(30, 9, '!expanded');
function visit31_84_1(result) {
  _$jscoverage['/tree/node.js'].branchData['84'][1].ranCondition(result);
  return result;
}_$jscoverage['/tree/node.js'].branchData['83'][2].init(63, 16, 'isLeaf === false');
function visit30_83_2(result) {
  _$jscoverage['/tree/node.js'].branchData['83'][2].ranCondition(result);
  return result;
}_$jscoverage['/tree/node.js'].branchData['83'][1].init(44, 35, 'children.length || isLeaf === false');
function visit29_83_1(result) {
  _$jscoverage['/tree/node.js'].branchData['83'][1].ranCondition(result);
  return result;
}_$jscoverage['/tree/node.js'].branchData['73'][3].init(75, 16, 'isLeaf === false');
function visit28_73_3(result) {
  _$jscoverage['/tree/node.js'].branchData['73'][3].ranCondition(result);
  return result;
}_$jscoverage['/tree/node.js'].branchData['73'][2].init(56, 35, 'children.length || isLeaf === false');
function visit27_73_2(result) {
  _$jscoverage['/tree/node.js'].branchData['73'][2].ranCondition(result);
  return result;
}_$jscoverage['/tree/node.js'].branchData['73'][1].init(43, 49, 'expanded && (children.length || isLeaf === false)');
function visit26_73_1(result) {
  _$jscoverage['/tree/node.js'].branchData['73'][1].ranCondition(result);
  return result;
}_$jscoverage['/tree/node.js'].lineData[6]++;
KISSY.add("tree/node", function(S, Node, Container, TreeNodeRender) {
  _$jscoverage['/tree/node.js'].functionData[0]++;
  _$jscoverage['/tree/node.js'].lineData[7]++;
  var $ = Node.all, KeyCode = Node.KeyCode;
  _$jscoverage['/tree/node.js'].lineData[15]++;
  return Container.extend({
  bindUI: function() {
  _$jscoverage['/tree/node.js'].functionData[1]++;
  _$jscoverage['/tree/node.js'].lineData[17]++;
  this.on('afterAddChild', onAddChild);
  _$jscoverage['/tree/node.js'].lineData[18]++;
  this.on('afterRemoveChild', onRemoveChild);
  _$jscoverage['/tree/node.js'].lineData[19]++;
  this.on('afterAddChild afterRemoveChild', syncAriaSetSize);
}, 
  syncUI: function() {
  _$jscoverage['/tree/node.js'].functionData[2]++;
  _$jscoverage['/tree/node.js'].lineData[24]++;
  refreshCss(this);
  _$jscoverage['/tree/node.js'].lineData[25]++;
  syncAriaSetSize.call(this, {
  target: this});
}, 
  handleKeyDownInternal: function(e) {
  _$jscoverage['/tree/node.js'].functionData[3]++;
  _$jscoverage['/tree/node.js'].lineData[31]++;
  var self = this, processed = true, tree = self.get("tree"), expanded = self.get("expanded"), nodeToBeSelected, isLeaf = self.get("isLeaf"), children = self.get("children"), keyCode = e.keyCode;
  _$jscoverage['/tree/node.js'].lineData[41]++;
  switch (keyCode) {
    case KeyCode.ENTER:
      _$jscoverage['/tree/node.js'].lineData[43]++;
      return self.handleClickInternal(e);
      _$jscoverage['/tree/node.js'].lineData[44]++;
      break;
    case KeyCode.HOME:
      _$jscoverage['/tree/node.js'].lineData[49]++;
      nodeToBeSelected = tree;
      _$jscoverage['/tree/node.js'].lineData[50]++;
      break;
    case KeyCode.END:
      _$jscoverage['/tree/node.js'].lineData[55]++;
      nodeToBeSelected = getLastVisibleDescendant(tree);
      _$jscoverage['/tree/node.js'].lineData[56]++;
      break;
    case KeyCode.UP:
      _$jscoverage['/tree/node.js'].lineData[61]++;
      nodeToBeSelected = getPreviousVisibleNode(self);
      _$jscoverage['/tree/node.js'].lineData[62]++;
      break;
    case KeyCode.DOWN:
      _$jscoverage['/tree/node.js'].lineData[67]++;
      nodeToBeSelected = getNextVisibleNode(self);
      _$jscoverage['/tree/node.js'].lineData[68]++;
      break;
    case KeyCode.LEFT:
      _$jscoverage['/tree/node.js'].lineData[73]++;
      if (visit26_73_1(expanded && (visit27_73_2(children.length || visit28_73_3(isLeaf === false))))) {
        _$jscoverage['/tree/node.js'].lineData[74]++;
        self.set("expanded", false);
      } else {
        _$jscoverage['/tree/node.js'].lineData[76]++;
        nodeToBeSelected = self.get('parent');
      }
      _$jscoverage['/tree/node.js'].lineData[78]++;
      break;
    case KeyCode.RIGHT:
      _$jscoverage['/tree/node.js'].lineData[83]++;
      if (visit29_83_1(children.length || visit30_83_2(isLeaf === false))) {
        _$jscoverage['/tree/node.js'].lineData[84]++;
        if (visit31_84_1(!expanded)) {
          _$jscoverage['/tree/node.js'].lineData[85]++;
          self.set("expanded", true);
        } else {
          _$jscoverage['/tree/node.js'].lineData[87]++;
          nodeToBeSelected = children[0];
        }
      }
      _$jscoverage['/tree/node.js'].lineData[90]++;
      break;
    default:
      _$jscoverage['/tree/node.js'].lineData[93]++;
      processed = false;
      _$jscoverage['/tree/node.js'].lineData[94]++;
      break;
  }
  _$jscoverage['/tree/node.js'].lineData[97]++;
  if (visit32_97_1(nodeToBeSelected)) {
    _$jscoverage['/tree/node.js'].lineData[98]++;
    nodeToBeSelected.select();
  }
  _$jscoverage['/tree/node.js'].lineData[101]++;
  return processed;
}, 
  next: function() {
  _$jscoverage['/tree/node.js'].functionData[4]++;
  _$jscoverage['/tree/node.js'].lineData[105]++;
  var self = this, parent = self.get('parent'), siblings, index;
  _$jscoverage['/tree/node.js'].lineData[109]++;
  if (visit33_109_1(!parent)) {
    _$jscoverage['/tree/node.js'].lineData[110]++;
    return null;
  }
  _$jscoverage['/tree/node.js'].lineData[112]++;
  siblings = parent.get('children');
  _$jscoverage['/tree/node.js'].lineData[113]++;
  index = S.indexOf(self, siblings);
  _$jscoverage['/tree/node.js'].lineData[114]++;
  if (visit34_114_1(index == siblings.length - 1)) {
    _$jscoverage['/tree/node.js'].lineData[115]++;
    return null;
  }
  _$jscoverage['/tree/node.js'].lineData[117]++;
  return siblings[index + 1];
}, 
  prev: function() {
  _$jscoverage['/tree/node.js'].functionData[5]++;
  _$jscoverage['/tree/node.js'].lineData[121]++;
  var self = this, parent = self.get('parent'), siblings, index;
  _$jscoverage['/tree/node.js'].lineData[125]++;
  if (visit35_125_1(!parent)) {
    _$jscoverage['/tree/node.js'].lineData[126]++;
    return null;
  }
  _$jscoverage['/tree/node.js'].lineData[128]++;
  siblings = parent.get('children');
  _$jscoverage['/tree/node.js'].lineData[129]++;
  index = S.indexOf(self, siblings);
  _$jscoverage['/tree/node.js'].lineData[130]++;
  if (visit36_130_1(index === 0)) {
    _$jscoverage['/tree/node.js'].lineData[131]++;
    return null;
  }
  _$jscoverage['/tree/node.js'].lineData[133]++;
  return siblings[index - 1];
}, 
  select: function() {
  _$jscoverage['/tree/node.js'].functionData[6]++;
  _$jscoverage['/tree/node.js'].lineData[140]++;
  this.set('selected', true);
}, 
  handleClickInternal: function(e) {
  _$jscoverage['/tree/node.js'].functionData[7]++;
  _$jscoverage['/tree/node.js'].lineData[144]++;
  var self = this, target = $(e.target), expanded = self.get("expanded"), tree = self.get("tree");
  _$jscoverage['/tree/node.js'].lineData[148]++;
  tree.focus();
  _$jscoverage['/tree/node.js'].lineData[149]++;
  if (visit37_149_1(target.equals(self.get("expandIconEl")))) {
    _$jscoverage['/tree/node.js'].lineData[150]++;
    self.set("expanded", !expanded);
  } else {
    _$jscoverage['/tree/node.js'].lineData[152]++;
    self.select();
    _$jscoverage['/tree/node.js'].lineData[153]++;
    self.fire("click");
  }
  _$jscoverage['/tree/node.js'].lineData[155]++;
  return true;
}, 
  createChildren: function() {
  _$jscoverage['/tree/node.js'].functionData[8]++;
  _$jscoverage['/tree/node.js'].lineData[162]++;
  var self = this;
  _$jscoverage['/tree/node.js'].lineData[163]++;
  self.renderChildren.apply(self, arguments);
  _$jscoverage['/tree/node.js'].lineData[165]++;
  if (visit38_165_1(self === self.get('tree'))) {
    _$jscoverage['/tree/node.js'].lineData[166]++;
    updateSubTreeStatus(self, self, -1, 0);
  }
}, 
  _onSetExpanded: function(v) {
  _$jscoverage['/tree/node.js'].functionData[9]++;
  _$jscoverage['/tree/node.js'].lineData[171]++;
  var self = this;
  _$jscoverage['/tree/node.js'].lineData[172]++;
  refreshCss(self);
  _$jscoverage['/tree/node.js'].lineData[173]++;
  self.fire(v ? "expand" : "collapse");
}, 
  _onSetSelected: function(v, e) {
  _$jscoverage['/tree/node.js'].functionData[10]++;
  _$jscoverage['/tree/node.js'].lineData[177]++;
  var tree = this.get("tree");
  _$jscoverage['/tree/node.js'].lineData[178]++;
  if (visit39_178_1(e && e.byPassSetTreeSelectedItem)) {
  } else {
    _$jscoverage['/tree/node.js'].lineData[180]++;
    tree.set('selectedItem', v ? this : null);
  }
}, 
  expandAll: function() {
  _$jscoverage['/tree/node.js'].functionData[11]++;
  _$jscoverage['/tree/node.js'].lineData[188]++;
  var self = this;
  _$jscoverage['/tree/node.js'].lineData[189]++;
  self.set("expanded", true);
  _$jscoverage['/tree/node.js'].lineData[190]++;
  S.each(self.get("children"), function(c) {
  _$jscoverage['/tree/node.js'].functionData[12]++;
  _$jscoverage['/tree/node.js'].lineData[191]++;
  c.expandAll();
});
}, 
  collapseAll: function() {
  _$jscoverage['/tree/node.js'].functionData[13]++;
  _$jscoverage['/tree/node.js'].lineData[199]++;
  var self = this;
  _$jscoverage['/tree/node.js'].lineData[200]++;
  self.set("expanded", false);
  _$jscoverage['/tree/node.js'].lineData[201]++;
  S.each(self.get("children"), function(c) {
  _$jscoverage['/tree/node.js'].functionData[14]++;
  _$jscoverage['/tree/node.js'].lineData[202]++;
  c.collapseAll();
});
}}, {
  ATTRS: {
  xrender: {
  value: TreeNodeRender}, 
  checkable: {
  value: false, 
  view: 1}, 
  handleMouseEvents: {
  value: false}, 
  isLeaf: {
  view: 1}, 
  expandIconEl: {}, 
  iconEl: {}, 
  selected: {
  view: 1}, 
  expanded: {
  sync: 0, 
  value: false, 
  view: 1}, 
  tooltip: {
  view: 1}, 
  tree: {
  getter: function() {
  _$jscoverage['/tree/node.js'].functionData[15]++;
  _$jscoverage['/tree/node.js'].lineData[279]++;
  var from = this;
  _$jscoverage['/tree/node.js'].lineData[280]++;
  while (visit40_280_1(from && !from.isTree)) {
    _$jscoverage['/tree/node.js'].lineData[281]++;
    from = from.get('parent');
  }
  _$jscoverage['/tree/node.js'].lineData[283]++;
  return from;
}}, 
  depth: {
  view: 1}, 
  focusable: {
  value: false}, 
  defaultChildCfg: {
  value: {
  xclass: 'tree-node'}}}, 
  xclass: 'tree-node'});
  _$jscoverage['/tree/node.js'].lineData[310]++;
  function onAddChild(e) {
    _$jscoverage['/tree/node.js'].functionData[16]++;
    _$jscoverage['/tree/node.js'].lineData[311]++;
    var self = this;
    _$jscoverage['/tree/node.js'].lineData[312]++;
    if (visit41_312_1(e.target == self)) {
      _$jscoverage['/tree/node.js'].lineData[313]++;
      updateSubTreeStatus(self, e.component, self.get('depth'), e.index);
    }
  }
  _$jscoverage['/tree/node.js'].lineData[317]++;
  function onRemoveChild(e) {
    _$jscoverage['/tree/node.js'].functionData[17]++;
    _$jscoverage['/tree/node.js'].lineData[318]++;
    var self = this;
    _$jscoverage['/tree/node.js'].lineData[319]++;
    if (visit42_319_1(e.target == self)) {
      _$jscoverage['/tree/node.js'].lineData[320]++;
      recursiveSetDepth(self.get('tree'), e.component);
      _$jscoverage['/tree/node.js'].lineData[321]++;
      refreshCssForSelfAndChildren(self, e.index);
    }
  }
  _$jscoverage['/tree/node.js'].lineData[325]++;
  function syncAriaSetSize(e) {
    _$jscoverage['/tree/node.js'].functionData[18]++;
    _$jscoverage['/tree/node.js'].lineData[326]++;
    var self = this;
    _$jscoverage['/tree/node.js'].lineData[327]++;
    if (visit43_327_1(e.target === self)) {
      _$jscoverage['/tree/node.js'].lineData[328]++;
      self.el.setAttribute('aria-setsize', self.get('children').length);
    }
  }
  _$jscoverage['/tree/node.js'].lineData[333]++;
  function isNodeSingleOrLast(self) {
    _$jscoverage['/tree/node.js'].functionData[19]++;
    _$jscoverage['/tree/node.js'].lineData[334]++;
    var parent = self.get('parent'), children = visit44_335_1(parent && parent.get("children")), lastChild = visit45_336_1(children && children[children.length - 1]);
    _$jscoverage['/tree/node.js'].lineData[340]++;
    return visit46_340_1(!lastChild || visit47_340_2(lastChild == self));
  }
  _$jscoverage['/tree/node.js'].lineData[343]++;
  function isNodeLeaf(self) {
    _$jscoverage['/tree/node.js'].functionData[20]++;
    _$jscoverage['/tree/node.js'].lineData[344]++;
    var isLeaf = self.get("isLeaf");
    _$jscoverage['/tree/node.js'].lineData[346]++;
    return !(visit48_346_1(visit49_346_2(isLeaf === false) || (visit50_346_3(visit51_346_4(isLeaf === undefined) && self.get("children").length))));
  }
  _$jscoverage['/tree/node.js'].lineData[349]++;
  function getLastVisibleDescendant(self) {
    _$jscoverage['/tree/node.js'].functionData[21]++;
    _$jscoverage['/tree/node.js'].lineData[350]++;
    var children = self.get("children");
    _$jscoverage['/tree/node.js'].lineData[352]++;
    if (visit52_352_1(!self.get("expanded") || !children.length)) {
      _$jscoverage['/tree/node.js'].lineData[353]++;
      return self;
    }
    _$jscoverage['/tree/node.js'].lineData[356]++;
    return getLastVisibleDescendant(children[children.length - 1]);
  }
  _$jscoverage['/tree/node.js'].lineData[360]++;
  function getPreviousVisibleNode(self) {
    _$jscoverage['/tree/node.js'].functionData[22]++;
    _$jscoverage['/tree/node.js'].lineData[361]++;
    var prev = self.prev();
    _$jscoverage['/tree/node.js'].lineData[362]++;
    if (visit53_362_1(!prev)) {
      _$jscoverage['/tree/node.js'].lineData[363]++;
      prev = self.get('parent');
    } else {
      _$jscoverage['/tree/node.js'].lineData[365]++;
      prev = getLastVisibleDescendant(prev);
    }
    _$jscoverage['/tree/node.js'].lineData[367]++;
    return prev;
  }
  _$jscoverage['/tree/node.js'].lineData[371]++;
  function getNextVisibleNode(self) {
    _$jscoverage['/tree/node.js'].functionData[23]++;
    _$jscoverage['/tree/node.js'].lineData[372]++;
    var children = self.get("children"), n, parent;
    _$jscoverage['/tree/node.js'].lineData[375]++;
    if (visit54_375_1(self.get("expanded") && children.length)) {
      _$jscoverage['/tree/node.js'].lineData[376]++;
      return children[0];
    }
    _$jscoverage['/tree/node.js'].lineData[380]++;
    n = self.next();
    _$jscoverage['/tree/node.js'].lineData[381]++;
    parent = self;
    _$jscoverage['/tree/node.js'].lineData[382]++;
    while (visit55_382_1(!n && (parent = parent.get('parent')))) {
      _$jscoverage['/tree/node.js'].lineData[383]++;
      n = parent.next();
    }
    _$jscoverage['/tree/node.js'].lineData[385]++;
    return n;
  }
  _$jscoverage['/tree/node.js'].lineData[392]++;
  function refreshCss(self) {
    _$jscoverage['/tree/node.js'].functionData[24]++;
    _$jscoverage['/tree/node.js'].lineData[393]++;
    if (visit56_393_1(self.get && self.view)) {
      _$jscoverage['/tree/node.js'].lineData[394]++;
      self.view.refreshCss(isNodeSingleOrLast(self), isNodeLeaf(self));
    }
  }
  _$jscoverage['/tree/node.js'].lineData[398]++;
  function updateSubTreeStatus(self, c, depth, index) {
    _$jscoverage['/tree/node.js'].functionData[25]++;
    _$jscoverage['/tree/node.js'].lineData[399]++;
    var tree = self.get("tree");
    _$jscoverage['/tree/node.js'].lineData[400]++;
    if (visit57_400_1(tree)) {
      _$jscoverage['/tree/node.js'].lineData[401]++;
      recursiveSetDepth(tree, c, depth + 1);
      _$jscoverage['/tree/node.js'].lineData[402]++;
      refreshCssForSelfAndChildren(self, index);
    }
  }
  _$jscoverage['/tree/node.js'].lineData[406]++;
  function recursiveSetDepth(tree, c, setDepth) {
    _$jscoverage['/tree/node.js'].functionData[26]++;
    _$jscoverage['/tree/node.js'].lineData[407]++;
    if (visit58_407_1(setDepth !== undefined)) {
      _$jscoverage['/tree/node.js'].lineData[408]++;
      c.set("depth", setDepth);
    }
    _$jscoverage['/tree/node.js'].lineData[410]++;
    S.each(c.get("children"), function(child) {
  _$jscoverage['/tree/node.js'].functionData[27]++;
  _$jscoverage['/tree/node.js'].lineData[411]++;
  if (visit59_411_1(typeof setDepth == 'number')) {
    _$jscoverage['/tree/node.js'].lineData[412]++;
    recursiveSetDepth(tree, child, setDepth + 1);
  } else {
    _$jscoverage['/tree/node.js'].lineData[414]++;
    recursiveSetDepth(tree, child);
  }
});
  }
  _$jscoverage['/tree/node.js'].lineData[419]++;
  function refreshCssForSelfAndChildren(self, index) {
    _$jscoverage['/tree/node.js'].functionData[28]++;
    _$jscoverage['/tree/node.js'].lineData[420]++;
    refreshCss(self);
    _$jscoverage['/tree/node.js'].lineData[421]++;
    index = Math.max(0, index - 1);
    _$jscoverage['/tree/node.js'].lineData[422]++;
    var children = self.get('children'), c, len = children.length;
    _$jscoverage['/tree/node.js'].lineData[425]++;
    for (; visit60_425_1(index < len); index++) {
      _$jscoverage['/tree/node.js'].lineData[426]++;
      c = children[index];
      _$jscoverage['/tree/node.js'].lineData[427]++;
      refreshCss(c);
      _$jscoverage['/tree/node.js'].lineData[428]++;
      c.el.setAttribute("aria-posinset", index + 1);
    }
  }
}, {
  requires: ['node', 'component/container', './node-render']});

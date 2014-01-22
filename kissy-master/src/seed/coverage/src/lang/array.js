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
if (! _$jscoverage['/lang/array.js']) {
  _$jscoverage['/lang/array.js'] = {};
  _$jscoverage['/lang/array.js'].lineData = [];
  _$jscoverage['/lang/array.js'].lineData[7] = 0;
  _$jscoverage['/lang/array.js'].lineData[9] = 0;
  _$jscoverage['/lang/array.js'].lineData[19] = 0;
  _$jscoverage['/lang/array.js'].lineData[29] = 0;
  _$jscoverage['/lang/array.js'].lineData[30] = 0;
  _$jscoverage['/lang/array.js'].lineData[38] = 0;
  _$jscoverage['/lang/array.js'].lineData[40] = 0;
  _$jscoverage['/lang/array.js'].lineData[41] = 0;
  _$jscoverage['/lang/array.js'].lineData[42] = 0;
  _$jscoverage['/lang/array.js'].lineData[43] = 0;
  _$jscoverage['/lang/array.js'].lineData[45] = 0;
  _$jscoverage['/lang/array.js'].lineData[46] = 0;
  _$jscoverage['/lang/array.js'].lineData[50] = 0;
  _$jscoverage['/lang/array.js'].lineData[52] = 0;
  _$jscoverage['/lang/array.js'].lineData[53] = 0;
  _$jscoverage['/lang/array.js'].lineData[58] = 0;
  _$jscoverage['/lang/array.js'].lineData[71] = 0;
  _$jscoverage['/lang/array.js'].lineData[74] = 0;
  _$jscoverage['/lang/array.js'].lineData[75] = 0;
  _$jscoverage['/lang/array.js'].lineData[76] = 0;
  _$jscoverage['/lang/array.js'].lineData[79] = 0;
  _$jscoverage['/lang/array.js'].lineData[94] = 0;
  _$jscoverage['/lang/array.js'].lineData[97] = 0;
  _$jscoverage['/lang/array.js'].lineData[98] = 0;
  _$jscoverage['/lang/array.js'].lineData[99] = 0;
  _$jscoverage['/lang/array.js'].lineData[102] = 0;
  _$jscoverage['/lang/array.js'].lineData[114] = 0;
  _$jscoverage['/lang/array.js'].lineData[115] = 0;
  _$jscoverage['/lang/array.js'].lineData[116] = 0;
  _$jscoverage['/lang/array.js'].lineData[118] = 0;
  _$jscoverage['/lang/array.js'].lineData[122] = 0;
  _$jscoverage['/lang/array.js'].lineData[123] = 0;
  _$jscoverage['/lang/array.js'].lineData[124] = 0;
  _$jscoverage['/lang/array.js'].lineData[125] = 0;
  _$jscoverage['/lang/array.js'].lineData[127] = 0;
  _$jscoverage['/lang/array.js'].lineData[130] = 0;
  _$jscoverage['/lang/array.js'].lineData[131] = 0;
  _$jscoverage['/lang/array.js'].lineData[133] = 0;
  _$jscoverage['/lang/array.js'].lineData[144] = 0;
  _$jscoverage['/lang/array.js'].lineData[161] = 0;
  _$jscoverage['/lang/array.js'].lineData[164] = 0;
  _$jscoverage['/lang/array.js'].lineData[165] = 0;
  _$jscoverage['/lang/array.js'].lineData[166] = 0;
  _$jscoverage['/lang/array.js'].lineData[167] = 0;
  _$jscoverage['/lang/array.js'].lineData[170] = 0;
  _$jscoverage['/lang/array.js'].lineData[188] = 0;
  _$jscoverage['/lang/array.js'].lineData[191] = 0;
  _$jscoverage['/lang/array.js'].lineData[193] = 0;
  _$jscoverage['/lang/array.js'].lineData[194] = 0;
  _$jscoverage['/lang/array.js'].lineData[195] = 0;
  _$jscoverage['/lang/array.js'].lineData[199] = 0;
  _$jscoverage['/lang/array.js'].lineData[202] = 0;
  _$jscoverage['/lang/array.js'].lineData[223] = 0;
  _$jscoverage['/lang/array.js'].lineData[224] = 0;
  _$jscoverage['/lang/array.js'].lineData[225] = 0;
  _$jscoverage['/lang/array.js'].lineData[229] = 0;
  _$jscoverage['/lang/array.js'].lineData[230] = 0;
  _$jscoverage['/lang/array.js'].lineData[233] = 0;
  _$jscoverage['/lang/array.js'].lineData[234] = 0;
  _$jscoverage['/lang/array.js'].lineData[235] = 0;
  _$jscoverage['/lang/array.js'].lineData[236] = 0;
  _$jscoverage['/lang/array.js'].lineData[239] = 0;
  _$jscoverage['/lang/array.js'].lineData[240] = 0;
  _$jscoverage['/lang/array.js'].lineData[241] = 0;
  _$jscoverage['/lang/array.js'].lineData[242] = 0;
  _$jscoverage['/lang/array.js'].lineData[246] = 0;
  _$jscoverage['/lang/array.js'].lineData[247] = 0;
  _$jscoverage['/lang/array.js'].lineData[248] = 0;
  _$jscoverage['/lang/array.js'].lineData[254] = 0;
  _$jscoverage['/lang/array.js'].lineData[255] = 0;
  _$jscoverage['/lang/array.js'].lineData[256] = 0;
  _$jscoverage['/lang/array.js'].lineData[258] = 0;
  _$jscoverage['/lang/array.js'].lineData[261] = 0;
  _$jscoverage['/lang/array.js'].lineData[275] = 0;
  _$jscoverage['/lang/array.js'].lineData[278] = 0;
  _$jscoverage['/lang/array.js'].lineData[279] = 0;
  _$jscoverage['/lang/array.js'].lineData[280] = 0;
  _$jscoverage['/lang/array.js'].lineData[281] = 0;
  _$jscoverage['/lang/array.js'].lineData[284] = 0;
  _$jscoverage['/lang/array.js'].lineData[298] = 0;
  _$jscoverage['/lang/array.js'].lineData[301] = 0;
  _$jscoverage['/lang/array.js'].lineData[302] = 0;
  _$jscoverage['/lang/array.js'].lineData[303] = 0;
  _$jscoverage['/lang/array.js'].lineData[304] = 0;
  _$jscoverage['/lang/array.js'].lineData[307] = 0;
  _$jscoverage['/lang/array.js'].lineData[316] = 0;
  _$jscoverage['/lang/array.js'].lineData[317] = 0;
  _$jscoverage['/lang/array.js'].lineData[319] = 0;
  _$jscoverage['/lang/array.js'].lineData[320] = 0;
  _$jscoverage['/lang/array.js'].lineData[322] = 0;
  _$jscoverage['/lang/array.js'].lineData[325] = 0;
  _$jscoverage['/lang/array.js'].lineData[334] = 0;
  _$jscoverage['/lang/array.js'].lineData[336] = 0;
  _$jscoverage['/lang/array.js'].lineData[337] = 0;
  _$jscoverage['/lang/array.js'].lineData[338] = 0;
  _$jscoverage['/lang/array.js'].lineData[340] = 0;
}
if (! _$jscoverage['/lang/array.js'].functionData) {
  _$jscoverage['/lang/array.js'].functionData = [];
  _$jscoverage['/lang/array.js'].functionData[0] = 0;
  _$jscoverage['/lang/array.js'].functionData[1] = 0;
  _$jscoverage['/lang/array.js'].functionData[2] = 0;
  _$jscoverage['/lang/array.js'].functionData[3] = 0;
  _$jscoverage['/lang/array.js'].functionData[4] = 0;
  _$jscoverage['/lang/array.js'].functionData[5] = 0;
  _$jscoverage['/lang/array.js'].functionData[6] = 0;
  _$jscoverage['/lang/array.js'].functionData[7] = 0;
  _$jscoverage['/lang/array.js'].functionData[8] = 0;
  _$jscoverage['/lang/array.js'].functionData[9] = 0;
  _$jscoverage['/lang/array.js'].functionData[10] = 0;
  _$jscoverage['/lang/array.js'].functionData[11] = 0;
  _$jscoverage['/lang/array.js'].functionData[12] = 0;
  _$jscoverage['/lang/array.js'].functionData[13] = 0;
  _$jscoverage['/lang/array.js'].functionData[14] = 0;
  _$jscoverage['/lang/array.js'].functionData[15] = 0;
  _$jscoverage['/lang/array.js'].functionData[16] = 0;
  _$jscoverage['/lang/array.js'].functionData[17] = 0;
  _$jscoverage['/lang/array.js'].functionData[18] = 0;
}
if (! _$jscoverage['/lang/array.js'].branchData) {
  _$jscoverage['/lang/array.js'].branchData = {};
  _$jscoverage['/lang/array.js'].branchData['29'] = [];
  _$jscoverage['/lang/array.js'].branchData['29'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['34'] = [];
  _$jscoverage['/lang/array.js'].branchData['34'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['36'] = [];
  _$jscoverage['/lang/array.js'].branchData['36'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['36'][2] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['36'][3] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['38'] = [];
  _$jscoverage['/lang/array.js'].branchData['38'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['40'] = [];
  _$jscoverage['/lang/array.js'].branchData['40'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['42'] = [];
  _$jscoverage['/lang/array.js'].branchData['42'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['45'] = [];
  _$jscoverage['/lang/array.js'].branchData['45'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['51'] = [];
  _$jscoverage['/lang/array.js'].branchData['51'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['52'] = [];
  _$jscoverage['/lang/array.js'].branchData['52'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['74'] = [];
  _$jscoverage['/lang/array.js'].branchData['74'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['75'] = [];
  _$jscoverage['/lang/array.js'].branchData['75'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['97'] = [];
  _$jscoverage['/lang/array.js'].branchData['97'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['98'] = [];
  _$jscoverage['/lang/array.js'].branchData['98'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['115'] = [];
  _$jscoverage['/lang/array.js'].branchData['115'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['122'] = [];
  _$jscoverage['/lang/array.js'].branchData['122'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['124'] = [];
  _$jscoverage['/lang/array.js'].branchData['124'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['130'] = [];
  _$jscoverage['/lang/array.js'].branchData['130'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['144'] = [];
  _$jscoverage['/lang/array.js'].branchData['144'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['161'] = [];
  _$jscoverage['/lang/array.js'].branchData['161'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['166'] = [];
  _$jscoverage['/lang/array.js'].branchData['166'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['166'][2] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['188'] = [];
  _$jscoverage['/lang/array.js'].branchData['188'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['193'] = [];
  _$jscoverage['/lang/array.js'].branchData['193'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['194'] = [];
  _$jscoverage['/lang/array.js'].branchData['194'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['195'] = [];
  _$jscoverage['/lang/array.js'].branchData['195'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['199'] = [];
  _$jscoverage['/lang/array.js'].branchData['199'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['224'] = [];
  _$jscoverage['/lang/array.js'].branchData['224'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['229'] = [];
  _$jscoverage['/lang/array.js'].branchData['229'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['229'][2] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['229'][3] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['235'] = [];
  _$jscoverage['/lang/array.js'].branchData['235'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['240'] = [];
  _$jscoverage['/lang/array.js'].branchData['240'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['247'] = [];
  _$jscoverage['/lang/array.js'].branchData['247'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['254'] = [];
  _$jscoverage['/lang/array.js'].branchData['254'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['255'] = [];
  _$jscoverage['/lang/array.js'].branchData['255'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['275'] = [];
  _$jscoverage['/lang/array.js'].branchData['275'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['278'] = [];
  _$jscoverage['/lang/array.js'].branchData['278'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['278'][2] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['279'] = [];
  _$jscoverage['/lang/array.js'].branchData['279'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['280'] = [];
  _$jscoverage['/lang/array.js'].branchData['280'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['298'] = [];
  _$jscoverage['/lang/array.js'].branchData['298'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['301'] = [];
  _$jscoverage['/lang/array.js'].branchData['301'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['301'][2] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['302'] = [];
  _$jscoverage['/lang/array.js'].branchData['302'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['303'] = [];
  _$jscoverage['/lang/array.js'].branchData['303'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['316'] = [];
  _$jscoverage['/lang/array.js'].branchData['316'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['319'] = [];
  _$jscoverage['/lang/array.js'].branchData['319'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['325'] = [];
  _$jscoverage['/lang/array.js'].branchData['325'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['325'][2] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['330'] = [];
  _$jscoverage['/lang/array.js'].branchData['330'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['331'] = [];
  _$jscoverage['/lang/array.js'].branchData['331'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['331'][2] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['333'] = [];
  _$jscoverage['/lang/array.js'].branchData['333'][1] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['333'][2] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['333'][3] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['333'][4] = new BranchData();
  _$jscoverage['/lang/array.js'].branchData['337'] = [];
  _$jscoverage['/lang/array.js'].branchData['337'][1] = new BranchData();
}
_$jscoverage['/lang/array.js'].branchData['337'][1].init(830, 5, 'i < l');
function visit123_337_1(result) {
  _$jscoverage['/lang/array.js'].branchData['337'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['333'][4].init(147, 22, 'lengthType == \'number\'');
function visit122_333_4(result) {
  _$jscoverage['/lang/array.js'].branchData['333'][4].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['333'][3].init(132, 37, '\'item\' in o && lengthType == \'number\'');
function visit121_333_3(result) {
  _$jscoverage['/lang/array.js'].branchData['333'][3].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['333'][2].init(106, 19, 'oType == \'function\'');
function visit120_333_2(result) {
  _$jscoverage['/lang/array.js'].branchData['333'][2].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['333'][1].init(106, 64, 'oType == \'function\' && !(\'item\' in o && lengthType == \'number\')');
function visit119_333_1(result) {
  _$jscoverage['/lang/array.js'].branchData['333'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['331'][2].init(543, 17, 'oType == \'string\'');
function visit118_331_2(result) {
  _$jscoverage['/lang/array.js'].branchData['331'][2].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['331'][1].init(27, 172, 'oType == \'string\' || (oType == \'function\' && !(\'item\' in o && lengthType == \'number\'))');
function visit117_331_1(result) {
  _$jscoverage['/lang/array.js'].branchData['331'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['330'][1].init(202, 200, 'o.alert || oType == \'string\' || (oType == \'function\' && !(\'item\' in o && lengthType == \'number\'))');
function visit116_330_1(result) {
  _$jscoverage['/lang/array.js'].branchData['330'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['325'][2].init(309, 22, 'lengthType != \'number\'');
function visit115_325_2(result) {
  _$jscoverage['/lang/array.js'].branchData['325'][2].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['325'][1].init(309, 403, 'lengthType != \'number\' || o.alert || oType == \'string\' || (oType == \'function\' && !(\'item\' in o && lengthType == \'number\'))');
function visit114_325_1(result) {
  _$jscoverage['/lang/array.js'].branchData['325'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['319'][1].init(91, 12, 'S.isArray(o)');
function visit113_319_1(result) {
  _$jscoverage['/lang/array.js'].branchData['319'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['316'][1].init(18, 9, 'o == null');
function visit112_316_1(result) {
  _$jscoverage['/lang/array.js'].branchData['316'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['303'][1].init(26, 44, 'i in arr && fn.call(context, arr[i], i, arr)');
function visit111_303_1(result) {
  _$jscoverage['/lang/array.js'].branchData['303'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['302'][1].init(85, 7, 'i < len');
function visit110_302_1(result) {
  _$jscoverage['/lang/array.js'].branchData['302'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['301'][2].init(28, 17, 'arr && arr.length');
function visit109_301_2(result) {
  _$jscoverage['/lang/array.js'].branchData['301'][2].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['301'][1].init(28, 22, 'arr && arr.length || 0');
function visit108_301_1(result) {
  _$jscoverage['/lang/array.js'].branchData['301'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['298'][1].init(44, 15, 'context || this');
function visit107_298_1(result) {
  _$jscoverage['/lang/array.js'].branchData['298'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['280'][1].init(26, 45, 'i in arr && !fn.call(context, arr[i], i, arr)');
function visit106_280_1(result) {
  _$jscoverage['/lang/array.js'].branchData['280'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['279'][1].init(85, 7, 'i < len');
function visit105_279_1(result) {
  _$jscoverage['/lang/array.js'].branchData['279'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['278'][2].init(28, 17, 'arr && arr.length');
function visit104_278_2(result) {
  _$jscoverage['/lang/array.js'].branchData['278'][2].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['278'][1].init(28, 22, 'arr && arr.length || 0');
function visit103_278_1(result) {
  _$jscoverage['/lang/array.js'].branchData['278'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['275'][1].init(45, 15, 'context || this');
function visit102_275_1(result) {
  _$jscoverage['/lang/array.js'].branchData['275'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['255'][1].init(22, 8, 'k in arr');
function visit101_255_1(result) {
  _$jscoverage['/lang/array.js'].branchData['255'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['254'][1].init(1021, 7, 'k < len');
function visit100_254_1(result) {
  _$jscoverage['/lang/array.js'].branchData['254'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['247'][1].init(278, 8, 'k >= len');
function visit99_247_1(result) {
  _$jscoverage['/lang/array.js'].branchData['247'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['240'][1].init(26, 8, 'k in arr');
function visit98_240_1(result) {
  _$jscoverage['/lang/array.js'].branchData['240'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['235'][1].init(447, 21, 'arguments.length >= 3');
function visit97_235_1(result) {
  _$jscoverage['/lang/array.js'].branchData['235'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['229'][3].init(275, 21, 'arguments.length == 2');
function visit96_229_3(result) {
  _$jscoverage['/lang/array.js'].branchData['229'][3].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['229'][2].init(262, 9, 'len === 0');
function visit95_229_2(result) {
  _$jscoverage['/lang/array.js'].branchData['229'][2].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['229'][1].init(262, 34, 'len === 0 && arguments.length == 2');
function visit94_229_1(result) {
  _$jscoverage['/lang/array.js'].branchData['229'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['224'][1].init(53, 30, 'typeof callback !== \'function\'');
function visit93_224_1(result) {
  _$jscoverage['/lang/array.js'].branchData['224'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['199'][1].init(43, 15, 'context || this');
function visit92_199_1(result) {
  _$jscoverage['/lang/array.js'].branchData['199'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['195'][1].init(105, 133, 'el || i in arr');
function visit91_195_1(result) {
  _$jscoverage['/lang/array.js'].branchData['195'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['194'][1].init(31, 22, 'typeof arr == \'string\'');
function visit90_194_1(result) {
  _$jscoverage['/lang/array.js'].branchData['194'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['193'][1].init(116, 7, 'i < len');
function visit89_193_1(result) {
  _$jscoverage['/lang/array.js'].branchData['193'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['188'][1].init(43, 15, 'context || this');
function visit88_188_1(result) {
  _$jscoverage['/lang/array.js'].branchData['188'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['166'][2].init(34, 15, 'context || this');
function visit87_166_2(result) {
  _$jscoverage['/lang/array.js'].branchData['166'][2].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['166'][1].init(26, 38, 'fn.call(context || this, item, i, arr)');
function visit86_166_1(result) {
  _$jscoverage['/lang/array.js'].branchData['166'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['161'][1].init(46, 15, 'context || this');
function visit85_161_1(result) {
  _$jscoverage['/lang/array.js'].branchData['161'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['144'][1].init(21, 25, 'S.indexOf(item, arr) > -1');
function visit84_144_1(result) {
  _$jscoverage['/lang/array.js'].branchData['144'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['130'][1].init(419, 8, 'override');
function visit83_130_1(result) {
  _$jscoverage['/lang/array.js'].branchData['130'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['124'][1].init(56, 33, '(n = S.lastIndexOf(item, b)) !== i');
function visit82_124_1(result) {
  _$jscoverage['/lang/array.js'].branchData['124'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['122'][1].init(196, 12, 'i < b.length');
function visit81_122_1(result) {
  _$jscoverage['/lang/array.js'].branchData['122'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['115'][1].init(50, 8, 'override');
function visit80_115_1(result) {
  _$jscoverage['/lang/array.js'].branchData['115'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['98'][1].init(26, 15, 'arr[i] === item');
function visit79_98_1(result) {
  _$jscoverage['/lang/array.js'].branchData['98'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['97'][1].init(47, 6, 'i >= 0');
function visit78_97_1(result) {
  _$jscoverage['/lang/array.js'].branchData['97'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['75'][1].init(26, 15, 'arr[i] === item');
function visit77_75_1(result) {
  _$jscoverage['/lang/array.js'].branchData['75'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['74'][1].init(52, 7, 'i < len');
function visit76_74_1(result) {
  _$jscoverage['/lang/array.js'].branchData['74'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['52'][1].init(30, 42, 'fn.call(context, val, i, object) === FALSE');
function visit75_52_1(result) {
  _$jscoverage['/lang/array.js'].branchData['52'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['51'][1].init(47, 10, 'i < length');
function visit74_51_1(result) {
  _$jscoverage['/lang/array.js'].branchData['51'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['45'][1].init(125, 52, 'fn.call(context, object[key], key, object) === FALSE');
function visit73_45_1(result) {
  _$jscoverage['/lang/array.js'].branchData['45'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['42'][1].init(73, 15, 'i < keys.length');
function visit72_42_1(result) {
  _$jscoverage['/lang/array.js'].branchData['42'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['40'][1].init(389, 5, 'isObj');
function visit71_40_1(result) {
  _$jscoverage['/lang/array.js'].branchData['40'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['38'][1].init(349, 15, 'context || null');
function visit70_38_1(result) {
  _$jscoverage['/lang/array.js'].branchData['38'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['36'][3].init(271, 28, 'S.type(object) == \'function\'');
function visit69_36_3(result) {
  _$jscoverage['/lang/array.js'].branchData['36'][3].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['36'][2].init(247, 20, 'length === undefined');
function visit68_36_2(result) {
  _$jscoverage['/lang/array.js'].branchData['36'][2].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['36'][1].init(247, 52, 'length === undefined || S.type(object) == \'function\'');
function visit67_36_1(result) {
  _$jscoverage['/lang/array.js'].branchData['36'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['34'][1].init(119, 23, 'object && object.length');
function visit66_34_1(result) {
  _$jscoverage['/lang/array.js'].branchData['34'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].branchData['29'][1].init(18, 6, 'object');
function visit65_29_1(result) {
  _$jscoverage['/lang/array.js'].branchData['29'][1].ranCondition(result);
  return result;
}_$jscoverage['/lang/array.js'].lineData[7]++;
(function(S, undefined) {
  _$jscoverage['/lang/array.js'].functionData[0]++;
  _$jscoverage['/lang/array.js'].lineData[9]++;
  var TRUE = true, AP = Array.prototype, indexOf = AP.indexOf, lastIndexOf = AP.lastIndexOf, filter = AP.filter, every = AP.every, some = AP.some, map = AP.map, FALSE = false;
  _$jscoverage['/lang/array.js'].lineData[19]++;
  S.mix(S, {
  each: function(object, fn, context) {
  _$jscoverage['/lang/array.js'].functionData[1]++;
  _$jscoverage['/lang/array.js'].lineData[29]++;
  if (visit65_29_1(object)) {
    _$jscoverage['/lang/array.js'].lineData[30]++;
    var key, val, keys, i = 0, length = visit66_34_1(object && object.length), isObj = visit67_36_1(visit68_36_2(length === undefined) || visit69_36_3(S.type(object) == 'function'));
    _$jscoverage['/lang/array.js'].lineData[38]++;
    context = visit70_38_1(context || null);
    _$jscoverage['/lang/array.js'].lineData[40]++;
    if (visit71_40_1(isObj)) {
      _$jscoverage['/lang/array.js'].lineData[41]++;
      keys = S.keys(object);
      _$jscoverage['/lang/array.js'].lineData[42]++;
      for (; visit72_42_1(i < keys.length); i++) {
        _$jscoverage['/lang/array.js'].lineData[43]++;
        key = keys[i];
        _$jscoverage['/lang/array.js'].lineData[45]++;
        if (visit73_45_1(fn.call(context, object[key], key, object) === FALSE)) {
          _$jscoverage['/lang/array.js'].lineData[46]++;
          break;
        }
      }
    } else {
      _$jscoverage['/lang/array.js'].lineData[50]++;
      for (val = object[0]; visit74_51_1(i < length); val = object[++i]) {
        _$jscoverage['/lang/array.js'].lineData[52]++;
        if (visit75_52_1(fn.call(context, val, i, object) === FALSE)) {
          _$jscoverage['/lang/array.js'].lineData[53]++;
          break;
        }
      }
    }
  }
  _$jscoverage['/lang/array.js'].lineData[58]++;
  return object;
}, 
  indexOf: indexOf ? function(item, arr) {
  _$jscoverage['/lang/array.js'].functionData[2]++;
  _$jscoverage['/lang/array.js'].lineData[71]++;
  return indexOf.call(arr, item);
} : function(item, arr) {
  _$jscoverage['/lang/array.js'].functionData[3]++;
  _$jscoverage['/lang/array.js'].lineData[74]++;
  for (var i = 0, len = arr.length; visit76_74_1(i < len); ++i) {
    _$jscoverage['/lang/array.js'].lineData[75]++;
    if (visit77_75_1(arr[i] === item)) {
      _$jscoverage['/lang/array.js'].lineData[76]++;
      return i;
    }
  }
  _$jscoverage['/lang/array.js'].lineData[79]++;
  return -1;
}, 
  lastIndexOf: (lastIndexOf) ? function(item, arr) {
  _$jscoverage['/lang/array.js'].functionData[4]++;
  _$jscoverage['/lang/array.js'].lineData[94]++;
  return lastIndexOf.call(arr, item);
} : function(item, arr) {
  _$jscoverage['/lang/array.js'].functionData[5]++;
  _$jscoverage['/lang/array.js'].lineData[97]++;
  for (var i = arr.length - 1; visit78_97_1(i >= 0); i--) {
    _$jscoverage['/lang/array.js'].lineData[98]++;
    if (visit79_98_1(arr[i] === item)) {
      _$jscoverage['/lang/array.js'].lineData[99]++;
      break;
    }
  }
  _$jscoverage['/lang/array.js'].lineData[102]++;
  return i;
}, 
  unique: function(a, override) {
  _$jscoverage['/lang/array.js'].functionData[6]++;
  _$jscoverage['/lang/array.js'].lineData[114]++;
  var b = a.slice();
  _$jscoverage['/lang/array.js'].lineData[115]++;
  if (visit80_115_1(override)) {
    _$jscoverage['/lang/array.js'].lineData[116]++;
    b.reverse();
  }
  _$jscoverage['/lang/array.js'].lineData[118]++;
  var i = 0, n, item;
  _$jscoverage['/lang/array.js'].lineData[122]++;
  while (visit81_122_1(i < b.length)) {
    _$jscoverage['/lang/array.js'].lineData[123]++;
    item = b[i];
    _$jscoverage['/lang/array.js'].lineData[124]++;
    while (visit82_124_1((n = S.lastIndexOf(item, b)) !== i)) {
      _$jscoverage['/lang/array.js'].lineData[125]++;
      b.splice(n, 1);
    }
    _$jscoverage['/lang/array.js'].lineData[127]++;
    i += 1;
  }
  _$jscoverage['/lang/array.js'].lineData[130]++;
  if (visit83_130_1(override)) {
    _$jscoverage['/lang/array.js'].lineData[131]++;
    b.reverse();
  }
  _$jscoverage['/lang/array.js'].lineData[133]++;
  return b;
}, 
  inArray: function(item, arr) {
  _$jscoverage['/lang/array.js'].functionData[7]++;
  _$jscoverage['/lang/array.js'].lineData[144]++;
  return visit84_144_1(S.indexOf(item, arr) > -1);
}, 
  filter: filter ? function(arr, fn, context) {
  _$jscoverage['/lang/array.js'].functionData[8]++;
  _$jscoverage['/lang/array.js'].lineData[161]++;
  return filter.call(arr, fn, visit85_161_1(context || this));
} : function(arr, fn, context) {
  _$jscoverage['/lang/array.js'].functionData[9]++;
  _$jscoverage['/lang/array.js'].lineData[164]++;
  var ret = [];
  _$jscoverage['/lang/array.js'].lineData[165]++;
  S.each(arr, function(item, i, arr) {
  _$jscoverage['/lang/array.js'].functionData[10]++;
  _$jscoverage['/lang/array.js'].lineData[166]++;
  if (visit86_166_1(fn.call(visit87_166_2(context || this), item, i, arr))) {
    _$jscoverage['/lang/array.js'].lineData[167]++;
    ret.push(item);
  }
});
  _$jscoverage['/lang/array.js'].lineData[170]++;
  return ret;
}, 
  map: map ? function(arr, fn, context) {
  _$jscoverage['/lang/array.js'].functionData[11]++;
  _$jscoverage['/lang/array.js'].lineData[188]++;
  return map.call(arr, fn, visit88_188_1(context || this));
} : function(arr, fn, context) {
  _$jscoverage['/lang/array.js'].functionData[12]++;
  _$jscoverage['/lang/array.js'].lineData[191]++;
  var len = arr.length, res = new Array(len);
  _$jscoverage['/lang/array.js'].lineData[193]++;
  for (var i = 0; visit89_193_1(i < len); i++) {
    _$jscoverage['/lang/array.js'].lineData[194]++;
    var el = visit90_194_1(typeof arr == 'string') ? arr.charAt(i) : arr[i];
    _$jscoverage['/lang/array.js'].lineData[195]++;
    if (visit91_195_1(el || i in arr)) {
      _$jscoverage['/lang/array.js'].lineData[199]++;
      res[i] = fn.call(visit92_199_1(context || this), el, i, arr);
    }
  }
  _$jscoverage['/lang/array.js'].lineData[202]++;
  return res;
}, 
  reduce: function(arr, callback, initialValue) {
  _$jscoverage['/lang/array.js'].functionData[13]++;
  _$jscoverage['/lang/array.js'].lineData[223]++;
  var len = arr.length;
  _$jscoverage['/lang/array.js'].lineData[224]++;
  if (visit93_224_1(typeof callback !== 'function')) {
    _$jscoverage['/lang/array.js'].lineData[225]++;
    throw new TypeError('callback is not function!');
  }
  _$jscoverage['/lang/array.js'].lineData[229]++;
  if (visit94_229_1(visit95_229_2(len === 0) && visit96_229_3(arguments.length == 2))) {
    _$jscoverage['/lang/array.js'].lineData[230]++;
    throw new TypeError('arguments invalid');
  }
  _$jscoverage['/lang/array.js'].lineData[233]++;
  var k = 0;
  _$jscoverage['/lang/array.js'].lineData[234]++;
  var accumulator;
  _$jscoverage['/lang/array.js'].lineData[235]++;
  if (visit97_235_1(arguments.length >= 3)) {
    _$jscoverage['/lang/array.js'].lineData[236]++;
    accumulator = arguments[2];
  } else {
    _$jscoverage['/lang/array.js'].lineData[239]++;
    do {
      _$jscoverage['/lang/array.js'].lineData[240]++;
      if (visit98_240_1(k in arr)) {
        _$jscoverage['/lang/array.js'].lineData[241]++;
        accumulator = arr[k++];
        _$jscoverage['/lang/array.js'].lineData[242]++;
        break;
      }
      _$jscoverage['/lang/array.js'].lineData[246]++;
      k += 1;
      _$jscoverage['/lang/array.js'].lineData[247]++;
      if (visit99_247_1(k >= len)) {
        _$jscoverage['/lang/array.js'].lineData[248]++;
        throw new TypeError();
      }
    } while (TRUE);
  }
  _$jscoverage['/lang/array.js'].lineData[254]++;
  while (visit100_254_1(k < len)) {
    _$jscoverage['/lang/array.js'].lineData[255]++;
    if (visit101_255_1(k in arr)) {
      _$jscoverage['/lang/array.js'].lineData[256]++;
      accumulator = callback.call(undefined, accumulator, arr[k], k, arr);
    }
    _$jscoverage['/lang/array.js'].lineData[258]++;
    k++;
  }
  _$jscoverage['/lang/array.js'].lineData[261]++;
  return accumulator;
}, 
  every: every ? function(arr, fn, context) {
  _$jscoverage['/lang/array.js'].functionData[14]++;
  _$jscoverage['/lang/array.js'].lineData[275]++;
  return every.call(arr, fn, visit102_275_1(context || this));
} : function(arr, fn, context) {
  _$jscoverage['/lang/array.js'].functionData[15]++;
  _$jscoverage['/lang/array.js'].lineData[278]++;
  var len = visit103_278_1(visit104_278_2(arr && arr.length) || 0);
  _$jscoverage['/lang/array.js'].lineData[279]++;
  for (var i = 0; visit105_279_1(i < len); i++) {
    _$jscoverage['/lang/array.js'].lineData[280]++;
    if (visit106_280_1(i in arr && !fn.call(context, arr[i], i, arr))) {
      _$jscoverage['/lang/array.js'].lineData[281]++;
      return FALSE;
    }
  }
  _$jscoverage['/lang/array.js'].lineData[284]++;
  return TRUE;
}, 
  some: some ? function(arr, fn, context) {
  _$jscoverage['/lang/array.js'].functionData[16]++;
  _$jscoverage['/lang/array.js'].lineData[298]++;
  return some.call(arr, fn, visit107_298_1(context || this));
} : function(arr, fn, context) {
  _$jscoverage['/lang/array.js'].functionData[17]++;
  _$jscoverage['/lang/array.js'].lineData[301]++;
  var len = visit108_301_1(visit109_301_2(arr && arr.length) || 0);
  _$jscoverage['/lang/array.js'].lineData[302]++;
  for (var i = 0; visit110_302_1(i < len); i++) {
    _$jscoverage['/lang/array.js'].lineData[303]++;
    if (visit111_303_1(i in arr && fn.call(context, arr[i], i, arr))) {
      _$jscoverage['/lang/array.js'].lineData[304]++;
      return TRUE;
    }
  }
  _$jscoverage['/lang/array.js'].lineData[307]++;
  return FALSE;
}, 
  makeArray: function(o) {
  _$jscoverage['/lang/array.js'].functionData[18]++;
  _$jscoverage['/lang/array.js'].lineData[316]++;
  if (visit112_316_1(o == null)) {
    _$jscoverage['/lang/array.js'].lineData[317]++;
    return [];
  }
  _$jscoverage['/lang/array.js'].lineData[319]++;
  if (visit113_319_1(S.isArray(o))) {
    _$jscoverage['/lang/array.js'].lineData[320]++;
    return o;
  }
  _$jscoverage['/lang/array.js'].lineData[322]++;
  var lengthType = typeof o.length, oType = typeof o;
  _$jscoverage['/lang/array.js'].lineData[325]++;
  if (visit114_325_1(visit115_325_2(lengthType != 'number') || visit116_330_1(o.alert || visit117_331_1(visit118_331_2(oType == 'string') || (visit119_333_1(visit120_333_2(oType == 'function') && !(visit121_333_3('item' in o && visit122_333_4(lengthType == 'number'))))))))) {
    _$jscoverage['/lang/array.js'].lineData[334]++;
    return [o];
  }
  _$jscoverage['/lang/array.js'].lineData[336]++;
  var ret = [];
  _$jscoverage['/lang/array.js'].lineData[337]++;
  for (var i = 0, l = o.length; visit123_337_1(i < l); i++) {
    _$jscoverage['/lang/array.js'].lineData[338]++;
    ret[i] = o[i];
  }
  _$jscoverage['/lang/array.js'].lineData[340]++;
  return ret;
}});
})(KISSY);

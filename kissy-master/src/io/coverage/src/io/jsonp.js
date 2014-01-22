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
if (! _$jscoverage['/io/jsonp.js']) {
  _$jscoverage['/io/jsonp.js'] = {};
  _$jscoverage['/io/jsonp.js'].lineData = [];
  _$jscoverage['/io/jsonp.js'].lineData[6] = 0;
  _$jscoverage['/io/jsonp.js'].lineData[7] = 0;
  _$jscoverage['/io/jsonp.js'].lineData[8] = 0;
  _$jscoverage['/io/jsonp.js'].lineData[12] = 0;
  _$jscoverage['/io/jsonp.js'].lineData[15] = 0;
  _$jscoverage['/io/jsonp.js'].lineData[16] = 0;
  _$jscoverage['/io/jsonp.js'].lineData[19] = 0;
  _$jscoverage['/io/jsonp.js'].lineData[22] = 0;
  _$jscoverage['/io/jsonp.js'].lineData[23] = 0;
  _$jscoverage['/io/jsonp.js'].lineData[31] = 0;
  _$jscoverage['/io/jsonp.js'].lineData[34] = 0;
  _$jscoverage['/io/jsonp.js'].lineData[37] = 0;
  _$jscoverage['/io/jsonp.js'].lineData[38] = 0;
  _$jscoverage['/io/jsonp.js'].lineData[41] = 0;
  _$jscoverage['/io/jsonp.js'].lineData[45] = 0;
  _$jscoverage['/io/jsonp.js'].lineData[46] = 0;
  _$jscoverage['/io/jsonp.js'].lineData[47] = 0;
  _$jscoverage['/io/jsonp.js'].lineData[48] = 0;
  _$jscoverage['/io/jsonp.js'].lineData[49] = 0;
  _$jscoverage['/io/jsonp.js'].lineData[52] = 0;
  _$jscoverage['/io/jsonp.js'].lineData[55] = 0;
  _$jscoverage['/io/jsonp.js'].lineData[59] = 0;
  _$jscoverage['/io/jsonp.js'].lineData[60] = 0;
  _$jscoverage['/io/jsonp.js'].lineData[68] = 0;
  _$jscoverage['/io/jsonp.js'].lineData[69] = 0;
  _$jscoverage['/io/jsonp.js'].lineData[70] = 0;
  _$jscoverage['/io/jsonp.js'].lineData[72] = 0;
  _$jscoverage['/io/jsonp.js'].lineData[75] = 0;
  _$jscoverage['/io/jsonp.js'].lineData[77] = 0;
  _$jscoverage['/io/jsonp.js'].lineData[78] = 0;
  _$jscoverage['/io/jsonp.js'].lineData[82] = 0;
}
if (! _$jscoverage['/io/jsonp.js'].functionData) {
  _$jscoverage['/io/jsonp.js'].functionData = [];
  _$jscoverage['/io/jsonp.js'].functionData[0] = 0;
  _$jscoverage['/io/jsonp.js'].functionData[1] = 0;
  _$jscoverage['/io/jsonp.js'].functionData[2] = 0;
  _$jscoverage['/io/jsonp.js'].functionData[3] = 0;
  _$jscoverage['/io/jsonp.js'].functionData[4] = 0;
  _$jscoverage['/io/jsonp.js'].functionData[5] = 0;
}
if (! _$jscoverage['/io/jsonp.js'].branchData) {
  _$jscoverage['/io/jsonp.js'].branchData = {};
  _$jscoverage['/io/jsonp.js'].branchData['19'] = [];
  _$jscoverage['/io/jsonp.js'].branchData['19'][1] = new BranchData();
  _$jscoverage['/io/jsonp.js'].branchData['26'] = [];
  _$jscoverage['/io/jsonp.js'].branchData['26'][1] = new BranchData();
  _$jscoverage['/io/jsonp.js'].branchData['37'] = [];
  _$jscoverage['/io/jsonp.js'].branchData['37'][1] = new BranchData();
  _$jscoverage['/io/jsonp.js'].branchData['47'] = [];
  _$jscoverage['/io/jsonp.js'].branchData['47'][1] = new BranchData();
  _$jscoverage['/io/jsonp.js'].branchData['52'] = [];
  _$jscoverage['/io/jsonp.js'].branchData['52'][1] = new BranchData();
  _$jscoverage['/io/jsonp.js'].branchData['60'] = [];
  _$jscoverage['/io/jsonp.js'].branchData['60'][1] = new BranchData();
  _$jscoverage['/io/jsonp.js'].branchData['69'] = [];
  _$jscoverage['/io/jsonp.js'].branchData['69'][1] = new BranchData();
}
_$jscoverage['/io/jsonp.js'].branchData['69'][1].init(22, 9, '!response');
function visit70_69_1(result) {
  _$jscoverage['/io/jsonp.js'].branchData['69'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/jsonp.js'].branchData['60'][1].init(1551, 23, 'converters.script || {}');
function visit69_60_1(result) {
  _$jscoverage['/io/jsonp.js'].branchData['60'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/jsonp.js'].branchData['52'][1].init(266, 8, 'response');
function visit68_52_1(result) {
  _$jscoverage['/io/jsonp.js'].branchData['52'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/jsonp.js'].branchData['47'][1].init(72, 22, 'previous === undefined');
function visit67_47_1(result) {
  _$jscoverage['/io/jsonp.js'].branchData['47'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/jsonp.js'].branchData['37'][1].init(122, 20, 'arguments.length > 1');
function visit66_37_1(result) {
  _$jscoverage['/io/jsonp.js'].branchData['37'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/jsonp.js'].branchData['26'][1].init(126, 36, 'typeof cJsonpCallback === \'function\'');
function visit65_26_1(result) {
  _$jscoverage['/io/jsonp.js'].branchData['26'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/jsonp.js'].branchData['19'][1].init(102, 22, 'dataType[0] == \'jsonp\'');
function visit64_19_1(result) {
  _$jscoverage['/io/jsonp.js'].branchData['19'][1].ranCondition(result);
  return result;
}_$jscoverage['/io/jsonp.js'].lineData[6]++;
KISSY.add('io/jsonp', function(S, IO) {
  _$jscoverage['/io/jsonp.js'].functionData[0]++;
  _$jscoverage['/io/jsonp.js'].lineData[7]++;
  var win = S.Env.host;
  _$jscoverage['/io/jsonp.js'].lineData[8]++;
  IO.setupConfig({
  jsonp: 'callback', 
  jsonpCallback: function() {
  _$jscoverage['/io/jsonp.js'].functionData[1]++;
  _$jscoverage['/io/jsonp.js'].lineData[12]++;
  return S.guid('jsonp');
}});
  _$jscoverage['/io/jsonp.js'].lineData[15]++;
  IO.on('start', function(e) {
  _$jscoverage['/io/jsonp.js'].functionData[2]++;
  _$jscoverage['/io/jsonp.js'].lineData[16]++;
  var io = e.io, c = io.config, dataType = c.dataType;
  _$jscoverage['/io/jsonp.js'].lineData[19]++;
  if (visit64_19_1(dataType[0] == 'jsonp')) {
    _$jscoverage['/io/jsonp.js'].lineData[22]++;
    delete c.contentType;
    _$jscoverage['/io/jsonp.js'].lineData[23]++;
    var response, cJsonpCallback = c.jsonpCallback, converters, jsonpCallback = visit65_26_1(typeof cJsonpCallback === 'function') ? cJsonpCallback() : cJsonpCallback, previous = win[jsonpCallback];
    _$jscoverage['/io/jsonp.js'].lineData[31]++;
    c.uri.query.set(c.jsonp, jsonpCallback);
    _$jscoverage['/io/jsonp.js'].lineData[34]++;
    win[jsonpCallback] = function(r) {
  _$jscoverage['/io/jsonp.js'].functionData[3]++;
  _$jscoverage['/io/jsonp.js'].lineData[37]++;
  if (visit66_37_1(arguments.length > 1)) {
    _$jscoverage['/io/jsonp.js'].lineData[38]++;
    r = S.makeArray(arguments);
  }
  _$jscoverage['/io/jsonp.js'].lineData[41]++;
  response = [r];
};
    _$jscoverage['/io/jsonp.js'].lineData[45]++;
    io.fin(function() {
  _$jscoverage['/io/jsonp.js'].functionData[4]++;
  _$jscoverage['/io/jsonp.js'].lineData[46]++;
  win[jsonpCallback] = previous;
  _$jscoverage['/io/jsonp.js'].lineData[47]++;
  if (visit67_47_1(previous === undefined)) {
    _$jscoverage['/io/jsonp.js'].lineData[48]++;
    try {
      _$jscoverage['/io/jsonp.js'].lineData[49]++;
      delete win[jsonpCallback];
    }    catch (e) {
}
  } else {
    _$jscoverage['/io/jsonp.js'].lineData[52]++;
    if (visit68_52_1(response)) {
      _$jscoverage['/io/jsonp.js'].lineData[55]++;
      previous(response[0]);
    }
  }
});
    _$jscoverage['/io/jsonp.js'].lineData[59]++;
    converters = c.converters;
    _$jscoverage['/io/jsonp.js'].lineData[60]++;
    converters.script = visit69_60_1(converters.script || {});
    _$jscoverage['/io/jsonp.js'].lineData[68]++;
    converters.script.json = function() {
  _$jscoverage['/io/jsonp.js'].functionData[5]++;
  _$jscoverage['/io/jsonp.js'].lineData[69]++;
  if (visit70_69_1(!response)) {
    _$jscoverage['/io/jsonp.js'].lineData[70]++;
    S.error(' not call jsonpCallback: ' + jsonpCallback);
  }
  _$jscoverage['/io/jsonp.js'].lineData[72]++;
  return response[0];
};
    _$jscoverage['/io/jsonp.js'].lineData[75]++;
    dataType.length = 2;
    _$jscoverage['/io/jsonp.js'].lineData[77]++;
    dataType[0] = 'script';
    _$jscoverage['/io/jsonp.js'].lineData[78]++;
    dataType[1] = 'json';
  }
});
  _$jscoverage['/io/jsonp.js'].lineData[82]++;
  return IO;
}, {
  requires: ['./base']});

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
if (! _$jscoverage['/overlay/close-xtpl.js']) {
  _$jscoverage['/overlay/close-xtpl.js'] = {};
  _$jscoverage['/overlay/close-xtpl.js'].lineData = [];
  _$jscoverage['/overlay/close-xtpl.js'].lineData[3] = 0;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[4] = 0;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[5] = 0;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[9] = 0;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[12] = 0;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[13] = 0;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[14] = 0;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[15] = 0;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[16] = 0;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[17] = 0;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[18] = 0;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[19] = 0;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[20] = 0;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[21] = 0;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[22] = 0;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[23] = 0;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[24] = 0;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[25] = 0;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[26] = 0;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[27] = 0;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[28] = 0;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[29] = 0;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[30] = 0;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[31] = 0;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[32] = 0;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[33] = 0;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[34] = 0;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[35] = 0;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[36] = 0;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[37] = 0;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[38] = 0;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[40] = 0;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[41] = 0;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[42] = 0;
}
if (! _$jscoverage['/overlay/close-xtpl.js'].functionData) {
  _$jscoverage['/overlay/close-xtpl.js'].functionData = [];
  _$jscoverage['/overlay/close-xtpl.js'].functionData[0] = 0;
  _$jscoverage['/overlay/close-xtpl.js'].functionData[1] = 0;
  _$jscoverage['/overlay/close-xtpl.js'].functionData[2] = 0;
}
if (! _$jscoverage['/overlay/close-xtpl.js'].branchData) {
  _$jscoverage['/overlay/close-xtpl.js'].branchData = {};
}
_$jscoverage['/overlay/close-xtpl.js'].lineData[3]++;
KISSY.add('overlay/close-xtpl', function() {
  _$jscoverage['/overlay/close-xtpl.js'].functionData[0]++;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[4]++;
  return function(scopes, S, undefined) {
  _$jscoverage['/overlay/close-xtpl.js'].functionData[1]++;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[5]++;
  var buffer = "", config = this.config, engine = this, utils = config.utils;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[9]++;
  var runBlockCommandUtil = utils["runBlockCommand"], getExpressionUtil = utils["getExpression"], getPropertyOrRunCommandUtil = utils["getPropertyOrRunCommand"];
  _$jscoverage['/overlay/close-xtpl.js'].lineData[12]++;
  buffer += '';
  _$jscoverage['/overlay/close-xtpl.js'].lineData[13]++;
  var config0 = {};
  _$jscoverage['/overlay/close-xtpl.js'].lineData[14]++;
  var params1 = [];
  _$jscoverage['/overlay/close-xtpl.js'].lineData[15]++;
  var id2 = getPropertyOrRunCommandUtil(engine, scopes, {}, "closable", 0, 1, undefined, true);
  _$jscoverage['/overlay/close-xtpl.js'].lineData[16]++;
  params1.push(id2);
  _$jscoverage['/overlay/close-xtpl.js'].lineData[17]++;
  config0.params = params1;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[18]++;
  config0.fn = function(scopes) {
  _$jscoverage['/overlay/close-xtpl.js'].functionData[2]++;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[19]++;
  var buffer = "";
  _$jscoverage['/overlay/close-xtpl.js'].lineData[20]++;
  buffer += '\r\n<a href="javascript:void(\'close\')"\r\n   id="ks-overlay-close-';
  _$jscoverage['/overlay/close-xtpl.js'].lineData[21]++;
  var id3 = getPropertyOrRunCommandUtil(engine, scopes, {}, "id", 0, 3, undefined, false);
  _$jscoverage['/overlay/close-xtpl.js'].lineData[22]++;
  buffer += getExpressionUtil(id3, true);
  _$jscoverage['/overlay/close-xtpl.js'].lineData[23]++;
  buffer += '"\r\n   class="';
  _$jscoverage['/overlay/close-xtpl.js'].lineData[24]++;
  var config5 = {};
  _$jscoverage['/overlay/close-xtpl.js'].lineData[25]++;
  var params6 = [];
  _$jscoverage['/overlay/close-xtpl.js'].lineData[26]++;
  params6.push('close');
  _$jscoverage['/overlay/close-xtpl.js'].lineData[27]++;
  config5.params = params6;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[28]++;
  var id4 = getPropertyOrRunCommandUtil(engine, scopes, config5, "getBaseCssClasses", 0, 4, true, undefined);
  _$jscoverage['/overlay/close-xtpl.js'].lineData[29]++;
  buffer += id4;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[30]++;
  buffer += '"\r\n   role=\'button\'>\r\n    <span class="';
  _$jscoverage['/overlay/close-xtpl.js'].lineData[31]++;
  var config8 = {};
  _$jscoverage['/overlay/close-xtpl.js'].lineData[32]++;
  var params9 = [];
  _$jscoverage['/overlay/close-xtpl.js'].lineData[33]++;
  params9.push('close-x');
  _$jscoverage['/overlay/close-xtpl.js'].lineData[34]++;
  config8.params = params9;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[35]++;
  var id7 = getPropertyOrRunCommandUtil(engine, scopes, config8, "getBaseCssClasses", 0, 6, true, undefined);
  _$jscoverage['/overlay/close-xtpl.js'].lineData[36]++;
  buffer += id7;
  _$jscoverage['/overlay/close-xtpl.js'].lineData[37]++;
  buffer += '">close</span>\r\n</a>\r\n';
  _$jscoverage['/overlay/close-xtpl.js'].lineData[38]++;
  return buffer;
};
  _$jscoverage['/overlay/close-xtpl.js'].lineData[40]++;
  buffer += runBlockCommandUtil(engine, scopes, config0, "if", 1);
  _$jscoverage['/overlay/close-xtpl.js'].lineData[41]++;
  buffer += '\r\n';
  _$jscoverage['/overlay/close-xtpl.js'].lineData[42]++;
  return buffer;
};
});

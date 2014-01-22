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
if (! _$jscoverage['/picker/year-panel/render.js']) {
  _$jscoverage['/picker/year-panel/render.js'] = {};
  _$jscoverage['/picker/year-panel/render.js'].lineData = [];
  _$jscoverage['/picker/year-panel/render.js'].lineData[6] = 0;
  _$jscoverage['/picker/year-panel/render.js'].lineData[7] = 0;
  _$jscoverage['/picker/year-panel/render.js'].lineData[8] = 0;
  _$jscoverage['/picker/year-panel/render.js'].lineData[9] = 0;
  _$jscoverage['/picker/year-panel/render.js'].lineData[10] = 0;
  _$jscoverage['/picker/year-panel/render.js'].lineData[11] = 0;
  _$jscoverage['/picker/year-panel/render.js'].lineData[12] = 0;
  _$jscoverage['/picker/year-panel/render.js'].lineData[13] = 0;
  _$jscoverage['/picker/year-panel/render.js'].lineData[14] = 0;
  _$jscoverage['/picker/year-panel/render.js'].lineData[15] = 0;
  _$jscoverage['/picker/year-panel/render.js'].lineData[16] = 0;
  _$jscoverage['/picker/year-panel/render.js'].lineData[17] = 0;
  _$jscoverage['/picker/year-panel/render.js'].lineData[18] = 0;
  _$jscoverage['/picker/year-panel/render.js'].lineData[19] = 0;
  _$jscoverage['/picker/year-panel/render.js'].lineData[20] = 0;
  _$jscoverage['/picker/year-panel/render.js'].lineData[21] = 0;
  _$jscoverage['/picker/year-panel/render.js'].lineData[22] = 0;
  _$jscoverage['/picker/year-panel/render.js'].lineData[23] = 0;
  _$jscoverage['/picker/year-panel/render.js'].lineData[27] = 0;
  _$jscoverage['/picker/year-panel/render.js'].lineData[30] = 0;
  _$jscoverage['/picker/year-panel/render.js'].lineData[31] = 0;
  _$jscoverage['/picker/year-panel/render.js'].lineData[34] = 0;
  _$jscoverage['/picker/year-panel/render.js'].lineData[36] = 0;
  _$jscoverage['/picker/year-panel/render.js'].lineData[37] = 0;
  _$jscoverage['/picker/year-panel/render.js'].lineData[38] = 0;
  _$jscoverage['/picker/year-panel/render.js'].lineData[39] = 0;
  _$jscoverage['/picker/year-panel/render.js'].lineData[40] = 0;
  _$jscoverage['/picker/year-panel/render.js'].lineData[41] = 0;
  _$jscoverage['/picker/year-panel/render.js'].lineData[42] = 0;
  _$jscoverage['/picker/year-panel/render.js'].lineData[51] = 0;
  _$jscoverage['/picker/year-panel/render.js'].lineData[61] = 0;
  _$jscoverage['/picker/year-panel/render.js'].lineData[62] = 0;
  _$jscoverage['/picker/year-panel/render.js'].lineData[63] = 0;
  _$jscoverage['/picker/year-panel/render.js'].lineData[64] = 0;
  _$jscoverage['/picker/year-panel/render.js'].lineData[65] = 0;
  _$jscoverage['/picker/year-panel/render.js'].lineData[71] = 0;
  _$jscoverage['/picker/year-panel/render.js'].lineData[72] = 0;
}
if (! _$jscoverage['/picker/year-panel/render.js'].functionData) {
  _$jscoverage['/picker/year-panel/render.js'].functionData = [];
  _$jscoverage['/picker/year-panel/render.js'].functionData[0] = 0;
  _$jscoverage['/picker/year-panel/render.js'].functionData[1] = 0;
  _$jscoverage['/picker/year-panel/render.js'].functionData[2] = 0;
  _$jscoverage['/picker/year-panel/render.js'].functionData[3] = 0;
}
if (! _$jscoverage['/picker/year-panel/render.js'].branchData) {
  _$jscoverage['/picker/year-panel/render.js'].branchData = {};
  _$jscoverage['/picker/year-panel/render.js'].branchData['19'] = [];
  _$jscoverage['/picker/year-panel/render.js'].branchData['19'][1] = new BranchData();
  _$jscoverage['/picker/year-panel/render.js'].branchData['21'] = [];
  _$jscoverage['/picker/year-panel/render.js'].branchData['21'][1] = new BranchData();
}
_$jscoverage['/picker/year-panel/render.js'].branchData['21'][1].init(58, 5, 'j < 4');
function visit52_21_1(result) {
  _$jscoverage['/picker/year-panel/render.js'].branchData['21'][1].ranCondition(result);
  return result;
}_$jscoverage['/picker/year-panel/render.js'].branchData['19'][1].init(500, 5, 'i < 3');
function visit51_19_1(result) {
  _$jscoverage['/picker/year-panel/render.js'].branchData['19'][1].ranCondition(result);
  return result;
}_$jscoverage['/picker/year-panel/render.js'].lineData[6]++;
KISSY.add('date/picker/year-panel/render', function(S, Control, DateFormat, YearsTpl, YearPanelTpl) {
  _$jscoverage['/picker/year-panel/render.js'].functionData[0]++;
  _$jscoverage['/picker/year-panel/render.js'].lineData[7]++;
  function prepareYears(control) {
    _$jscoverage['/picker/year-panel/render.js'].functionData[1]++;
    _$jscoverage['/picker/year-panel/render.js'].lineData[8]++;
    var value = control.get('value');
    _$jscoverage['/picker/year-panel/render.js'].lineData[9]++;
    var currentYear = value.getYear();
    _$jscoverage['/picker/year-panel/render.js'].lineData[10]++;
    var startYear = parseInt(currentYear / 10) * 10;
    _$jscoverage['/picker/year-panel/render.js'].lineData[11]++;
    var preYear = startYear - 1;
    _$jscoverage['/picker/year-panel/render.js'].lineData[12]++;
    var current = value.clone();
    _$jscoverage['/picker/year-panel/render.js'].lineData[13]++;
    var locale = control.get('locale');
    _$jscoverage['/picker/year-panel/render.js'].lineData[14]++;
    var yearFormat = locale.yearFormat;
    _$jscoverage['/picker/year-panel/render.js'].lineData[15]++;
    var dateLocale = value.getLocale();
    _$jscoverage['/picker/year-panel/render.js'].lineData[16]++;
    var dateFormatter = new DateFormat(yearFormat, dateLocale);
    _$jscoverage['/picker/year-panel/render.js'].lineData[17]++;
    var years = [];
    _$jscoverage['/picker/year-panel/render.js'].lineData[18]++;
    var index = 0;
    _$jscoverage['/picker/year-panel/render.js'].lineData[19]++;
    for (var i = 0; visit51_19_1(i < 3); i++) {
      _$jscoverage['/picker/year-panel/render.js'].lineData[20]++;
      years[i] = [];
      _$jscoverage['/picker/year-panel/render.js'].lineData[21]++;
      for (var j = 0; visit52_21_1(j < 4); j++) {
        _$jscoverage['/picker/year-panel/render.js'].lineData[22]++;
        current.setYear(preYear + index);
        _$jscoverage['/picker/year-panel/render.js'].lineData[23]++;
        years[i][j] = {
  content: preYear + index, 
  title: dateFormatter.format(current)};
        _$jscoverage['/picker/year-panel/render.js'].lineData[27]++;
        index++;
      }
    }
    _$jscoverage['/picker/year-panel/render.js'].lineData[30]++;
    control.years = years;
    _$jscoverage['/picker/year-panel/render.js'].lineData[31]++;
    return years;
  }
  _$jscoverage['/picker/year-panel/render.js'].lineData[34]++;
  return Control.getDefaultRender().extend({
  beforeCreateDom: function(renderData, childrenSelectors) {
  _$jscoverage['/picker/year-panel/render.js'].functionData[2]++;
  _$jscoverage['/picker/year-panel/render.js'].lineData[36]++;
  var control = this.control;
  _$jscoverage['/picker/year-panel/render.js'].lineData[37]++;
  var value = control.get('value');
  _$jscoverage['/picker/year-panel/render.js'].lineData[38]++;
  var currentYear = value.getYear();
  _$jscoverage['/picker/year-panel/render.js'].lineData[39]++;
  var startYear = parseInt(currentYear / 10) * 10;
  _$jscoverage['/picker/year-panel/render.js'].lineData[40]++;
  var endYear = startYear + 9;
  _$jscoverage['/picker/year-panel/render.js'].lineData[41]++;
  var locale = control.get('locale');
  _$jscoverage['/picker/year-panel/render.js'].lineData[42]++;
  S.mix(renderData, {
  decadeSelectLabel: locale.decadeSelect, 
  years: prepareYears(control), 
  startYear: startYear, 
  endYear: endYear, 
  year: value.getYear(), 
  previousDecadeLabel: locale.previousDecade, 
  nextDecadeLabel: locale.nextDecade});
  _$jscoverage['/picker/year-panel/render.js'].lineData[51]++;
  S.mix(childrenSelectors, {
  tbodyEl: '#ks-date-picker-year-panel-tbody-{id}', 
  previousDecadeBtn: '#ks-date-picker-year-panel-previous-decade-btn-{id}', 
  decadeSelectEl: '#ks-date-picker-year-panel-decade-select-{id}', 
  decadeSelectContentEl: '#ks-date-picker-year-panel-decade-select-content-{id}', 
  nextDecadeBtn: '#ks-date-picker-year-panel-next-decade-btn-{id}'});
}, 
  _onSetValue: function(value) {
  _$jscoverage['/picker/year-panel/render.js'].functionData[3]++;
  _$jscoverage['/picker/year-panel/render.js'].lineData[61]++;
  var control = this.control;
  _$jscoverage['/picker/year-panel/render.js'].lineData[62]++;
  var currentYear = value.getYear();
  _$jscoverage['/picker/year-panel/render.js'].lineData[63]++;
  var startYear = parseInt(currentYear / 10) * 10;
  _$jscoverage['/picker/year-panel/render.js'].lineData[64]++;
  var endYear = startYear + 9;
  _$jscoverage['/picker/year-panel/render.js'].lineData[65]++;
  S.mix(this.renderData, {
  startYear: startYear, 
  endYear: endYear, 
  years: prepareYears(control), 
  year: value.getYear()});
  _$jscoverage['/picker/year-panel/render.js'].lineData[71]++;
  control.get('tbodyEl').html(this.renderTpl(YearsTpl));
  _$jscoverage['/picker/year-panel/render.js'].lineData[72]++;
  control.get('decadeSelectContentEl').html(startYear + '-' + endYear);
}}, {
  ATTRS: {
  contentTpl: {
  value: YearPanelTpl}}});
}, {
  requires: ['component/control', 'date/format', './years-xtpl', './year-panel-xtpl']});

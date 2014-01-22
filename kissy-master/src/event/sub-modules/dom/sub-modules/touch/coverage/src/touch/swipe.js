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
if (! _$jscoverage['/touch/swipe.js']) {
  _$jscoverage['/touch/swipe.js'] = {};
  _$jscoverage['/touch/swipe.js'].lineData = [];
  _$jscoverage['/touch/swipe.js'].lineData[6] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[7] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[13] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[14] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[25] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[26] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[28] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[29] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[32] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[33] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[35] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[39] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[40] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[43] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[44] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[48] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[49] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[50] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[51] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[52] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[53] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[55] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[58] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[100] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[103] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[106] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[109] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[110] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[111] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[113] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[114] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[116] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[117] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[119] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[120] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[122] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[123] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[125] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[129] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[139] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[140] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[143] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[144] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[147] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[148] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[151] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[155] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[156] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[157] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[159] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[164] = 0;
  _$jscoverage['/touch/swipe.js'].lineData[168] = 0;
}
if (! _$jscoverage['/touch/swipe.js'].functionData) {
  _$jscoverage['/touch/swipe.js'].functionData = [];
  _$jscoverage['/touch/swipe.js'].functionData[0] = 0;
  _$jscoverage['/touch/swipe.js'].functionData[1] = 0;
  _$jscoverage['/touch/swipe.js'].functionData[2] = 0;
  _$jscoverage['/touch/swipe.js'].functionData[3] = 0;
  _$jscoverage['/touch/swipe.js'].functionData[4] = 0;
  _$jscoverage['/touch/swipe.js'].functionData[5] = 0;
}
if (! _$jscoverage['/touch/swipe.js'].branchData) {
  _$jscoverage['/touch/swipe.js'].branchData = {};
  _$jscoverage['/touch/swipe.js'].branchData['25'] = [];
  _$jscoverage['/touch/swipe.js'].branchData['25'][1] = new BranchData();
  _$jscoverage['/touch/swipe.js'].branchData['26'] = [];
  _$jscoverage['/touch/swipe.js'].branchData['26'][1] = new BranchData();
  _$jscoverage['/touch/swipe.js'].branchData['28'] = [];
  _$jscoverage['/touch/swipe.js'].branchData['28'][1] = new BranchData();
  _$jscoverage['/touch/swipe.js'].branchData['32'] = [];
  _$jscoverage['/touch/swipe.js'].branchData['32'][1] = new BranchData();
  _$jscoverage['/touch/swipe.js'].branchData['39'] = [];
  _$jscoverage['/touch/swipe.js'].branchData['39'][1] = new BranchData();
  _$jscoverage['/touch/swipe.js'].branchData['39'][2] = new BranchData();
  _$jscoverage['/touch/swipe.js'].branchData['43'] = [];
  _$jscoverage['/touch/swipe.js'].branchData['43'][1] = new BranchData();
  _$jscoverage['/touch/swipe.js'].branchData['43'][2] = new BranchData();
  _$jscoverage['/touch/swipe.js'].branchData['48'] = [];
  _$jscoverage['/touch/swipe.js'].branchData['48'][1] = new BranchData();
  _$jscoverage['/touch/swipe.js'].branchData['49'] = [];
  _$jscoverage['/touch/swipe.js'].branchData['49'][1] = new BranchData();
  _$jscoverage['/touch/swipe.js'].branchData['51'] = [];
  _$jscoverage['/touch/swipe.js'].branchData['51'][1] = new BranchData();
  _$jscoverage['/touch/swipe.js'].branchData['52'] = [];
  _$jscoverage['/touch/swipe.js'].branchData['52'][1] = new BranchData();
  _$jscoverage['/touch/swipe.js'].branchData['110'] = [];
  _$jscoverage['/touch/swipe.js'].branchData['110'][1] = new BranchData();
  _$jscoverage['/touch/swipe.js'].branchData['122'] = [];
  _$jscoverage['/touch/swipe.js'].branchData['122'][1] = new BranchData();
  _$jscoverage['/touch/swipe.js'].branchData['139'] = [];
  _$jscoverage['/touch/swipe.js'].branchData['139'][1] = new BranchData();
  _$jscoverage['/touch/swipe.js'].branchData['143'] = [];
  _$jscoverage['/touch/swipe.js'].branchData['143'][1] = new BranchData();
  _$jscoverage['/touch/swipe.js'].branchData['143'][2] = new BranchData();
  _$jscoverage['/touch/swipe.js'].branchData['147'] = [];
  _$jscoverage['/touch/swipe.js'].branchData['147'][1] = new BranchData();
  _$jscoverage['/touch/swipe.js'].branchData['147'][2] = new BranchData();
  _$jscoverage['/touch/swipe.js'].branchData['156'] = [];
  _$jscoverage['/touch/swipe.js'].branchData['156'][1] = new BranchData();
}
_$jscoverage['/touch/swipe.js'].branchData['156'][1].init(48, 29, 'self.onTouchMove(e) === false');
function visit93_156_1(result) {
  _$jscoverage['/touch/swipe.js'].branchData['156'][1].ranCondition(result);
  return result;
}_$jscoverage['/touch/swipe.js'].branchData['147'][2].init(624, 22, 'absDeltaY > MAX_OFFSET');
function visit92_147_2(result) {
  _$jscoverage['/touch/swipe.js'].branchData['147'][2].ranCondition(result);
  return result;
}_$jscoverage['/touch/swipe.js'].branchData['147'][1].init(603, 43, 'self.isHorizontal && absDeltaY > MAX_OFFSET');
function visit91_147_1(result) {
  _$jscoverage['/touch/swipe.js'].branchData['147'][1].ranCondition(result);
  return result;
}_$jscoverage['/touch/swipe.js'].branchData['143'][2].init(505, 22, 'absDeltaX > MAX_OFFSET');
function visit90_143_2(result) {
  _$jscoverage['/touch/swipe.js'].branchData['143'][2].ranCondition(result);
  return result;
}_$jscoverage['/touch/swipe.js'].branchData['143'][1].init(486, 41, 'self.isVertical && absDeltaX > MAX_OFFSET');
function visit89_143_1(result) {
  _$jscoverage['/touch/swipe.js'].branchData['143'][1].ranCondition(result);
  return result;
}_$jscoverage['/touch/swipe.js'].branchData['139'][1].init(381, 36, 'time - self.startTime > MAX_DURATION');
function visit88_139_1(result) {
  _$jscoverage['/touch/swipe.js'].branchData['139'][1].ranCondition(result);
  return result;
}_$jscoverage['/touch/swipe.js'].branchData['122'][1].init(415, 29, 'e.type.indexOf(\'mouse\') != -1');
function visit87_122_1(result) {
  _$jscoverage['/touch/swipe.js'].branchData['122'][1].ranCondition(result);
  return result;
}_$jscoverage['/touch/swipe.js'].branchData['110'][1].init(48, 62, 'Swipe.superclass.onTouchStart.apply(self, arguments) === false');
function visit86_110_1(result) {
  _$jscoverage['/touch/swipe.js'].branchData['110'][1].ranCondition(result);
  return result;
}_$jscoverage['/touch/swipe.js'].branchData['52'][1].init(26, 10, 'deltaY < 0');
function visit85_52_1(result) {
  _$jscoverage['/touch/swipe.js'].branchData['52'][1].ranCondition(result);
  return result;
}_$jscoverage['/touch/swipe.js'].branchData['51'][1].init(1186, 15, 'self.isVertical');
function visit84_51_1(result) {
  _$jscoverage['/touch/swipe.js'].branchData['51'][1].ranCondition(result);
  return result;
}_$jscoverage['/touch/swipe.js'].branchData['49'][1].init(26, 10, 'deltaX < 0');
function visit83_49_1(result) {
  _$jscoverage['/touch/swipe.js'].branchData['49'][1].ranCondition(result);
  return result;
}_$jscoverage['/touch/swipe.js'].branchData['48'][1].init(1053, 17, 'self.isHorizontal');
function visit82_48_1(result) {
  _$jscoverage['/touch/swipe.js'].branchData['48'][1].ranCondition(result);
  return result;
}_$jscoverage['/touch/swipe.js'].branchData['43'][2].init(158, 24, 'absDeltaX < MIN_DISTANCE');
function visit81_43_2(result) {
  _$jscoverage['/touch/swipe.js'].branchData['43'][2].ranCondition(result);
  return result;
}_$jscoverage['/touch/swipe.js'].branchData['43'][1].init(137, 45, 'self.isHorizontal && absDeltaX < MIN_DISTANCE');
function visit80_43_1(result) {
  _$jscoverage['/touch/swipe.js'].branchData['43'][1].ranCondition(result);
  return result;
}_$jscoverage['/touch/swipe.js'].branchData['39'][2].init(37, 24, 'absDeltaY < MIN_DISTANCE');
function visit79_39_2(result) {
  _$jscoverage['/touch/swipe.js'].branchData['39'][2].ranCondition(result);
  return result;
}_$jscoverage['/touch/swipe.js'].branchData['39'][1].init(18, 43, 'self.isVertical && absDeltaY < MIN_DISTANCE');
function visit78_39_1(result) {
  _$jscoverage['/touch/swipe.js'].branchData['39'][1].ranCondition(result);
  return result;
}_$jscoverage['/touch/swipe.js'].branchData['32'][1].init(174, 21, 'absDeltaY > absDeltaX');
function visit77_32_1(result) {
  _$jscoverage['/touch/swipe.js'].branchData['32'][1].ranCondition(result);
  return result;
}_$jscoverage['/touch/swipe.js'].branchData['28'][1].init(65, 34, 'Math.max(absDeltaX, absDeltaY) < 5');
function visit76_28_1(result) {
  _$jscoverage['/touch/swipe.js'].branchData['28'][1].ranCondition(result);
  return result;
}_$jscoverage['/touch/swipe.js'].branchData['26'][1].init(18, 36, 'self.isVertical && self.isHorizontal');
function visit75_26_1(result) {
  _$jscoverage['/touch/swipe.js'].branchData['26'][1].ranCondition(result);
  return result;
}_$jscoverage['/touch/swipe.js'].branchData['25'][1].init(361, 3, 'ing');
function visit74_25_1(result) {
  _$jscoverage['/touch/swipe.js'].branchData['25'][1].ranCondition(result);
  return result;
}_$jscoverage['/touch/swipe.js'].lineData[6]++;
KISSY.add('event/dom/touch/swipe', function(S, eventHandleMap, DomEvent, SingleTouch) {
  _$jscoverage['/touch/swipe.js'].functionData[0]++;
  _$jscoverage['/touch/swipe.js'].lineData[7]++;
  var event = 'swipe', ingEvent = 'swiping', MAX_DURATION = 1000, MAX_OFFSET = 35, MIN_DISTANCE = 50;
  _$jscoverage['/touch/swipe.js'].lineData[13]++;
  function fire(self, e, ing) {
    _$jscoverage['/touch/swipe.js'].functionData[1]++;
    _$jscoverage['/touch/swipe.js'].lineData[14]++;
    var touches = e.changedTouches, touch = touches[0], x = touch.pageX, y = touch.pageY, deltaX = x - self.startX, deltaY = y - self.startY, absDeltaX = Math.abs(deltaX), absDeltaY = Math.abs(deltaY), distance, direction;
    _$jscoverage['/touch/swipe.js'].lineData[25]++;
    if (visit74_25_1(ing)) {
      _$jscoverage['/touch/swipe.js'].lineData[26]++;
      if (visit75_26_1(self.isVertical && self.isHorizontal)) {
        _$jscoverage['/touch/swipe.js'].lineData[28]++;
        if (visit76_28_1(Math.max(absDeltaX, absDeltaY) < 5)) {
          _$jscoverage['/touch/swipe.js'].lineData[29]++;
          return;
        }
        _$jscoverage['/touch/swipe.js'].lineData[32]++;
        if (visit77_32_1(absDeltaY > absDeltaX)) {
          _$jscoverage['/touch/swipe.js'].lineData[33]++;
          self.isHorizontal = 0;
        } else {
          _$jscoverage['/touch/swipe.js'].lineData[35]++;
          self.isVertical = 0;
        }
      }
    } else {
      _$jscoverage['/touch/swipe.js'].lineData[39]++;
      if (visit78_39_1(self.isVertical && visit79_39_2(absDeltaY < MIN_DISTANCE))) {
        _$jscoverage['/touch/swipe.js'].lineData[40]++;
        self.isVertical = 0;
      }
      _$jscoverage['/touch/swipe.js'].lineData[43]++;
      if (visit80_43_1(self.isHorizontal && visit81_43_2(absDeltaX < MIN_DISTANCE))) {
        _$jscoverage['/touch/swipe.js'].lineData[44]++;
        self.isHorizontal = 0;
      }
    }
    _$jscoverage['/touch/swipe.js'].lineData[48]++;
    if (visit82_48_1(self.isHorizontal)) {
      _$jscoverage['/touch/swipe.js'].lineData[49]++;
      direction = visit83_49_1(deltaX < 0) ? 'left' : 'right';
      _$jscoverage['/touch/swipe.js'].lineData[50]++;
      distance = absDeltaX;
    } else {
      _$jscoverage['/touch/swipe.js'].lineData[51]++;
      if (visit84_51_1(self.isVertical)) {
        _$jscoverage['/touch/swipe.js'].lineData[52]++;
        direction = visit85_52_1(deltaY < 0) ? 'up' : 'down';
        _$jscoverage['/touch/swipe.js'].lineData[53]++;
        distance = absDeltaY;
      } else {
        _$jscoverage['/touch/swipe.js'].lineData[55]++;
        return false;
      }
    }
    _$jscoverage['/touch/swipe.js'].lineData[58]++;
    DomEvent.fire(e.target, ing ? ingEvent : event, {
  originalEvent: e.originalEvent, 
  pageX: touch.pageX, 
  pageY: touch.pageY, 
  which: 1, 
  touch: touch, 
  direction: direction, 
  distance: distance, 
  duration: (e.timeStamp - self.startTime) / 1000});
    _$jscoverage['/touch/swipe.js'].lineData[100]++;
    return undefined;
  }
  _$jscoverage['/touch/swipe.js'].lineData[103]++;
  function Swipe() {
    _$jscoverage['/touch/swipe.js'].functionData[2]++;
  }
  _$jscoverage['/touch/swipe.js'].lineData[106]++;
  S.extend(Swipe, SingleTouch, {
  onTouchStart: function(e) {
  _$jscoverage['/touch/swipe.js'].functionData[3]++;
  _$jscoverage['/touch/swipe.js'].lineData[109]++;
  var self = this;
  _$jscoverage['/touch/swipe.js'].lineData[110]++;
  if (visit86_110_1(Swipe.superclass.onTouchStart.apply(self, arguments) === false)) {
    _$jscoverage['/touch/swipe.js'].lineData[111]++;
    return false;
  }
  _$jscoverage['/touch/swipe.js'].lineData[113]++;
  var touch = e.touches[0];
  _$jscoverage['/touch/swipe.js'].lineData[114]++;
  self.startTime = e.timeStamp;
  _$jscoverage['/touch/swipe.js'].lineData[116]++;
  self.isHorizontal = 1;
  _$jscoverage['/touch/swipe.js'].lineData[117]++;
  self.isVertical = 1;
  _$jscoverage['/touch/swipe.js'].lineData[119]++;
  self.startX = touch.pageX;
  _$jscoverage['/touch/swipe.js'].lineData[120]++;
  this.startY = touch.pageY;
  _$jscoverage['/touch/swipe.js'].lineData[122]++;
  if (visit87_122_1(e.type.indexOf('mouse') != -1)) {
    _$jscoverage['/touch/swipe.js'].lineData[123]++;
    e.preventDefault();
  }
  _$jscoverage['/touch/swipe.js'].lineData[125]++;
  return undefined;
}, 
  onTouchMove: function(e) {
  _$jscoverage['/touch/swipe.js'].functionData[4]++;
  _$jscoverage['/touch/swipe.js'].lineData[129]++;
  var self = this, touch = e.changedTouches[0], x = touch.pageX, y = touch.pageY, deltaX = x - self.startX, deltaY = y - self.startY, absDeltaX = Math.abs(deltaX), absDeltaY = Math.abs(deltaY), time = e.timeStamp;
  _$jscoverage['/touch/swipe.js'].lineData[139]++;
  if (visit88_139_1(time - self.startTime > MAX_DURATION)) {
    _$jscoverage['/touch/swipe.js'].lineData[140]++;
    return false;
  }
  _$jscoverage['/touch/swipe.js'].lineData[143]++;
  if (visit89_143_1(self.isVertical && visit90_143_2(absDeltaX > MAX_OFFSET))) {
    _$jscoverage['/touch/swipe.js'].lineData[144]++;
    self.isVertical = 0;
  }
  _$jscoverage['/touch/swipe.js'].lineData[147]++;
  if (visit91_147_1(self.isHorizontal && visit92_147_2(absDeltaY > MAX_OFFSET))) {
    _$jscoverage['/touch/swipe.js'].lineData[148]++;
    self.isHorizontal = 0;
  }
  _$jscoverage['/touch/swipe.js'].lineData[151]++;
  return fire(self, e, 1);
}, 
  onTouchEnd: function(e) {
  _$jscoverage['/touch/swipe.js'].functionData[5]++;
  _$jscoverage['/touch/swipe.js'].lineData[155]++;
  var self = this;
  _$jscoverage['/touch/swipe.js'].lineData[156]++;
  if (visit93_156_1(self.onTouchMove(e) === false)) {
    _$jscoverage['/touch/swipe.js'].lineData[157]++;
    return false;
  }
  _$jscoverage['/touch/swipe.js'].lineData[159]++;
  return fire(self, e, 0);
}});
  _$jscoverage['/touch/swipe.js'].lineData[164]++;
  eventHandleMap[event] = eventHandleMap[ingEvent] = {
  handle: new Swipe()};
  _$jscoverage['/touch/swipe.js'].lineData[168]++;
  return Swipe;
}, {
  requires: ['./handle-map', 'event/dom/base', './single-touch']});

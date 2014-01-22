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
if (! _$jscoverage['/node/attach.js']) {
  _$jscoverage['/node/attach.js'] = {};
  _$jscoverage['/node/attach.js'].lineData = [];
  _$jscoverage['/node/attach.js'].lineData[6] = 0;
  _$jscoverage['/node/attach.js'].lineData[7] = 0;
  _$jscoverage['/node/attach.js'].lineData[103] = 0;
  _$jscoverage['/node/attach.js'].lineData[105] = 0;
  _$jscoverage['/node/attach.js'].lineData[106] = 0;
  _$jscoverage['/node/attach.js'].lineData[107] = 0;
  _$jscoverage['/node/attach.js'].lineData[108] = 0;
  _$jscoverage['/node/attach.js'].lineData[109] = 0;
  _$jscoverage['/node/attach.js'].lineData[111] = 0;
  _$jscoverage['/node/attach.js'].lineData[114] = 0;
  _$jscoverage['/node/attach.js'].lineData[115] = 0;
  _$jscoverage['/node/attach.js'].lineData[116] = 0;
  _$jscoverage['/node/attach.js'].lineData[117] = 0;
  _$jscoverage['/node/attach.js'].lineData[118] = 0;
  _$jscoverage['/node/attach.js'].lineData[120] = 0;
  _$jscoverage['/node/attach.js'].lineData[121] = 0;
  _$jscoverage['/node/attach.js'].lineData[123] = 0;
  _$jscoverage['/node/attach.js'].lineData[126] = 0;
  _$jscoverage['/node/attach.js'].lineData[128] = 0;
  _$jscoverage['/node/attach.js'].lineData[131] = 0;
  _$jscoverage['/node/attach.js'].lineData[132] = 0;
  _$jscoverage['/node/attach.js'].lineData[135] = 0;
  _$jscoverage['/node/attach.js'].lineData[138] = 0;
  _$jscoverage['/node/attach.js'].lineData[139] = 0;
  _$jscoverage['/node/attach.js'].lineData[140] = 0;
  _$jscoverage['/node/attach.js'].lineData[141] = 0;
  _$jscoverage['/node/attach.js'].lineData[145] = 0;
  _$jscoverage['/node/attach.js'].lineData[146] = 0;
  _$jscoverage['/node/attach.js'].lineData[147] = 0;
  _$jscoverage['/node/attach.js'].lineData[148] = 0;
  _$jscoverage['/node/attach.js'].lineData[152] = 0;
  _$jscoverage['/node/attach.js'].lineData[153] = 0;
  _$jscoverage['/node/attach.js'].lineData[154] = 0;
  _$jscoverage['/node/attach.js'].lineData[155] = 0;
  _$jscoverage['/node/attach.js'].lineData[159] = 0;
  _$jscoverage['/node/attach.js'].lineData[160] = 0;
  _$jscoverage['/node/attach.js'].lineData[161] = 0;
  _$jscoverage['/node/attach.js'].lineData[163] = 0;
  _$jscoverage['/node/attach.js'].lineData[164] = 0;
  _$jscoverage['/node/attach.js'].lineData[165] = 0;
  _$jscoverage['/node/attach.js'].lineData[169] = 0;
  _$jscoverage['/node/attach.js'].lineData[170] = 0;
  _$jscoverage['/node/attach.js'].lineData[171] = 0;
  _$jscoverage['/node/attach.js'].lineData[173] = 0;
  _$jscoverage['/node/attach.js'].lineData[174] = 0;
}
if (! _$jscoverage['/node/attach.js'].functionData) {
  _$jscoverage['/node/attach.js'].functionData = [];
  _$jscoverage['/node/attach.js'].functionData[0] = 0;
  _$jscoverage['/node/attach.js'].functionData[1] = 0;
  _$jscoverage['/node/attach.js'].functionData[2] = 0;
  _$jscoverage['/node/attach.js'].functionData[3] = 0;
  _$jscoverage['/node/attach.js'].functionData[4] = 0;
  _$jscoverage['/node/attach.js'].functionData[5] = 0;
  _$jscoverage['/node/attach.js'].functionData[6] = 0;
  _$jscoverage['/node/attach.js'].functionData[7] = 0;
  _$jscoverage['/node/attach.js'].functionData[8] = 0;
  _$jscoverage['/node/attach.js'].functionData[9] = 0;
  _$jscoverage['/node/attach.js'].functionData[10] = 0;
  _$jscoverage['/node/attach.js'].functionData[11] = 0;
  _$jscoverage['/node/attach.js'].functionData[12] = 0;
  _$jscoverage['/node/attach.js'].functionData[13] = 0;
}
if (! _$jscoverage['/node/attach.js'].branchData) {
  _$jscoverage['/node/attach.js'].branchData = {};
  _$jscoverage['/node/attach.js'].branchData['108'] = [];
  _$jscoverage['/node/attach.js'].branchData['108'][1] = new BranchData();
  _$jscoverage['/node/attach.js'].branchData['117'] = [];
  _$jscoverage['/node/attach.js'].branchData['117'][1] = new BranchData();
  _$jscoverage['/node/attach.js'].branchData['120'] = [];
  _$jscoverage['/node/attach.js'].branchData['120'][1] = new BranchData();
  _$jscoverage['/node/attach.js'].branchData['128'] = [];
  _$jscoverage['/node/attach.js'].branchData['128'][1] = new BranchData();
  _$jscoverage['/node/attach.js'].branchData['128'][2] = new BranchData();
}
_$jscoverage['/node/attach.js'].branchData['128'][2].init(30, 25, 'args[index] === undefined');
function visit14_128_2(result) {
  _$jscoverage['/node/attach.js'].branchData['128'][2].ranCondition(result);
  return result;
}_$jscoverage['/node/attach.js'].branchData['128'][1].init(30, 101, 'args[index] === undefined && !S.isObject(args[0])');
function visit13_128_1(result) {
  _$jscoverage['/node/attach.js'].branchData['128'][1].ranCondition(result);
  return result;
}_$jscoverage['/node/attach.js'].branchData['120'][1].init(165, 12, 'ret === null');
function visit12_120_1(result) {
  _$jscoverage['/node/attach.js'].branchData['120'][1].ranCondition(result);
  return result;
}_$jscoverage['/node/attach.js'].branchData['117'][1].init(88, 17, 'ret === undefined');
function visit11_117_1(result) {
  _$jscoverage['/node/attach.js'].branchData['117'][1].ranCondition(result);
  return result;
}_$jscoverage['/node/attach.js'].branchData['108'][1].init(88, 17, 'ret === undefined');
function visit10_108_1(result) {
  _$jscoverage['/node/attach.js'].branchData['108'][1].ranCondition(result);
  return result;
}_$jscoverage['/node/attach.js'].lineData[6]++;
KISSY.add('node/attach', function(S, Dom, Event, NodeList, undefined) {
  _$jscoverage['/node/attach.js'].functionData[0]++;
  _$jscoverage['/node/attach.js'].lineData[7]++;
  var NLP = NodeList.prototype, makeArray = S.makeArray, DOM_INCLUDES_NORM = ['nodeName', 'isCustomDomain', 'getEmptyIframeSrc', 'equals', 'contains', 'index', 'scrollTop', 'scrollLeft', 'height', 'width', 'innerHeight', 'innerWidth', 'outerHeight', 'outerWidth', 'addStyleSheet', 'appendTo', 'prependTo', 'insertBefore', 'before', 'after', 'insertAfter', 'test', 'hasClass', 'addClass', 'removeClass', 'replaceClass', 'toggleClass', 'removeAttr', 'hasAttr', 'hasProp', 'scrollIntoView', 'remove', 'empty', 'removeData', 'hasData', 'unselectable', 'wrap', 'wrapAll', 'replaceWith', 'wrapInner', 'unwrap'], DOM_INCLUDES_NORM_NODE_LIST = ['getWindow', 'getDocument', 'filter', 'first', 'last', 'parent', 'closest', 'next', 'prev', 'clone', 'siblings', 'contents', 'children'], DOM_INCLUDES_NORM_IF = {
  'attr': 1, 
  'text': 0, 
  'css': 1, 
  'style': 1, 
  'val': 0, 
  'prop': 1, 
  'offset': 0, 
  'html': 0, 
  'outerHTML': 0, 
  'outerHtml': 0, 
  'data': 1}, EVENT_INCLUDES_SELF = ['on', 'detach', 'delegate', 'undelegate'], EVENT_INCLUDES_RET = ['fire', 'fireHandler'];
  _$jscoverage['/node/attach.js'].lineData[103]++;
  NodeList.KeyCode = Event.KeyCode;
  _$jscoverage['/node/attach.js'].lineData[105]++;
  function accessNorm(fn, self, args) {
    _$jscoverage['/node/attach.js'].functionData[1]++;
    _$jscoverage['/node/attach.js'].lineData[106]++;
    args.unshift(self);
    _$jscoverage['/node/attach.js'].lineData[107]++;
    var ret = Dom[fn].apply(Dom, args);
    _$jscoverage['/node/attach.js'].lineData[108]++;
    if (visit10_108_1(ret === undefined)) {
      _$jscoverage['/node/attach.js'].lineData[109]++;
      return self;
    }
    _$jscoverage['/node/attach.js'].lineData[111]++;
    return ret;
  }
  _$jscoverage['/node/attach.js'].lineData[114]++;
  function accessNormList(fn, self, args) {
    _$jscoverage['/node/attach.js'].functionData[2]++;
    _$jscoverage['/node/attach.js'].lineData[115]++;
    args.unshift(self);
    _$jscoverage['/node/attach.js'].lineData[116]++;
    var ret = Dom[fn].apply(Dom, args);
    _$jscoverage['/node/attach.js'].lineData[117]++;
    if (visit11_117_1(ret === undefined)) {
      _$jscoverage['/node/attach.js'].lineData[118]++;
      return self;
    } else {
      _$jscoverage['/node/attach.js'].lineData[120]++;
      if (visit12_120_1(ret === null)) {
        _$jscoverage['/node/attach.js'].lineData[121]++;
        return null;
      }
    }
    _$jscoverage['/node/attach.js'].lineData[123]++;
    return new NodeList(ret);
  }
  _$jscoverage['/node/attach.js'].lineData[126]++;
  function accessNormIf(fn, self, index, args) {
    _$jscoverage['/node/attach.js'].functionData[3]++;
    _$jscoverage['/node/attach.js'].lineData[128]++;
    if (visit13_128_1(visit14_128_2(args[index] === undefined) && !S.isObject(args[0]))) {
      _$jscoverage['/node/attach.js'].lineData[131]++;
      args.unshift(self);
      _$jscoverage['/node/attach.js'].lineData[132]++;
      return Dom[fn].apply(Dom, args);
    }
    _$jscoverage['/node/attach.js'].lineData[135]++;
    return accessNorm(fn, self, args);
  }
  _$jscoverage['/node/attach.js'].lineData[138]++;
  S.each(DOM_INCLUDES_NORM, function(k) {
  _$jscoverage['/node/attach.js'].functionData[4]++;
  _$jscoverage['/node/attach.js'].lineData[139]++;
  NLP[k] = function() {
  _$jscoverage['/node/attach.js'].functionData[5]++;
  _$jscoverage['/node/attach.js'].lineData[140]++;
  var args = makeArray(arguments);
  _$jscoverage['/node/attach.js'].lineData[141]++;
  return accessNorm(k, this, args);
};
});
  _$jscoverage['/node/attach.js'].lineData[145]++;
  S.each(DOM_INCLUDES_NORM_NODE_LIST, function(k) {
  _$jscoverage['/node/attach.js'].functionData[6]++;
  _$jscoverage['/node/attach.js'].lineData[146]++;
  NLP[k] = function() {
  _$jscoverage['/node/attach.js'].functionData[7]++;
  _$jscoverage['/node/attach.js'].lineData[147]++;
  var args = makeArray(arguments);
  _$jscoverage['/node/attach.js'].lineData[148]++;
  return accessNormList(k, this, args);
};
});
  _$jscoverage['/node/attach.js'].lineData[152]++;
  S.each(DOM_INCLUDES_NORM_IF, function(index, k) {
  _$jscoverage['/node/attach.js'].functionData[8]++;
  _$jscoverage['/node/attach.js'].lineData[153]++;
  NLP[k] = function() {
  _$jscoverage['/node/attach.js'].functionData[9]++;
  _$jscoverage['/node/attach.js'].lineData[154]++;
  var args = makeArray(arguments);
  _$jscoverage['/node/attach.js'].lineData[155]++;
  return accessNormIf(k, this, index, args);
};
});
  _$jscoverage['/node/attach.js'].lineData[159]++;
  S.each(EVENT_INCLUDES_SELF, function(k) {
  _$jscoverage['/node/attach.js'].functionData[10]++;
  _$jscoverage['/node/attach.js'].lineData[160]++;
  NLP[k] = function() {
  _$jscoverage['/node/attach.js'].functionData[11]++;
  _$jscoverage['/node/attach.js'].lineData[161]++;
  var self = this, args = makeArray(arguments);
  _$jscoverage['/node/attach.js'].lineData[163]++;
  args.unshift(self);
  _$jscoverage['/node/attach.js'].lineData[164]++;
  Event[k].apply(Event, args);
  _$jscoverage['/node/attach.js'].lineData[165]++;
  return self;
};
});
  _$jscoverage['/node/attach.js'].lineData[169]++;
  S.each(EVENT_INCLUDES_RET, function(k) {
  _$jscoverage['/node/attach.js'].functionData[12]++;
  _$jscoverage['/node/attach.js'].lineData[170]++;
  NLP[k] = function() {
  _$jscoverage['/node/attach.js'].functionData[13]++;
  _$jscoverage['/node/attach.js'].lineData[171]++;
  var self = this, args = makeArray(arguments);
  _$jscoverage['/node/attach.js'].lineData[173]++;
  args.unshift(self);
  _$jscoverage['/node/attach.js'].lineData[174]++;
  return Event[k].apply(Event, args);
};
});
}, {
  requires: ['dom', 'event/dom', './base']});

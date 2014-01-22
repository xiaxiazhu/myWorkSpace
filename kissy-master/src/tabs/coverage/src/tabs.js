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
if (! _$jscoverage['/tabs.js']) {
  _$jscoverage['/tabs.js'] = {};
  _$jscoverage['/tabs.js'].lineData = [];
  _$jscoverage['/tabs.js'].lineData[6] = 0;
  _$jscoverage['/tabs.js'].lineData[8] = 0;
  _$jscoverage['/tabs.js'].lineData[9] = 0;
  _$jscoverage['/tabs.js'].lineData[12] = 0;
  _$jscoverage['/tabs.js'].lineData[13] = 0;
  _$jscoverage['/tabs.js'].lineData[21] = 0;
  _$jscoverage['/tabs.js'].lineData[23] = 0;
  _$jscoverage['/tabs.js'].lineData[27] = 0;
  _$jscoverage['/tabs.js'].lineData[28] = 0;
  _$jscoverage['/tabs.js'].lineData[49] = 0;
  _$jscoverage['/tabs.js'].lineData[50] = 0;
  _$jscoverage['/tabs.js'].lineData[51] = 0;
  _$jscoverage['/tabs.js'].lineData[55] = 0;
  _$jscoverage['/tabs.js'].lineData[62] = 0;
  _$jscoverage['/tabs.js'].lineData[63] = 0;
  _$jscoverage['/tabs.js'].lineData[64] = 0;
  _$jscoverage['/tabs.js'].lineData[67] = 0;
  _$jscoverage['/tabs.js'].lineData[68] = 0;
  _$jscoverage['/tabs.js'].lineData[82] = 0;
  _$jscoverage['/tabs.js'].lineData[90] = 0;
  _$jscoverage['/tabs.js'].lineData[91] = 0;
  _$jscoverage['/tabs.js'].lineData[94] = 0;
  _$jscoverage['/tabs.js'].lineData[98] = 0;
  _$jscoverage['/tabs.js'].lineData[102] = 0;
  _$jscoverage['/tabs.js'].lineData[104] = 0;
  _$jscoverage['/tabs.js'].lineData[106] = 0;
  _$jscoverage['/tabs.js'].lineData[108] = 0;
  _$jscoverage['/tabs.js'].lineData[109] = 0;
  _$jscoverage['/tabs.js'].lineData[110] = 0;
  _$jscoverage['/tabs.js'].lineData[113] = 0;
  _$jscoverage['/tabs.js'].lineData[123] = 0;
  _$jscoverage['/tabs.js'].lineData[134] = 0;
  _$jscoverage['/tabs.js'].lineData[135] = 0;
  _$jscoverage['/tabs.js'].lineData[136] = 0;
  _$jscoverage['/tabs.js'].lineData[137] = 0;
  _$jscoverage['/tabs.js'].lineData[138] = 0;
  _$jscoverage['/tabs.js'].lineData[140] = 0;
  _$jscoverage['/tabs.js'].lineData[143] = 0;
  _$jscoverage['/tabs.js'].lineData[144] = 0;
  _$jscoverage['/tabs.js'].lineData[145] = 0;
  _$jscoverage['/tabs.js'].lineData[155] = 0;
  _$jscoverage['/tabs.js'].lineData[156] = 0;
  _$jscoverage['/tabs.js'].lineData[166] = 0;
  _$jscoverage['/tabs.js'].lineData[167] = 0;
  _$jscoverage['/tabs.js'].lineData[175] = 0;
  _$jscoverage['/tabs.js'].lineData[179] = 0;
  _$jscoverage['/tabs.js'].lineData[180] = 0;
  _$jscoverage['/tabs.js'].lineData[181] = 0;
  _$jscoverage['/tabs.js'].lineData[182] = 0;
  _$jscoverage['/tabs.js'].lineData[184] = 0;
  _$jscoverage['/tabs.js'].lineData[187] = 0;
  _$jscoverage['/tabs.js'].lineData[195] = 0;
  _$jscoverage['/tabs.js'].lineData[199] = 0;
  _$jscoverage['/tabs.js'].lineData[200] = 0;
  _$jscoverage['/tabs.js'].lineData[201] = 0;
  _$jscoverage['/tabs.js'].lineData[202] = 0;
  _$jscoverage['/tabs.js'].lineData[204] = 0;
  _$jscoverage['/tabs.js'].lineData[207] = 0;
  _$jscoverage['/tabs.js'].lineData[215] = 0;
  _$jscoverage['/tabs.js'].lineData[223] = 0;
  _$jscoverage['/tabs.js'].lineData[230] = 0;
  _$jscoverage['/tabs.js'].lineData[237] = 0;
  _$jscoverage['/tabs.js'].lineData[246] = 0;
  _$jscoverage['/tabs.js'].lineData[249] = 0;
  _$jscoverage['/tabs.js'].lineData[250] = 0;
  _$jscoverage['/tabs.js'].lineData[251] = 0;
  _$jscoverage['/tabs.js'].lineData[260] = 0;
  _$jscoverage['/tabs.js'].lineData[264] = 0;
  _$jscoverage['/tabs.js'].lineData[265] = 0;
  _$jscoverage['/tabs.js'].lineData[266] = 0;
  _$jscoverage['/tabs.js'].lineData[273] = 0;
  _$jscoverage['/tabs.js'].lineData[274] = 0;
  _$jscoverage['/tabs.js'].lineData[342] = 0;
  _$jscoverage['/tabs.js'].lineData[347] = 0;
  _$jscoverage['/tabs.js'].lineData[372] = 0;
  _$jscoverage['/tabs.js'].lineData[391] = 0;
  _$jscoverage['/tabs.js'].lineData[398] = 0;
  _$jscoverage['/tabs.js'].lineData[400] = 0;
  _$jscoverage['/tabs.js'].lineData[401] = 0;
  _$jscoverage['/tabs.js'].lineData[402] = 0;
  _$jscoverage['/tabs.js'].lineData[404] = 0;
}
if (! _$jscoverage['/tabs.js'].functionData) {
  _$jscoverage['/tabs.js'].functionData = [];
  _$jscoverage['/tabs.js'].functionData[0] = 0;
  _$jscoverage['/tabs.js'].functionData[1] = 0;
  _$jscoverage['/tabs.js'].functionData[2] = 0;
  _$jscoverage['/tabs.js'].functionData[3] = 0;
  _$jscoverage['/tabs.js'].functionData[4] = 0;
  _$jscoverage['/tabs.js'].functionData[5] = 0;
  _$jscoverage['/tabs.js'].functionData[6] = 0;
  _$jscoverage['/tabs.js'].functionData[7] = 0;
  _$jscoverage['/tabs.js'].functionData[8] = 0;
  _$jscoverage['/tabs.js'].functionData[9] = 0;
  _$jscoverage['/tabs.js'].functionData[10] = 0;
  _$jscoverage['/tabs.js'].functionData[11] = 0;
  _$jscoverage['/tabs.js'].functionData[12] = 0;
  _$jscoverage['/tabs.js'].functionData[13] = 0;
  _$jscoverage['/tabs.js'].functionData[14] = 0;
  _$jscoverage['/tabs.js'].functionData[15] = 0;
  _$jscoverage['/tabs.js'].functionData[16] = 0;
  _$jscoverage['/tabs.js'].functionData[17] = 0;
  _$jscoverage['/tabs.js'].functionData[18] = 0;
  _$jscoverage['/tabs.js'].functionData[19] = 0;
  _$jscoverage['/tabs.js'].functionData[20] = 0;
  _$jscoverage['/tabs.js'].functionData[21] = 0;
  _$jscoverage['/tabs.js'].functionData[22] = 0;
}
if (! _$jscoverage['/tabs.js'].branchData) {
  _$jscoverage['/tabs.js'].branchData = {};
  _$jscoverage['/tabs.js'].branchData['27'] = [];
  _$jscoverage['/tabs.js'].branchData['27'][1] = new BranchData();
  _$jscoverage['/tabs.js'].branchData['50'] = [];
  _$jscoverage['/tabs.js'].branchData['50'][1] = new BranchData();
  _$jscoverage['/tabs.js'].branchData['62'] = [];
  _$jscoverage['/tabs.js'].branchData['62'][1] = new BranchData();
  _$jscoverage['/tabs.js'].branchData['90'] = [];
  _$jscoverage['/tabs.js'].branchData['90'][1] = new BranchData();
  _$jscoverage['/tabs.js'].branchData['108'] = [];
  _$jscoverage['/tabs.js'].branchData['108'][1] = new BranchData();
  _$jscoverage['/tabs.js'].branchData['134'] = [];
  _$jscoverage['/tabs.js'].branchData['134'][1] = new BranchData();
  _$jscoverage['/tabs.js'].branchData['135'] = [];
  _$jscoverage['/tabs.js'].branchData['135'][1] = new BranchData();
  _$jscoverage['/tabs.js'].branchData['137'] = [];
  _$jscoverage['/tabs.js'].branchData['137'][1] = new BranchData();
  _$jscoverage['/tabs.js'].branchData['180'] = [];
  _$jscoverage['/tabs.js'].branchData['180'][1] = new BranchData();
  _$jscoverage['/tabs.js'].branchData['200'] = [];
  _$jscoverage['/tabs.js'].branchData['200'][1] = new BranchData();
}
_$jscoverage['/tabs.js'].branchData['200'][1].init(22, 17, 'c.get("selected")');
function visit26_200_1(result) {
  _$jscoverage['/tabs.js'].branchData['200'][1].ranCondition(result);
  return result;
}_$jscoverage['/tabs.js'].branchData['180'][1].init(22, 17, 'c.get("selected")');
function visit25_180_1(result) {
  _$jscoverage['/tabs.js'].branchData['180'][1].ranCondition(result);
  return result;
}_$jscoverage['/tabs.js'].branchData['137'][1].init(123, 10, 'index == 0');
function visit24_137_1(result) {
  _$jscoverage['/tabs.js'].branchData['137'][1].ranCondition(result);
  return result;
}_$jscoverage['/tabs.js'].branchData['135'][1].init(22, 17, 'barCs.length == 1');
function visit23_135_1(result) {
  _$jscoverage['/tabs.js'].branchData['135'][1].ranCondition(result);
  return result;
}_$jscoverage['/tabs.js'].branchData['134'][1].init(418, 19, 'tab.get("selected")');
function visit22_134_1(result) {
  _$jscoverage['/tabs.js'].branchData['134'][1].ranCondition(result);
  return result;
}_$jscoverage['/tabs.js'].branchData['108'][1].init(684, 16, 'item[\'selected\']');
function visit21_108_1(result) {
  _$jscoverage['/tabs.js'].branchData['108'][1].ranCondition(result);
  return result;
}_$jscoverage['/tabs.js'].branchData['90'][1].init(268, 27, 'typeof index == \'undefined\'');
function visit20_90_1(result) {
  _$jscoverage['/tabs.js'].branchData['90'][1].ranCondition(result);
  return result;
}_$jscoverage['/tabs.js'].branchData['62'][1].init(1349, 31, '!selected && barChildren.length');
function visit19_62_1(result) {
  _$jscoverage['/tabs.js'].branchData['62'][1].ranCondition(result);
  return result;
}_$jscoverage['/tabs.js'].branchData['50'][1].init(33, 25, 'selected || item.selected');
function visit18_50_1(result) {
  _$jscoverage['/tabs.js'].branchData['50'][1].ranCondition(result);
  return result;
}_$jscoverage['/tabs.js'].branchData['27'][1].init(122, 5, 'items');
function visit17_27_1(result) {
  _$jscoverage['/tabs.js'].branchData['27'][1].ranCondition(result);
  return result;
}_$jscoverage['/tabs.js'].lineData[6]++;
KISSY.add("tabs", function(S, Container, Bar, Body, Tab, Panel, Render) {
  _$jscoverage['/tabs.js'].functionData[0]++;
  _$jscoverage['/tabs.js'].lineData[8]++;
  function setBar(children, barOrientation, bar) {
    _$jscoverage['/tabs.js'].functionData[1]++;
    _$jscoverage['/tabs.js'].lineData[9]++;
    children[BarIndexMap[barOrientation]] = bar;
  }
  _$jscoverage['/tabs.js'].lineData[12]++;
  function setBody(children, barOrientation, body) {
    _$jscoverage['/tabs.js'].functionData[2]++;
    _$jscoverage['/tabs.js'].lineData[13]++;
    children[1 - BarIndexMap[barOrientation]] = body;
  }
  _$jscoverage['/tabs.js'].lineData[21]++;
  var Tabs = Container.extend({
  initializer: function() {
  _$jscoverage['/tabs.js'].functionData[3]++;
  _$jscoverage['/tabs.js'].lineData[23]++;
  var self = this, items = self.get('items');
  _$jscoverage['/tabs.js'].lineData[27]++;
  if (visit17_27_1(items)) {
    _$jscoverage['/tabs.js'].lineData[28]++;
    var children = self.get('children'), barOrientation = self.get('barOrientation'), selected, prefixCls = self.get('prefixCls'), tabItem, panelItem, bar = {
  prefixCls: prefixCls, 
  xclass: 'tabs-bar', 
  changeType: self.get("changeType"), 
  children: []}, body = {
  prefixCls: prefixCls, 
  xclass: 'tabs-body', 
  lazyRender: self.get('lazyRender'), 
  children: []}, barChildren = bar.children, panels = body.children;
    _$jscoverage['/tabs.js'].lineData[49]++;
    S.each(items, function(item) {
  _$jscoverage['/tabs.js'].functionData[4]++;
  _$jscoverage['/tabs.js'].lineData[50]++;
  selected = visit18_50_1(selected || item.selected);
  _$jscoverage['/tabs.js'].lineData[51]++;
  barChildren.push(tabItem = {
  content: item.title, 
  selected: item.selected});
  _$jscoverage['/tabs.js'].lineData[55]++;
  panels.push(panelItem = {
  content: item.content, 
  selected: item.selected});
});
    _$jscoverage['/tabs.js'].lineData[62]++;
    if (visit19_62_1(!selected && barChildren.length)) {
      _$jscoverage['/tabs.js'].lineData[63]++;
      barChildren[0].selected = true;
      _$jscoverage['/tabs.js'].lineData[64]++;
      panels[0].selected = true;
    }
    _$jscoverage['/tabs.js'].lineData[67]++;
    setBar(children, barOrientation, bar);
    _$jscoverage['/tabs.js'].lineData[68]++;
    setBody(children, barOrientation, body);
  }
}, 
  addItem: function(item, index) {
  _$jscoverage['/tabs.js'].functionData[5]++;
  _$jscoverage['/tabs.js'].lineData[82]++;
  var self = this, bar = self.get("bar"), selectedTab, tabItem, panelItem, barChildren = bar.get('children'), body = self.get("body");
  _$jscoverage['/tabs.js'].lineData[90]++;
  if (visit20_90_1(typeof index == 'undefined')) {
    _$jscoverage['/tabs.js'].lineData[91]++;
    index = barChildren.length;
  }
  _$jscoverage['/tabs.js'].lineData[94]++;
  tabItem = {
  content: item.title};
  _$jscoverage['/tabs.js'].lineData[98]++;
  panelItem = {
  content: item.content};
  _$jscoverage['/tabs.js'].lineData[102]++;
  bar.addChild(tabItem, index);
  _$jscoverage['/tabs.js'].lineData[104]++;
  selectedTab = barChildren[index];
  _$jscoverage['/tabs.js'].lineData[106]++;
  body.addChild(panelItem, index);
  _$jscoverage['/tabs.js'].lineData[108]++;
  if (visit21_108_1(item['selected'])) {
    _$jscoverage['/tabs.js'].lineData[109]++;
    bar.set('selectedTab', selectedTab);
    _$jscoverage['/tabs.js'].lineData[110]++;
    body.set('selectedPanelIndex', index);
  }
  _$jscoverage['/tabs.js'].lineData[113]++;
  return self;
}, 
  removeItemAt: function(index, destroy) {
  _$jscoverage['/tabs.js'].functionData[6]++;
  _$jscoverage['/tabs.js'].lineData[123]++;
  var tabs = this, bar = tabs.get("bar"), barCs = bar.get("children"), tab = bar.getChildAt(index), body = tabs.get("body");
  _$jscoverage['/tabs.js'].lineData[134]++;
  if (visit22_134_1(tab.get("selected"))) {
    _$jscoverage['/tabs.js'].lineData[135]++;
    if (visit23_135_1(barCs.length == 1)) {
      _$jscoverage['/tabs.js'].lineData[136]++;
      bar.set("selectedTab", null);
    } else {
      _$jscoverage['/tabs.js'].lineData[137]++;
      if (visit24_137_1(index == 0)) {
        _$jscoverage['/tabs.js'].lineData[138]++;
        bar.set("selectedTab", bar.getChildAt(index + 1));
      } else {
        _$jscoverage['/tabs.js'].lineData[140]++;
        bar.set("selectedTab", bar.getChildAt(index - 1));
      }
    }
  }
  _$jscoverage['/tabs.js'].lineData[143]++;
  bar.removeChild(bar.getChildAt(index), destroy);
  _$jscoverage['/tabs.js'].lineData[144]++;
  body.removeChild(body.getChildAt(index), destroy);
  _$jscoverage['/tabs.js'].lineData[145]++;
  return tabs;
}, 
  'removeItemByTab': function(tab, destroy) {
  _$jscoverage['/tabs.js'].functionData[7]++;
  _$jscoverage['/tabs.js'].lineData[155]++;
  var index = S.indexOf(tab, this.get("bar").get("children"));
  _$jscoverage['/tabs.js'].lineData[156]++;
  return this.removeItemAt(index, destroy);
}, 
  'removeItemByPanel': function(panel, destroy) {
  _$jscoverage['/tabs.js'].functionData[8]++;
  _$jscoverage['/tabs.js'].lineData[166]++;
  var index = S.indexOf(panel, this.get("body").get("children"));
  _$jscoverage['/tabs.js'].lineData[167]++;
  return this.removeItemAt(index, destroy);
}, 
  getSelectedTab: function() {
  _$jscoverage['/tabs.js'].functionData[9]++;
  _$jscoverage['/tabs.js'].lineData[175]++;
  var tabs = this, bar = tabs.get("bar"), child = null;
  _$jscoverage['/tabs.js'].lineData[179]++;
  S.each(bar.get("children"), function(c) {
  _$jscoverage['/tabs.js'].functionData[10]++;
  _$jscoverage['/tabs.js'].lineData[180]++;
  if (visit25_180_1(c.get("selected"))) {
    _$jscoverage['/tabs.js'].lineData[181]++;
    child = c;
    _$jscoverage['/tabs.js'].lineData[182]++;
    return false;
  }
  _$jscoverage['/tabs.js'].lineData[184]++;
  return undefined;
});
  _$jscoverage['/tabs.js'].lineData[187]++;
  return child;
}, 
  getSelectedPanel: function() {
  _$jscoverage['/tabs.js'].functionData[11]++;
  _$jscoverage['/tabs.js'].lineData[195]++;
  var tabs = this, body = tabs.get("body"), child = null;
  _$jscoverage['/tabs.js'].lineData[199]++;
  S.each(body.get("children"), function(c) {
  _$jscoverage['/tabs.js'].functionData[12]++;
  _$jscoverage['/tabs.js'].lineData[200]++;
  if (visit26_200_1(c.get("selected"))) {
    _$jscoverage['/tabs.js'].lineData[201]++;
    child = c;
    _$jscoverage['/tabs.js'].lineData[202]++;
    return false;
  }
  _$jscoverage['/tabs.js'].lineData[204]++;
  return undefined;
});
  _$jscoverage['/tabs.js'].lineData[207]++;
  return child;
}, 
  getTabs: function() {
  _$jscoverage['/tabs.js'].functionData[13]++;
  _$jscoverage['/tabs.js'].lineData[215]++;
  return this.get("bar").get("children");
}, 
  getPanels: function() {
  _$jscoverage['/tabs.js'].functionData[14]++;
  _$jscoverage['/tabs.js'].lineData[223]++;
  return this.get("body").get("children");
}, 
  getTabAt: function(index) {
  _$jscoverage['/tabs.js'].functionData[15]++;
  _$jscoverage['/tabs.js'].lineData[230]++;
  return this.get("bar").get("children")[index];
}, 
  'getPanelAt': function(index) {
  _$jscoverage['/tabs.js'].functionData[16]++;
  _$jscoverage['/tabs.js'].lineData[237]++;
  return this.get("body").get("children")[index];
}, 
  setSelectedTab: function(tab) {
  _$jscoverage['/tabs.js'].functionData[17]++;
  _$jscoverage['/tabs.js'].lineData[246]++;
  var tabs = this, bar = tabs.get("bar"), body = tabs.get("body");
  _$jscoverage['/tabs.js'].lineData[249]++;
  bar.set('selectedTab', tab);
  _$jscoverage['/tabs.js'].lineData[250]++;
  body.set('selectedPanelIndex', S.indexOf(tab, bar.get('children')));
  _$jscoverage['/tabs.js'].lineData[251]++;
  return this;
}, 
  'setSelectedPanel': function(panel) {
  _$jscoverage['/tabs.js'].functionData[18]++;
  _$jscoverage['/tabs.js'].lineData[260]++;
  var tabs = this, bar = tabs.get("bar"), body = tabs.get("body"), selectedPanelIndex = S.indexOf(panel, body.get('children'));
  _$jscoverage['/tabs.js'].lineData[264]++;
  body.set('selectedPanelIndex', selectedPanelIndex);
  _$jscoverage['/tabs.js'].lineData[265]++;
  bar.set('selectedTab', tabs.getTabAt(selectedPanelIndex));
  _$jscoverage['/tabs.js'].lineData[266]++;
  return this;
}, 
  bindUI: function() {
  _$jscoverage['/tabs.js'].functionData[19]++;
  _$jscoverage['/tabs.js'].lineData[273]++;
  this.on("afterSelectedTabChange", function(e) {
  _$jscoverage['/tabs.js'].functionData[20]++;
  _$jscoverage['/tabs.js'].lineData[274]++;
  this.setSelectedTab(e.newVal);
});
}}, {
  ATTRS: {
  items: {}, 
  changeType: {}, 
  lazyRender: {
  value: false}, 
  handleMouseEvents: {
  value: false}, 
  allowTextSelection: {
  value: true}, 
  focusable: {
  value: false}, 
  bar: {
  getter: function() {
  _$jscoverage['/tabs.js'].functionData[21]++;
  _$jscoverage['/tabs.js'].lineData[342]++;
  return this.get('children')[BarIndexMap[this.get('barOrientation')]];
}}, 
  body: {
  getter: function() {
  _$jscoverage['/tabs.js'].functionData[22]++;
  _$jscoverage['/tabs.js'].lineData[347]++;
  return this.get('children')[1 - BarIndexMap[this.get('barOrientation')]];
}}, 
  barOrientation: {
  view: 1, 
  value: 'top'}, 
  xrender: {
  value: Render}}, 
  xclass: 'tabs'});
  _$jscoverage['/tabs.js'].lineData[372]++;
  Tabs.Orientation = {
  TOP: 'top', 
  BOTTOM: 'bottom', 
  LEFT: 'left', 
  RIGHT: 'right'};
  _$jscoverage['/tabs.js'].lineData[391]++;
  var BarIndexMap = {
  top: 0, 
  left: 0, 
  bottom: 1, 
  right: 0};
  _$jscoverage['/tabs.js'].lineData[398]++;
  Tabs.ChangeType = Bar.ChangeType;
  _$jscoverage['/tabs.js'].lineData[400]++;
  Tabs.Bar = Bar;
  _$jscoverage['/tabs.js'].lineData[401]++;
  Tabs.Body = Body;
  _$jscoverage['/tabs.js'].lineData[402]++;
  Tabs.Panel = Panel;
  _$jscoverage['/tabs.js'].lineData[404]++;
  return Tabs;
}, {
  requires: ['component/container', 'tabs/bar', 'tabs/body', 'tabs/tab', 'tabs/panel', 'tabs/render']});

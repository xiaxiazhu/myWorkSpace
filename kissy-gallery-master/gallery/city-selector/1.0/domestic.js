/**
@fileoverview 国内城市数据
@author freyaoo@gmail.com
@version 1.0
*/
KISSY.add('gallery/city-selector/1.0/domestic',function(S){
	'use strict';

	var data = [{"name":"安徽","pinyin":"anhui","spy":"ah","code":"30509","city":[{"name":"安庆","pinyin":"anqing","spy":"aq","code":"45959"},{"name":"蚌埠","pinyin":"bangbu","spy":"bb","code":"45961"},{"name":"亳州","pinyin":"bozhou","spy":"bz","code":"45966"},{"name":"巢湖","pinyin":"chaohu","spy":"ch","code":"45964"},{"name":"滁州","pinyin":"chuzhou","spy":"cz","code":"110249"},{"name":"池州","pinyin":"chizhou","spy":"cz","code":"110252"},{"name":"阜阳","pinyin":"fuyang","spy":"fy","code":"45963"},{"name":"淮北","pinyin":"huaibei","spy":"hb","code":"110247"},{"name":"合肥","pinyin":"hefei","spy":"hf","code":"29413"},{"name":"淮南","pinyin":"huainan","spy":"hn","code":"45962"},{"name":"黄山","pinyin":"huangshan","spy":"hs","code":"38723"},{"name":"六安","pinyin":"liuan","spy":"la","code":"110250"},{"name":"马鞍山","pinyin":"maanshan","spy":"mas","code":"45968"},{"name":"宿州","pinyin":"suzhou","spy":"sz","code":"45965"},{"name":"铜陵","pinyin":"tongling","spy":"tl","code":"110248"},{"name":"芜湖","pinyin":"wuhu","spy":"wh","code":"45960"},{"name":"宣城","pinyin":"xuancheng","spy":"xc","code":"110253"}]},{"name":"北京","pinyin":"beijing","spy":"bj","code":"29400"},{"name":"重庆","pinyin":"chongqing","spy":"cq","code":"29404"},{"name":"福建","pinyin":"fujian","spy":"fj","code":"30519","city":[{"name":"福州","pinyin":"fuzhou","spy":"fz","code":"29406"},{"name":"龙岩（永定土楼）","pinyin":"longyan（yongdingtulou）","spy":"ly（ydtl）","code":"82717644"},{"name":"宁德","pinyin":"ningde","spy":"nd","code":"45973"},{"name":"南平","pinyin":"nanping","spy":"np","code":"46213"},{"name":"莆田","pinyin":"putian","spy":"pt","code":"45972"},{"name":"泉州","pinyin":"quanzhou","spy":"qz","code":"38742"},{"name":"厦门","pinyin":"shamen","spy":"sm","code":"29431"},{"name":"三明","pinyin":"sanming","spy":"sm","code":"46212"},{"name":"漳州","pinyin":"zhangzhou","spy":"zz","code":"45975"}]},{"name":"广东","pinyin":"guangdong","spy":"gd","code":"30517","city":[{"name":"潮州","pinyin":"chaozhou","spy":"cz","code":"46008"},{"name":"东莞","pinyin":"dongguan","spy":"dg","code":"84746"},{"name":"佛山","pinyin":"foshan","spy":"fs","code":"31961"},{"name":"广州","pinyin":"guangzhou","spy":"gz","code":"29407"},{"name":"河源","pinyin":"heyuan","spy":"hy","code":"46003"},{"name":"惠州","pinyin":"huizhou","spy":"hz","code":"46000"},{"name":"江门","pinyin":"jiangmen","spy":"jm","code":"45996"},{"name":"揭阳","pinyin":"jieyang","spy":"jy","code":"46009"},{"name":"茂名","pinyin":"maoming","spy":"mm","code":"45998"},{"name":"梅州","pinyin":"meizhou","spy":"mz","code":"46001"},{"name":"清远","pinyin":"qingyuan","spy":"qy","code":"46005"},{"name":"韶关","pinyin":"shaoguan","spy":"sg","code":"45995"},{"name":"汕头","pinyin":"shantou","spy":"st","code":"45994"},{"name":"汕尾","pinyin":"shanwei","spy":"sw","code":"46002"},{"name":"深圳","pinyin":"shenzhen","spy":"sz","code":"29425"},{"name":"云浮","pinyin":"yunfu","spy":"yf","code":"46010"},{"name":"阳江","pinyin":"yangjiang","spy":"yj","code":"46004"},{"name":"珠海","pinyin":"zhuhai","spy":"zh","code":"31960"},{"name":"湛江","pinyin":"zhanjiang","spy":"zj","code":"45997"},{"name":"肇庆","pinyin":"zhaoqing","spy":"zq","code":"45999"},{"name":"中山","pinyin":"zhongshan","spy":"zs","code":"31962"}]},{"name":"甘肃","pinyin":"gansu","spy":"gs","code":"30505","city":[{"name":"白银","pinyin":"baiyin","spy":"by","code":"45985"},{"name":"敦煌","pinyin":"dunhuang","spy":"dh","code":"45989"},{"name":"定西","pinyin":"dingxi","spy":"dx","code":"45986"},{"name":"甘南","pinyin":"gannan","spy":"gn","code":"45992"},{"name":"金昌","pinyin":"jinchang","spy":"jc","code":"45979"},{"name":"酒泉","pinyin":"jiuquan","spy":"jq","code":"45982"},{"name":"嘉峪关","pinyin":"jiayuguan","spy":"jyg","code":"45978"},{"name":"陇南","pinyin":"longnan","spy":"ln","code":"45987"},{"name":"临夏","pinyin":"linxia","spy":"lx","code":"45990"},{"name":"兰州","pinyin":"lanzhou","spy":"lz","code":"29417"},{"name":"平凉","pinyin":"pingliang","spy":"pl","code":"45984"},{"name":"庆阳","pinyin":"qingyang","spy":"qy","code":"45983"},{"name":"天水","pinyin":"tianshui","spy":"ts","code":"45977"},{"name":"武威","pinyin":"wuwei","spy":"ww","code":"45980"},{"name":"张掖","pinyin":"zhangye","spy":"zy","code":"45981"}]},{"name":"广西","pinyin":"guangxi","spy":"gx","code":"30518","city":[{"name":"北海","pinyin":"beihai","spy":"bh","code":"38716"},{"name":"百色","pinyin":"baise","spy":"bs","code":"46018"},{"name":"崇左","pinyin":"chongzuo","spy":"cz","code":"46022"},{"name":"防城港","pinyin":"fangchenggang","spy":"fcg","code":"46014"},{"name":"贵港","pinyin":"guigang","spy":"gg","code":"46016"},{"name":"桂林","pinyin":"guilin","spy":"gl","code":"29408"},{"name":"河池","pinyin":"hechi","spy":"hc","code":"46020"},{"name":"贺州","pinyin":"hezhou","spy":"hz","code":"46019"},{"name":"来宾","pinyin":"laibin","spy":"lb","code":"46021"},{"name":"柳州","pinyin":"liuzhou","spy":"lz","code":"46012"},{"name":"南宁","pinyin":"nanning","spy":"nn","code":"29421"},{"name":"钦州","pinyin":"qinzhou","spy":"qz","code":"46015"},{"name":"梧州","pinyin":"wuzhou","spy":"wz","code":"46013"},{"name":"玉林","pinyin":"yulin","spy":"yl","code":"46017"}]},{"name":"贵州","pinyin":"guizhou","spy":"gz","code":"30516","city":[{"name":"安顺（黄果树瀑布）","pinyin":"anshun（huangguoshupubu）","spy":"as（hgspb）","code":"82719621"},{"name":"毕节","pinyin":"bijie","spy":"bj","code":"46029"},{"name":"贵阳","pinyin":"guiyang","spy":"gy","code":"29409"},{"name":"六盘水","pinyin":"liupanshui","spy":"lps","code":"46026"},{"name":"黔东南","pinyin":"qiandongnan","spy":"qdn","code":"110231"},{"name":"黔南","pinyin":"qiannan","spy":"qn","code":"110232"},{"name":"黔西南","pinyin":"qianxinan","spy":"qxn","code":"110230"},{"name":"铜仁","pinyin":"tongren","spy":"tr","code":"46027"},{"name":"遵义","pinyin":"zunyi","spy":"zy","code":"46024"}]},{"name":"湖北","pinyin":"hubei","spy":"hb","code":"30513","city":[{"name":"恩施","pinyin":"enshi","spy":"es","code":"46063"},{"name":"鄂州","pinyin":"ezhou","spy":"ez","code":"110236"},{"name":"黄冈","pinyin":"huanggang","spy":"hg","code":"110238"},{"name":"黄石","pinyin":"huangshi","spy":"hs","code":"110235"},{"name":"荆门","pinyin":"jingmen","spy":"jm","code":"46062"},{"name":"荆州","pinyin":"jingzhou","spy":"jz","code":"46058"},{"name":"十堰","pinyin":"shiyan","spy":"sy","code":"46061"},{"name":"随州","pinyin":"suizhou","spy":"sz","code":"110240"},{"name":"武汉","pinyin":"wuhan","spy":"wh","code":"29429"},{"name":"襄樊","pinyin":"xiangfan","spy":"xf","code":"46060"},{"name":"孝感","pinyin":"xiaogan","spy":"xg","code":"110237"},{"name":"咸宁","pinyin":"xianning","spy":"xn","code":"110239"},{"name":"宜昌","pinyin":"yichang","spy":"yc","code":"46059"}]},{"name":"河北","pinyin":"hebei","spy":"hb","code":"30499","city":[{"name":"保定","pinyin":"baoding","spy":"bd","code":"46040"},{"name":"承德","pinyin":"chengde","spy":"cd","code":"38717"},{"name":"沧州","pinyin":"cangzhou","spy":"cz","code":"110288"},{"name":"邯郸","pinyin":"handan","spy":"hd","code":"46042"},{"name":"衡水","pinyin":"hengshui","spy":"hs","code":"46041"},{"name":"廊坊","pinyin":"langfang","spy":"lf","code":"46039"},{"name":"秦皇岛","pinyin":"qinhuangdao","spy":"qhd","code":"46034"},{"name":"石家庄","pinyin":"shijiazhuang","spy":"sjz","code":"29426"},{"name":"唐山","pinyin":"tangshan","spy":"ts","code":"46037"},{"name":"邢台","pinyin":"xingtai","spy":"xt","code":"46036"},{"name":"张家口","pinyin":"zhangjiakou","spy":"zjk","code":"38744"}]},{"name":"黑龙江","pinyin":"heilongjiang","spy":"hlj","code":"30496","city":[{"name":"大庆","pinyin":"daqing","spy":"dq","code":"46055"},{"name":"大兴安岭","pinyin":"daxinganling","spy":"dxal","code":"110299"},{"name":"哈尔滨","pinyin":"haerbin","spy":"heb","code":"29410"},{"name":"鹤岗","pinyin":"hegang","spy":"hg","code":"110295"},{"name":"黑河","pinyin":"heihe","spy":"hh","code":"84742"},{"name":"佳木斯","pinyin":"jiamusi","spy":"jms","code":"84743"},{"name":"鸡西","pinyin":"jixi","spy":"jx","code":"110294"},{"name":"牡丹江","pinyin":"mudanjiang","spy":"mdj","code":"46054"},{"name":"齐齐哈尔","pinyin":"qiqihaer","spy":"qqhe","code":"46056"},{"name":"七台河","pinyin":"qitaihe","spy":"qth","code":"110297"},{"name":"绥化","pinyin":"suihua","spy":"sh","code":"110298"},{"name":"双鸭山","pinyin":"shuangyashan","spy":"sys","code":"110296"},{"name":"伊春","pinyin":"yichun","spy":"yc","code":"84744"}]},{"name":"湖南","pinyin":"hunan","spy":"hn","code":"30514","city":[{"name":"常德","pinyin":"changde","spy":"cd","code":"110224"},{"name":"长沙","pinyin":"changsha","spy":"cs","code":"29402"},{"name":"郴州","pinyin":"chenzhou","spy":"cz","code":"110226"},{"name":"怀化","pinyin":"huaihua","spy":"hh","code":"110228"},{"name":"衡阳（衡山）","pinyin":"hengyang（hengshan）","spy":"hy（hs）","code":"82718143"},{"name":"娄底","pinyin":"loudi","spy":"ld","code":"110229"},{"name":"邵阳","pinyin":"shaoyang","spy":"sy","code":"110222"},{"name":"湘潭","pinyin":"xiangtan","spy":"xt","code":"46067"},{"name":"湘西（凤凰古城）","pinyin":"xiangxi（fenghuanggucheng）","spy":"xx（fhgc）","code":"82718147"},{"name":"岳阳","pinyin":"yueyang","spy":"yy","code":"110223"},{"name":"益阳","pinyin":"yiyang","spy":"yy","code":"110225"},{"name":"永州","pinyin":"yongzhou","spy":"yz","code":"110227"},{"name":"张家界","pinyin":"zhangjiajie","spy":"zjj","code":"29436"},{"name":"株洲","pinyin":"zhuzhou","spy":"zz","code":"110220"}]},{"name":"海南","pinyin":"hainan","spy":"hn","code":"30520","city":[{"name":"海口","pinyin":"haikou","spy":"hk","code":"29411"},{"name":"三沙市","pinyin":"sanshashi","spy":"sss","code":"155258206"},{"name":"三亚","pinyin":"sanya","spy":"sy","code":"38732"},{"name":"五指山","pinyin":"wuzhishan","spy":"wzs","code":"57228"},{"name":"兴隆","pinyin":"xinglong","spy":"xl","code":"3278613"}]},{"name":"河南","pinyin":"henan","spy":"hn","code":"30500","city":[{"name":"安阳","pinyin":"anyang","spy":"ay","code":"110280"},{"name":"登封（少林寺）","pinyin":"dengfeng（shaolinsi）","spy":"df（sls）","code":"82717870"},{"name":"鹤壁","pinyin":"hebi","spy":"hb","code":"46051"},{"name":"焦作","pinyin":"jiaozuo","spy":"jz","code":"46052"},{"name":"开封","pinyin":"kaifeng","spy":"kf","code":"46045"},{"name":"漯河","pinyin":"luohe","spy":"lh","code":"131759"},{"name":"洛阳","pinyin":"luoyang","spy":"ly","code":"38729"},{"name":"南阳","pinyin":"nanyang","spy":"ny","code":"46048"},{"name":"平顶山","pinyin":"pingdingshan","spy":"pds","code":"57255"},{"name":"濮阳","pinyin":"puyang","spy":"py","code":"46047"},{"name":"三门峡","pinyin":"sanmenxia","spy":"smx","code":"110283"},{"name":"商丘","pinyin":"shangqiu","spy":"sq","code":"110284"},{"name":"许昌","pinyin":"xuchang","spy":"xc","code":"110281"},{"name":"新乡","pinyin":"xinxiang","spy":"xx","code":"46046"},{"name":"信阳","pinyin":"xinyang","spy":"xy","code":"110285"},{"name":"周口","pinyin":"zhoukou","spy":"zk","code":"110286"},{"name":"驻马店","pinyin":"zhumadian","spy":"zmd","code":"110287"},{"name":"郑州","pinyin":"zhengzhou","spy":"zz","code":"29437"}]},{"name":"吉林","pinyin":"jilin","spy":"jl","code":"30497","city":[{"name":"白城","pinyin":"baicheng","spy":"bc","code":"110293"},{"name":"白山（长白山）","pinyin":"baishan（zhangbaishan）","spy":"bs（zbs）","code":"82717105"},{"name":"长春","pinyin":"changchun","spy":"cc","code":"29401"},{"name":"吉林","pinyin":"jilin","spy":"jl","code":"30497"},{"name":"辽源","pinyin":"liaoyuan","spy":"ly","code":"110290"},{"name":"四平","pinyin":"siping","spy":"sp","code":"110289"},{"name":"松原","pinyin":"songyuan","spy":"sy","code":"110292"},{"name":"通化","pinyin":"tonghua","spy":"th","code":"110291"},{"name":"延边","pinyin":"yanbian","spy":"yb","code":"84745"}]},{"name":"江苏","pinyin":"jiangsu","spy":"js","code":"30511","city":[{"name":"常州","pinyin":"changzhou","spy":"cz","code":"31949"},{"name":"淮安","pinyin":"huaian","spy":"ha","code":"46092"},{"name":"连云港","pinyin":"lianyungang","spy":"lyg","code":"31951"},{"name":"南京","pinyin":"nanjing","spy":"nj","code":"29420"},{"name":"南通","pinyin":"nantong","spy":"nt","code":"31948"},{"name":"宿迁","pinyin":"suqian","spy":"sq","code":"108722"},{"name":"苏州","pinyin":"suzhou","spy":"sz","code":"30378"},{"name":"泰州","pinyin":"taizhou","spy":"tz","code":"46084"},{"name":"无锡","pinyin":"wuxi","spy":"wx","code":"31947"},{"name":"徐州","pinyin":"xuzhou","spy":"xz","code":"31950"},{"name":"盐城","pinyin":"yancheng","spy":"yc","code":"46085"},{"name":"扬州","pinyin":"yangzhou","spy":"yz","code":"46078"},{"name":"镇江","pinyin":"zhenjiang","spy":"zj","code":"46079"}]},{"name":"江西","pinyin":"jiangxi","spy":"jx","code":"30512","city":[{"name":"抚州","pinyin":"fuzhou","spy":"fz","code":"110246"},{"name":"赣州","pinyin":"ganzhou","spy":"gz","code":"110243"},{"name":"吉安（井冈山）","pinyin":"jian（jinggangshan）","spy":"ja（jgs）","code":"82717706"},{"name":"景德镇","pinyin":"jingdezhen","spy":"jdz","code":"46073"},{"name":"九江","pinyin":"jiujiang","spy":"jj","code":"46072"},{"name":"南昌 NANCHANG","pinyin":"nanchang NANCHANG","spy":"nc NANCHANG","code":"38730"},{"name":"萍乡","pinyin":"pingxiang","spy":"px","code":"46076"},{"name":"上饶(婺源)","pinyin":"shangrao(wuyuan)","spy":"sr(wy)","code":"46074"},{"name":"新余","pinyin":"xinyu","spy":"xy","code":"110241"},{"name":"宜春","pinyin":"yichun","spy":"yc","code":"110245"},{"name":"鹰潭","pinyin":"yingtan","spy":"yt","code":"110242"}]},{"name":"辽宁","pinyin":"liaoning","spy":"ln","code":"30498","city":[{"name":"鞍山","pinyin":"anshan","spy":"as","code":"46104"},{"name":"本溪","pinyin":"benxi","spy":"bx","code":"46106"},{"name":"朝阳","pinyin":"chaoyang","spy":"cy","code":"46110"},{"name":"丹东","pinyin":"dandong","spy":"dd","code":"46103"},{"name":"大连","pinyin":"dalian","spy":"dl","code":"29405"},{"name":"抚顺","pinyin":"fushun","spy":"fs","code":"46107"},{"name":"阜新","pinyin":"fuxin","spy":"fx","code":"46109"},{"name":"葫芦岛","pinyin":"huludao","spy":"hld","code":"46099"},{"name":"锦州","pinyin":"jinzhou","spy":"jz","code":"46100"},{"name":"辽阳","pinyin":"liaoyang","spy":"ly","code":"46105"},{"name":"盘锦","pinyin":"panjin","spy":"pj","code":"46101"},{"name":"沈阳","pinyin":"shenyang","spy":"sy","code":"29424"},{"name":"铁岭","pinyin":"tieling","spy":"tl","code":"46108"},{"name":"营口","pinyin":"yingkou","spy":"yk","code":"46102"}]},{"name":"内蒙古","pinyin":"neimenggu","spy":"nmg","code":"30495","city":[{"name":"阿拉善盟","pinyin":"alashanmeng","spy":"alsm","code":"131754"},{"name":"包头","pinyin":"baotou","spy":"bt","code":"46112"},{"name":"巴彦淖尔","pinyin":"bayannaoer","spy":"byne","code":"46118"},{"name":"赤峰","pinyin":"chifeng","spy":"cf","code":"46114"},{"name":"鄂尔多斯","pinyin":"eerduosi","spy":"eeds","code":"46116"},{"name":"呼和浩特","pinyin":"huhehaote","spy":"hhht","code":"29414"},{"name":"呼伦贝尔","pinyin":"hulunbeier","spy":"hlbe","code":"46117"},{"name":"通辽","pinyin":"tongliao","spy":"tl","code":"46115"},{"name":"乌海","pinyin":"wuhai","spy":"wh","code":"46113"},{"name":"乌兰察布","pinyin":"wulanchabu","spy":"wlcb","code":"46119"},{"name":"兴安盟","pinyin":"xinganmeng","spy":"xam","code":"131752"},{"name":"锡林郭勒盟","pinyin":"xilinguolemeng","spy":"xlglm","code":"131753"}]},{"name":"宁夏","pinyin":"ningxia","spy":"nx","code":"30507","city":[{"name":"固原","pinyin":"guyuan","spy":"gy","code":"46123"},{"name":"石嘴山","pinyin":"shizuishan","spy":"szs","code":"46121"},{"name":"吴忠","pinyin":"wuzhong","spy":"wz","code":"46122"},{"name":"银川","pinyin":"yinchuan","spy":"yc","code":"29434"},{"name":"中卫","pinyin":"zhongwei","spy":"zw","code":"46124"}]},{"name":"青海","pinyin":"qinghai","spy":"qh","code":"30504","city":[{"name":"果洛","pinyin":"guoluo","spy":"gl","code":"110272"},{"name":"海北","pinyin":"haibei","spy":"hb","code":"110270"},{"name":"海东","pinyin":"haidong","spy":"hd","code":"46126"},{"name":"黄南","pinyin":"huangnan","spy":"hn","code":"110271"},{"name":"海南","pinyin":"hainan","spy":"hn","code":"30520"},{"name":"海西","pinyin":"haixi","spy":"hx","code":"110274"},{"name":"西宁","pinyin":"xining","spy":"xn","code":"29433"},{"name":"玉树","pinyin":"yushu","spy":"ys","code":"110273"}]},{"name":"四川","pinyin":"sichuan","spy":"sc","code":"30508","city":[{"name":"阿坝州（九寨沟）","pinyin":"abazhou（jiuzhaigou）","spy":"abz（jzg）","code":"82719357"},{"name":"巴中","pinyin":"bazhong","spy":"bz","code":"110260"},{"name":"成都","pinyin":"chengdou","spy":"cd","code":"29403"},{"name":"德阳","pinyin":"deyang","spy":"dy","code":"46173"},{"name":"达州","pinyin":"dazhou","spy":"dz","code":"110257"},{"name":"广安","pinyin":"guangan","spy":"ga","code":"110256"},{"name":"广元","pinyin":"guangyuan","spy":"gy","code":"46175"},{"name":"甘孜州","pinyin":"ganzizhou","spy":"gzz","code":"3297267"},{"name":"乐山","pinyin":"leshan","spy":"ls","code":"38726"},{"name":"凉山州","pinyin":"liangshanzhou","spy":"lsz","code":"3297268"},{"name":"泸州","pinyin":"luzhou","spy":"lz","code":"46172"},{"name":"眉山","pinyin":"meishan","spy":"ms","code":"82719356"},{"name":"绵阳","pinyin":"mianyang","spy":"my","code":"46174"},{"name":"南充","pinyin":"nanchong","spy":"nc","code":"110254"},{"name":"内江","pinyin":"neijiang","spy":"nj","code":"46177"},{"name":"攀枝花","pinyin":"panzhihua","spy":"pzh","code":"46171"},{"name":"遂宁","pinyin":"suining","spy":"sn","code":"46176"},{"name":"雅安","pinyin":"yaan","spy":"ya","code":"110259"},{"name":"宜宾","pinyin":"yibin","spy":"yb","code":"110255"},{"name":"自贡","pinyin":"zigong","spy":"zg","code":"46170"},{"name":"资阳","pinyin":"ziyang","spy":"zy","code":"110261"}]},{"name":"山东","pinyin":"shandong","spy":"sd","code":"30501","city":[{"name":"滨州","pinyin":"binzhou","spy":"bz","code":"46144"},{"name":"东营","pinyin":"dongying","spy":"dy","code":"46136"},{"name":"德州","pinyin":"dezhou","spy":"dz","code":"46138"},{"name":"菏泽","pinyin":"heze","spy":"hz","code":"46142"},{"name":"济南","pinyin":"jinan","spy":"jn","code":"29415"},{"name":"济宁","pinyin":"jining","spy":"jn","code":"110278"},{"name":"聊城","pinyin":"liaocheng","spy":"lc","code":"46143"},{"name":"莱芜","pinyin":"laiwu","spy":"lw","code":"110279"},{"name":"临沂","pinyin":"linyi","spy":"ly","code":"46137"},{"name":"青岛","pinyin":"qingdao","spy":"qd","code":"29422"},{"name":"日照","pinyin":"rizhao","spy":"rz","code":"46141"},{"name":"泰安（泰山）","pinyin":"taian（taishan）","spy":"ta（ts）","code":"82717789"},{"name":"潍坊","pinyin":"weifang","spy":"wf","code":"46134"},{"name":"威海","pinyin":"weihai","spy":"wh","code":"38734"},{"name":"烟台","pinyin":"yantai","spy":"yt","code":"38738"},{"name":"淄博","pinyin":"zibo","spy":"zb","code":"46135"},{"name":"枣庄","pinyin":"zaozhuang","spy":"zz","code":"110277"}]},{"name":"上海","pinyin":"shanghai","spy":"sh","code":"29423"},{"name":"山西","pinyin":"shanxi","spy":"sx","code":"30502","city":[{"name":"长治","pinyin":"changzhi","spy":"cz","code":"46153"},{"name":"大同","pinyin":"datong","spy":"dt","code":"46150"},{"name":"晋城","pinyin":"jincheng","spy":"jc","code":"46154"},{"name":"晋中","pinyin":"jinzhong","spy":"jz","code":"110275"},{"name":"临汾","pinyin":"linfen","spy":"lf","code":"46155"},{"name":"吕梁","pinyin":"lu:liang","spy":"ll","code":"110276"},{"name":"平遥","pinyin":"pingyao","spy":"py","code":"8517582"},{"name":"朔州","pinyin":"shuozhou","spy":"sz","code":"46158"},{"name":"太原","pinyin":"taiyuan","spy":"ty","code":"29427"},{"name":"忻州","pinyin":"xinzhou","spy":"xz","code":"46159"},{"name":"运城","pinyin":"yuncheng","spy":"yc","code":"46157"},{"name":"阳泉","pinyin":"yangquan","spy":"yq","code":"46151"}]},{"name":"陕西","pinyin":"shanxi","spy":"sx","code":"30503","city":[{"name":"安康","pinyin":"ankang","spy":"ak","code":"46167"},{"name":"宝鸡","pinyin":"baoji","spy":"bj","code":"46162"},{"name":"汉中","pinyin":"hanzhong","spy":"hz","code":"46165"},{"name":"商洛","pinyin":"shangluo","spy":"sl","code":"46168"},{"name":"铜川","pinyin":"tongchuan","spy":"tc","code":"46161"},{"name":"渭南（华山）","pinyin":"weinan（huashan）","spy":"wn（hs）","code":"82720044"},{"name":"西安","pinyin":"xian","spy":"xa","code":"29432"},{"name":"咸阳","pinyin":"xianyang","spy":"xy","code":"46163"},{"name":"延安","pinyin":"yanan","spy":"ya","code":"38739"},{"name":"榆林","pinyin":"yulin","spy":"yl","code":"46166"}]},{"name":"天津","pinyin":"tianjin","spy":"tj","code":"29428"},{"name":"新疆","pinyin":"xinjiang","spy":"xj","code":"30506","city":[{"name":"阿克苏","pinyin":"akesu","spy":"aks","code":"46189"},{"name":"阿勒泰","pinyin":"aletai","spy":"alt","code":"46197"},{"name":"博尔塔拉","pinyin":"boertala","spy":"betl","code":"110268"},{"name":"巴音郭楞","pinyin":"bayinguoleng","spy":"bygl","code":"110266"},{"name":"昌吉","pinyin":"changji","spy":"cj","code":"110267"},{"name":"哈密","pinyin":"hami","spy":"hm","code":"46187"},{"name":"和田","pinyin":"hetian","spy":"ht","code":"46188"},{"name":"克拉玛依","pinyin":"kelamayi","spy":"klmy","code":"46186"},{"name":"喀什","pinyin":"kashen","spy":"ks","code":"46190"},{"name":"克孜勒苏","pinyin":"kezilesu","spy":"kzls","code":"110265"},{"name":"塔城","pinyin":"tacheng","spy":"tc","code":"46196"},{"name":"吐鲁番","pinyin":"tulufan","spy":"tlf","code":"38733"},{"name":"乌鲁木齐","pinyin":"wulumuqi","spy":"wlmq","code":"29430"},{"name":"伊犁","pinyin":"yili","spy":"yl","code":"20328"}]},{"name":"西藏","pinyin":"xizang","spy":"xz","code":"27009","city":[{"name":"阿里","pinyin":"ali","spy":"al","code":"46183"},{"name":"昌都","pinyin":"changdou","spy":"cd","code":"46179"},{"name":"拉萨","pinyin":"lasa","spy":"ls","code":"29418"},{"name":"林芝","pinyin":"linzhi","spy":"lz","code":"46184"},{"name":"那曲","pinyin":"neiqu","spy":"nq","code":"46182"},{"name":"日喀则","pinyin":"rikaze","spy":"rkz","code":"46181"},{"name":"山南","pinyin":"shannan","spy":"sn","code":"46180"}]},{"name":"云南","pinyin":"yunnan","spy":"yn","code":"30515","city":[{"name":"KPC/昆明","pinyin":"KPC/kunming","spy":"KPC/km","code":"29416"},{"name":"保山","pinyin":"baoshan","spy":"bs","code":"46201"},{"name":"楚雄","pinyin":"chuxiong","spy":"cx","code":"46207"},{"name":"德宏","pinyin":"dehong","spy":"dh","code":"46208"},{"name":"大理","pinyin":"dali","spy":"dl","code":"38718"},{"name":"迪庆（香格里拉）","pinyin":"diqing（xianggelila）","spy":"dq（xgll）","code":"82719678"},{"name":"红河","pinyin":"honghe","spy":"hh","code":"46206"},{"name":"临沧","pinyin":"lincang","spy":"lc","code":"46204"},{"name":"泸沽湖","pinyin":"luguhu","spy":"lgh","code":"17955681"},{"name":"丽江","pinyin":"lijiang","spy":"lj","code":"29419"},{"name":"怒江","pinyin":"nujiang","spy":"nj","code":"110234"},{"name":"普洱","pinyin":"puer","spy":"pe","code":"110233"},{"name":"曲靖","pinyin":"qujing","spy":"qj","code":"46199"},{"name":"文山","pinyin":"wenshan","spy":"ws","code":"46205"},{"name":"西双版纳","pinyin":"xishuangbanna","spy":"xsbn","code":"38736"},{"name":"玉溪","pinyin":"yuxi","spy":"yx","code":"46200"},{"name":"昭通","pinyin":"zhaotong","spy":"zt","code":"46202"}]},{"name":"浙江","pinyin":"zhejiang","spy":"zj","code":"30510","city":[{"name":"Cheerday/千岛湖","pinyin":"Cheerday/qiandaohu","spy":"Cheerday/qdh","code":"57362"},{"name":"杭州","pinyin":"hangzhou","spy":"hz","code":"29412"},{"name":"湖州","pinyin":"huzhou","spy":"hz","code":"31955"},{"name":"金华","pinyin":"jinhua","spy":"jh","code":"31953"},{"name":"嘉兴（乌镇/西塘）","pinyin":"jiaxing（wuzhen/xitang）","spy":"jx（wz/xt）","code":"31956"},{"name":"丽水","pinyin":"lishui","spy":"ls","code":"31959"},{"name":"宁波","pinyin":"ningbo","spy":"nb","code":"30379"},{"name":"衢州","pinyin":"quzhou","spy":"qz","code":"46210"},{"name":"绍兴","pinyin":"shaoxing","spy":"sx","code":"31954"},{"name":"台州","pinyin":"taizhou","spy":"tz","code":"31958"},{"name":"温州（雁荡山）","pinyin":"wenzhou（yandangshan）","spy":"wz（yds）","code":"82717293"},{"name":"舟山（普陀山）","pinyin":"zhoushan（putuoshan）","spy":"zs（pts）","code":"82717294"}]}];

	return data;
});
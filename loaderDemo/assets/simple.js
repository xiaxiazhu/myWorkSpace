window.g_config = window.g_config || {};
window.g_config.assetsServer = window.g_config.assetsServer || function () {
    var e = document.getElementsByTagName("script"),
        s = e[e.length - 1].src.match(/http:\/\/.*?\//);
    return s && s[0]
}() || "http://g.tbcdn.cn/";

KISSY.config({
    moudles:{
        kissy: {
            path: "kissy-min.js"
        },
        seed: {
            path: "seed-min.js"
        },
        "mui/review-mz/1.0.0/mod":{
            requires:['mui/review-mz/1.0.0/mod.css'],
            path:"mui/review-mz/1.0.0/mod.js"
        }
    },
    version:"1.0.0"
});

KISSY.config({
        packages: {
        "mui":{
            combine:false,
            tag: "20110323",//时间戳, 添加在动态脚本路径后面, 用于更新包内模块代码
            path:"http://g.tbcdn.cn/",
            // path:"localhost",
            // base: "./assets/module_package", //包对应路径, 相对路径指相对于当前页面路径
            charset: "gbk" //包里模块文件编码格式
        }
    }
});

KISSY.config(window.g_config);


KISSY.use('core', function (S) {
    KISSY.one("#k12").on("click", function () {
        KISSY.use("mui/review-mz/1.0.0/mod", function (S, Mod) {
            alert(Mod);
        });
    });
});
// KISSY.config({
//     "modules": {
//         "kissyDemo/amoudle": {
//             "requires": [
//                 "sizzle",
//                 "ajax"
//             ]
//         }
//     },
//     "packages": {
//         "kissyDemo": {
//             "path": "http://g.tbcdn.cn/tm/fuwu-ws/1.0.7/",
//             "ignorePackageNameInUri": true,
//             "debug": true
//         }
//     }
// });


KISSY.config({
    packages: [
        {
            name: "kissyDemo", //包名
            tag: "2013",//时间戳, 添加在动态脚本路径后面, 用于更新包内模块代码
            path: "./js/", //包对应路径, 相对路径指相对于当前页面路径
            charset: "utf-8" //包里模块文件编码格式
        }
    ]
});
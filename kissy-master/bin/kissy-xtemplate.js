#!/usr/bin/env node
//noinspection JSUnresolvedFunction,JSUnresolvedVariable
/**
 * Generate xtemplate function by xtemplate file using kissy xtemplate.
 * @author yiminghe@gmail.com
 */
var program = require('../tools/commander/');
program
    .option('-n, --package-name <packageName>', 'Set kissy package name')
    .option('-p, --package-path <packagePath>', 'Set kissy package path')
    .option('-e, --encoding [encoding]', 'Set xtemplate file encoding', 'utf-8')
    .option('-w, --watch', 'Watch xtemplate file change')
    .option('-k, --kissy', 'Set kissy src module format')
    .parse(process.argv);

var S = require('../build/kissy-nodejs'),
    chokidar = require('chokidar'),
    js_beautify = require('js-beautify').js_beautify,
    fs = require('fs'),
    path = require('path'),
    packageName = program.packageName,
    packagePath = program.packagePath,
    encoding = program.encoding,
    cwd = process.cwd();

if (program.kissy) {
    var slashIndex = packageName.lastIndexOf('/');
    if (slashIndex === -1) {
        packageName = '';
    } else {
        packageName = packageName.slice(0, slashIndex + 1);
    }
} else {
    packageName += '/';
}

packagePath = path.resolve(cwd, packagePath);

var codeTemplate = '' +
    '/*\n' +
    '  Generated by kissy-xtemplate.' +
    '*/\n' +
    'KISSY.add(\'{module}\', function(){\n' +
    'return {code}\n' +
    '});';
var tplTemplate = '' +
    '/*\n' +
    '  Generated by kissy-tpl2mod.' +
    '*/\n' +
    'KISSY.add(\'{module}\',\'{code}\');';

function normalizeSlash(str) {
    return str.replace(/\\/g, '/');
}

function my_js_beautify(str) {
    var opts = {"indent_size": "4", "indent_char": " ",
        "preserve_newlines": true, "brace_style": "collapse",
        "keep_array_indentation": false, "space_after_anon_function": true};
    return js_beautify(str, opts);
}

S.use('xtemplate/compiler', function (S, XTemplateCompiler) {
    function compile(name, tpl, modulePath) {
        var tplContent = fs.readFileSync(tpl, encoding);
        var code = XTemplateCompiler.compileToStr(tplContent);
        var moduleCode = my_js_beautify(S.substitute(codeTemplate, {
            module: name,
            code: code
        }));
        fs.writeFileSync(modulePath, moduleCode, encoding);
        console.info('generate xtpl module: ' + modulePath + ' at ' + (new Date().toLocaleString()));
    }

    function process(filePath) {
        if (S.endsWith(filePath, '.xtpl.html')) {
            var name = normalizeSlash(packageName + path.relative(packagePath, filePath));
            name = name.replace(/\.xtpl\.html$/, '-xtpl');
            var modulePath = filePath.replace(/\.xtpl\.html$/, '-xtpl.js');
            compile(name, filePath, modulePath);
        } else if (S.endsWith(filePath, '.tpl.html')) {
            name = normalizeSlash(packageName + path.relative(packagePath, filePath));
            name = name.replace(/\.tpl\.html$/, '-tpl');
            modulePath = filePath.replace(/\.tpl\.html$/, '-tpl.js');
            var tplContent = fs.readFileSync(filePath, encoding);
            tplContent = tplContent.replace(/\\/g, "\\")
                .replace(/\r?\n/g, "\\n")
                .replace(/'/g, "\\'");
            var moduleCode = my_js_beautify(S.substitute(tplTemplate, {
                module: name,
                code: tplContent
            }));
            fs.writeFileSync(modulePath, moduleCode, encoding);
            console.info('generate tpl module: ' + modulePath + ' at ' + (new Date().toLocaleString()));
        }
    }

    if (program.watch) {
        var watcher = chokidar.watch(packagePath, {ignored: /^\./, persistent: true});
        watcher.on('add', process).on('change', process);
        watcher.close();
    } else {
        var walk = require('walk');
        //noinspection JSUnresolvedFunction
        var walker = walk.walk(packagePath);
        walker.on("file", function (root, fileStats, next) {
            var filePath = normalizeSlash(root + '/' + fileStats.name);
            process(filePath);
            next();
        });
    }
});
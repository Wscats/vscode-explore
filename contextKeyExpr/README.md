# 启动

安装依赖，运行 webpack 编译项目。
```bash
npm i
webpack
```
打开 dist/index.html 在浏览器中运行。

# 配置文件

配置文件：
- src/sheetbar.json
- src/toolbar.json

```json
{
    "name": "toolbarConfig",
    "displayName": "腾讯文档工具栏",
    "description": "工具栏",
    "version": "1.0.0",
    "publisher": "tencent",
    "license": "MIT",
    "contributes": {
        "toolbar": [
            {
                "command": "undo",
                "component": "undo",
                "isMore": true,
                "canEdit": true,
                "when": "window.innerWidth < 855  || window.innerWidth < 1440 && window.innerWidth >= 855 || window.innerWidth >= 1440"
            },
            {
                "command": "redo",
                "component": "redo",
                "isMore": true,
                "canEdit": true,
                "when": "window.innerWidth >= 900 && isMore == false"
            },
            {
                "command": "format",
                "component": "format",
                "isMore": true,
                "canEdit": true,
                "when": "window.innerWidth >= 900 && isMore == true"
            },
            {
                "command": "clear-format",
                "component": "clear-format",
                "isMore": true,
                "canEdit": true,
                "when": "window.innerWidth >= 900 && isMore == false"
            },
            {
                "command": "insert-group",
                "component": "insert-group",
                "isMore": true,
                "canEdit": true,
                "when": "window.innerWidth >= 900 && isMore == false"
            }
        ]
    }
}
```

# 作用域
更改 json 文件中 when 的条件表达式，

```js
"when": "window.innerWidth >= 900 && isMore == false"
```

在 src/index.ts 中使用 setConfig 方法读取 json 配置文件，并设置好对应的 context，可以控制 toolbar 的显示或者隐藏。
```js
import toolbarJson from './toolbar.json';
import sheetbarJson from './sheetbar.json';
Contributes.setContribute({
    name: 'toolbar',
    json: toolbarJson,
    // 局部作用域
    contextOptions: {
        'isMore': true,
        'platform': 'pc',
        'window.innerWidth': window.innerWidth,
        'SpreadsheetApp.sheetStatus.rangesStatus.status.canEdit': true,
    }
});

Contributes.setContribute({
    name: 'sheetbar',
    json: sheetbarJson,
    // 局部作用域
    contextOptions: {
        'platform': 'pc',
        'window.innerWidth': window.innerWidth,
        'SpreadsheetApp.sheetStatus.rangesStatus.status.canEdit': true,
        1: 1
    }
});
```

更新作用域

```js
Contributes.updateContribute({
    name: 'toolbar',
    contextOptions: {
        'isMore': false,
        'window.innerWidth': window.innerWidth,
    }
})
```
在大型前端项目中，我们经常为了配置组件，UI等渲染，会产生很多条件判断逻辑，那如何把这些逻辑统一接口实现配置化，提高模块开发效率是我们值得去思考的一个问题。

# 场景

在我们腾讯文档项目中，我们常用的顶部工具栏会根据编辑权限，屏幕宽度，设备等场景配置对应的显示内容。


![image](https://user-images.githubusercontent.com/17243165/97416418-60a61d80-1941-11eb-9dfc-6bc7e2b58793.png)


![image](https://user-images.githubusercontent.com/17243165/97416531-83383680-1941-11eb-95ad-27ae329bb5a0.png)

我们的菜单或者底部栏，某些时间段内需要出现引导用户的红点，子菜单栏在某些交互行为下显示不同内容项，切换英文的时候菜单栏内容变更为中文等。

![image](https://user-images.githubusercontent.com/17243165/97447349-6ebc6400-196a-11eb-8293-f6963d5dc5cc.png)

上述的这些场景会导致我们的业务代码会高几率出现下面类似的写法，大量的条件判断等，如果后续需要更改条件或者增加条件，都需要在大量的条件判断里面去补充逻辑，并且工具栏的显示效果可能会根据不同业务场景改变外观，比如图标，排序和样式，那么每次第三方接入或者运营想额外配置都需要开发人员在代码里面做修改，这显然是不利于维护和低效的。

```ts
const PcToolbarButtonConfig = ['undo', 'redo', 'format', 'clear-format'];
const PcFullToolbarButtonConfig = ['undo', 'redo'];
const PcShortToolbarButtonConfig = ['undo'];
const PcShortToolbarButtonReadonlyConfig = ['undo', 'redo', 'format'];

switch (true) {
    case window.innerWidth < 1440 && window.innerWidth >= 855:
        if (isMore) null;
        return canEdit ? PcToolbarButtonConfig : PcToolbarButtonReadonlyConfig;
    case window.innerWidth < 855:
        if (isMore) null;
        return canEdit ? PcShortToolbarButtonConfig : PcShortToolbarButtonReadonlyConfig;
}
return canEdit ? PcFullToolbarButtonConfig : PcFullToolbarButtonReadonlyConfig;
```

# 思考

那么我们应该如何解决呢，从 Vscode 中找到了灵感，Vscode 在开发自定义插件的时候，可以对 Vscode 做自定义配置，从官网中我们看到它使用的是一份 `package.json` 里面定义了一个 `contributes` 属性，传入了一个对象，它就会在编辑器的右上角出现一个新的可点击功能图标。

```js
"contributes": {
    "menus": {
        "editor/title": [
            {
                "when": "resourceLangId == markdown",
                "command": "markdown.showPreview",
                "alt": "markdown.showPreviewToSide",
                "group": "navigation"
            }
        ]
    }
}
```

如下图所示，而这个图标出现的位置也是根据配置项决定的，注意里面有个 when 的条件语句，其实就是当打开的这个文件是 markdown 的时候，条件判断为真，图标就出现了。

![image](https://user-images.githubusercontent.com/17243165/97421225-3a837c00-1947-11eb-951d-ab48a0f58bfe.png)

既然 Vscode 支持利用插件加载配置文件来配置编辑器的显示功能，那么我们其实同样也可以使用这个思路来对我们的工具栏进行配置。

下面我们就详细讲解 Vscode 的插件机制，并利用它的思路实现一个属于我们自己腾讯文档UI可配置化的机制，Vscode 提供了一个 ExtensionsRegistry 的实例，该实例下有两个关键的方法：

- ExtensionsRegistry.registerExtensionPoint
- ExtensionsRegistry.getExtensionPoints

首先使用 `ExtensionsRegistry.registerExtensionPoint` 去注册一个配置项 `menus`，当注册成功后回用 `setHandler` 设置一个回调去处理后面将要读到的配置参数，紧接着使用 `ExtensionsRegistry.getExtensionPoints` 就可以把插件下所有的 `package.json` 扫描一遍，并配合刚才的 `setHandler` 回调把所有 `contributes` 里面的 `menu` 参数解析出来存到 `MenuRegistry` 里面。

```js
ExtensionsRegistry.registerExtensionPoint<{ [loc: string]: schema.IUserFriendlyMenuItem[] }>({
	extensionPoint: 'menus',
	jsonSchema: schema.menusContribution
}).setHandler(extensions => {
    for (const extension of extensions) {
        const { value } = extension;
        for (const command of value) {
            MenuRegistry.addCommands(command);
        }
    }
})
```

如果你想自定义一个配置项，让 Vscode 成功扫描并解析成功，那么你就可以根据上面的思路，结合下图来配置，先使用 `ExtensionsRegistry.registerExtensionPoint({ extensionPoint: 'toolbars' }).setHandler(callback)` 注册配置项 `toolbars` 并设置一个回调函数解析参数，然后使用 `ExtensionsRegistry.getExtensionPoints` 扫描就可以把`contributes` 里面的 `toolbars` 参数解析出来存到 `ToolbarRegistry` 里面，然后使用 `ToolbarRegistry` 解析好的参数来渲染或者更新 Vscode 的视图。

![image](https://user-images.githubusercontent.com/17243165/97437994-2fd4e100-195f-11eb-85d2-4738b3144dbd.png)

这里会提供 `jsonSchema` 去校验扫描的参数是否符合规范，如果不规范会有警告提醒并忽略非法的配置参数，所以当开放配置文件给第三方开发者我们也可以很放心的让其自由定制，我们就无需担心配置参数对代码构成严重影响。

```js
export namespace jsonSchema {
    export function isValidCommand(command: IUserFriendlyCommand, collector: ExtensionMessageCollector): boolean {
        if (!command) {
            collector.error(localize('nonempty', "expected non-empty value."));
            return false;
        }
        if (typeof command.command !== 'string') {
            collector.error(localize('requirestring', "property `{0}` is mandatory and must be of type `string`", 'command'));
            return false;
        }
}
```

# 表达式解析器

当然上面的介绍所有的操作本质其实就是解析一份 JSON 配置文件并提供校验，那么实际还有更多的“隐藏”功能，我们上面说到，我们腾讯文档的顶部工具栏会根据编辑权限，屏幕宽度，设备等场景配置对应的显示内容，在业务代码中会让我们出现大量的条件判断逻辑：

```js
switch (true) {
    case window.innerWidth < 1440 && window.innerWidth >= 855:
        if (isMore) null;
        return canEdit ? PcToolbarButtonConfig : PcToolbarButtonReadonlyConfig;
    case window.innerWidth < 855:
        if (isMore) null;
        return canEdit ? PcShortToolbarButtonConfig : PcShortToolbarButtonReadonlyConfig;
}
```

我们可以使用上面的插件机制去规避这种问题，比如改写成这样的形式可以更直观：

```js
"contributes": {
    "toolbars": [
        {
            "command": "undo",
            "component": "Redobutton",
            "icon": "undo",
            "when": "canEdit == true && window.innerWidth < 1080 && window.innerWidth >= 855"
        },
        {
            "command": "redo",
            "icon": "redo",
            "when": "platform == pc && window.innerWidth < 855 && isMore == true"
        }
    ]
}
```

当我们工具栏的 UI 视图需要定制化的时候，我们只需要少量变动我们的配置文件就可以打到目的，第三方开发者也可以根据自己的需求来定制化属于他们自己的工具栏，菜单和底部栏等。

这种方案本质其实是使用 `"when": "canEdit == true && window.innerWidth < 1080 && window.innerWidth >= 855"` 来代替各种复杂的条件语句，**Vscode 的插件机制就使用了这种方案来实现配置文件对 UI 视图的绑定**。

![image](https://user-images.githubusercontent.com/17243165/97444408-133ca700-1967-11eb-8e91-6a5d4ff9d5ba.png)

要实现这种方案本质其实就是把 `when: xxx` 这种配置参数解析为一个布尔值，Vscode 为了实现这个目的，在内部自己实现了一个**简单的表达式解析器**，目前支持以下表达式：

- 支持变量
- 支持常量：布尔值、数字、字符串
- 支持正则
- 支持全等（===）、不等（!==）
- 支持与（&&）、或（||）

Vscode 只实现了上面这些简单的表达式解析就很好的支持了上万个插件的配置，那说明上面这些解析器正常情况是够用的，也是 Vscode 鼓励我们去使用的规范。

![image](https://user-images.githubusercontent.com/17243165/97446950-fce41a80-1969-11eb-93a3-66280e848605.png)

我们如果自己实现一个复杂点的解析器，可以考虑支持以下表达式。

- 不支持加法（+）、减法（-）、乘法（*）、除法（/）、取余（%）运算
- 不支持大于（>）、小于（<）、大于等于（>=）、小于等于（<=）等比较运算
- 不支持非（!）等逻辑运算
- 不支持括号（）

注意大于和小于均不支持，所有我们刚才 `"when": "canEdit == true && window.innerWidth < 1080 && window.innerWidth >= 855"` 这类写法我们是不支持，需要自己拓展，在腾讯文档的插件机制里面是支持这部分的。

这里简单说下思路，我们可以封装一个 `deserialize` 方法去解析 `"when": "canEdit == true || platform == pc && window.innerWidth >= 1080"` 这段字符串，里面涉及了 `==，&&，>=` 三个表达式的解析，使用 `indexOf` 和 `split` 进行分词，一般切割成三部分，key、type 和 value，特殊情况 `canEdit == true`，只要有 key 和 value 即可。

```js
private static deserialize(serializedOne: string, strict: boolean): ContextKeyExpression {
	if (serializedOne.indexOf('>=') >= 0) {
		let pieces = serializedOne.split('>=');
		return ContextKeyGreaterOrEqualsExpr.create(pieces[0].trim(), this._deserializeValue(pieces[1], strict));
	}
	if (serializedOne.indexOf('<') >= 0) {
		let pieces = serializedOne.split('<');
		return ContextKeyLessExpr.create(pieces[0].trim(), this._deserializeValue(pieces[1], strict));
	}
	return ContextKeyDefinedExpr.create(serializedOne);
}
```
最终 when 会被解析为这种树结构，type 是预先定义对表达式的转义，如下表所示：

|ContextKey|Type|ContextKey|Type|
|-|-|-|-|
|False | 0 |Regex | 7 |
|True | 1 |NotRegex | 8 |
|Defined | 2 |Or | 9 |
|Not | 3 |Greater | 10 |
|Equals | 4 |Less | 11 |
|NotEquals | 5 |GreaterOrEquals | 12 |
|And | 6 |LessOrEquals | 13 |

具体的分词规则也很简单，以下面这颗树生成的思路为例子，遵循我们常用表达式的一些语法规范和优先级规则，优先切割 `||` 两边所有的表达式，然后遍历两边的表达式往下去切割 `&&` 表达式，切完所有的 `||` 和 `&&` 再处理子节点的 `!=`、`==` 和 `>=` 等这些符号。

![image](https://user-images.githubusercontent.com/17243165/97457166-75e86f80-1974-11eb-8d4e-632314202b55.png)

当我们把切割完整个 `when` 配置项，会把这个树结构结合上面的 `ContextKey-Type` 映射表，转换出下面的 JS 对象，上面的存储着 ContextKeyOrExpr，ContextKeyAndExpr，ContextKeyEqualsExpr 和 ContextKeyGreaterOrEqualsExpr 这些重要的规则类，将该 JS 对象存储到 MenuRegistry 里面，后面只需遍历 MenuRegistry 就可以把里面存着的 key 和 value 根据 type 运算规则取出来进行比对并返回布尔值。

```js
when: {
    ContextKeyOrExpr: {
        expr: [{
            ContextKeyDefinedExpr: {
                key: "canEdit",
                type: 2
            }
        }, {
            ContextKeyAndExpr: {
                expr: [{
                    ContextKeyEqualsExpr: {
                        key: "platform",
                        type: 4,
                        value: "pc",
                    },
                    ContextKeyGreaterOrEqualsExpr: {
                        key: "window.innerWidth",
                        type: 12,
                        value: "1080",
                    }
                }],
                type: 6
            }
        }],
        type: 9
    }
}
```

# 策略模式

但是我们要注意的是 key 是 `"window.innerWidth"` ，`canEdit` 和 `"platform"` 这些是字符串，不是真正可用于判断的值，这些 key 有些是运行时才会得到值，有些是在某个作用域下才会得到值，我们也需要将这些 key 进行转化，我们借鉴了 Vscode 的做法，在 Vscode 中，它会将这部分逻辑交给一个叫 context 的对象进行处理，它提供两个关键的接口 `setValue` 和 `getValue` 方法，简单的实现如下。

```js
class Context {
    private readonly _values = new Map<string, any>();
    getValue(key: string): any {
        if (this._values.has(key)) {
            return this._values.get(key);
        }
    }
    setValue(key: string, value: any) {
        this._values.set(key, value);
    }
}
```

它本质是维护着一份 Map 对象，我们需要把 `"window.innerWidth"`，`canEdit` 和 `"platform"` 这些值绑定进去，从而让 key 可以转化对应的变量或者常量，在 Vscode 中的实现会比这里更复杂，它会给每个作用域分配一个 id，当我们去使用 key 去换值的时候，还需要匹配对应的作用域，我们暂时不需要设计那么复杂。

```js
const context = new Context();

context.setValue('platform', 'pc');
context.setValue('window.innerWidth', window.innerWidth);
context.setValue('canEdit', window.SpreadsheetApp.sheetStatus.rangesStatus.status.canEdit);
```

以后如果要交给第三方配置，我们就需要提前在这里规定好 key 值绑定的变量和常量，输出一份配置文档就可以让第三方使用这些关键 key 来进行个性化配置。

那么最后只要封装一个 `contextMatchesRules` 方法，先读取已处理成条件表达式树对象的 MenuRegistry，遍历出每一个 when，并关联 context 最终得出一个布尔值，这个布尔值其实来之不易，做了上述那么多的处理估计已经能帮你去掉很多使用 if else，switch，三元表达式，枚举和表驱动等实现的判断逻辑。

> `const bool:boolean = contextMatchesRules(context, item.when);`


```js
for (const commandId of MenuRegistry.getCommands().keys()) {
    let item = MenuRegistry.getCommand(commandId);
    if (contextMatchesRules(item?.when)) {
        const button = document.createElement('button');
        if (item?.command) {
            button.innerHTML = item?.command;
        }
        document.body.appendChild(button);
    }
}

function contextMatchesRules(rules: ContextKeyExpression | undefined): boolean {
    const result = KeybindingResolver.contextMatchesRules(context, rules);
    return result;
}
```

![image](https://user-images.githubusercontent.com/17243165/97535190-36626780-19f6-11eb-9e9d-6452c3837b63.png)

# 总结

关于这方面的相关文章不多，一路走来跳了不少的坑，感谢团队成员的支持，并让这个方案最终成功落地，也希望有更多志同道合的人加入我们腾讯文档团队，一起去探索和遨游，最后也希望这篇文章能给到你们一些启发吧😁
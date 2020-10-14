# Contributes

```ts
// 注册
ExtensionsRegistry.registerExtensionPoint({
    extensionPoint: 'commands',
    jsonSchema: {
        description: localize('vscode.extension.contributes.commands', "Contributes commands to the command palette."),
        oneOf: [
            commandType,
            {
                type: 'array',
                items: commandType
            }
        ]
    }
});

// 获取
const extensionPoints = ExtensionsRegistry.getExtensionPoints();

// 触发
extensionPoints[0]._handler();
```
import { schema } from './schema';
import { ExtensionsRegistry, ExtensionMessageCollector, ExtensionPoint, IExtensionPoint, IExtensionPointUser } from './vs/workbench/services/extensions/common/extensionsRegistry';
import { ContextKeyExpr, ContextKeyExpression } from './vs/platform/contextkey/common/contextkey';
import { DisposableStore, toDisposable } from './vs/base/common/lifecycle';
import { MenuId, MenuRegistry, ILocalizedString, IMenuItem, ICommandAction } from './vs/platform/actions/common/actions';
import { URI } from './vs/base/common/uri';
import { localize } from './vs/nls';

export const _commandRegistrations = new DisposableStore();

ExtensionsRegistry.registerExtensionPoint<schema.IUserFriendlyCommand | schema.IUserFriendlyCommand[]>({
    extensionPoint: 'ToolbarsContribution',
    jsonSchema: schema.toolbarsContribution
}).setHandler((extensions: readonly IExtensionPointUser<schema.IUserFriendlyCommand | schema.IUserFriendlyCommand[]>[]) => {
    console.log('-----------ToolbarsContribution------------');
    function handleCommand(userFriendlyCommand: schema.IUserFriendlyCommand, extension: IExtensionPointUser<any>, bucket: schema.IToolbarRegistrations[]) {
        if (!schema.isValidCommand(userFriendlyCommand, extension.collector)) {
            return;
        }
        const { when, alt, group, command, component } = userFriendlyCommand;

        if (MenuRegistry.getCommand(command)) {
            extension.collector.info(localize('dup', "Command `{0}` appears multiple times in the `commands` section.", userFriendlyCommand.command));
        }
        bucket.push({
            id: command,
            alt,
            group,
            component,
            when: ContextKeyExpr.deserialize(when),
        });
    }

    // remove all previous command registrations
    _commandRegistrations.clear();

    const newCommands: ICommandAction[] = [];
    for (const extension of extensions) {
        const { value } = extension;
        if (Array.isArray(value)) {
            for (const command of value) {
                handleCommand(command, extension, newCommands);
            }
        } else {
            handleCommand(value, extension, newCommands);
        }
    }
    _commandRegistrations.add(MenuRegistry.addCommands(newCommands));
});

console.log(_commandRegistrations);

ExtensionsRegistry.registerExtensionPoint<string[]>({
    extensionPoint: 'PcShortToolbarButtonConfig',
    jsonSchema: schema.toolbarsContribution
}).setHandler((extensions: readonly IExtensionPointUser<string[]>[]) => {
    let PcShortToolbarButtonConfig: string[] = [];
    console.log('-----------PcShortToolbarButtonConfig------------');
    console.log(extensions);
    for (let i = 0, len = extensions.length; i < len; i++) {
        let extension = extensions[i];
        console.log(extension);
        for (let j = 0, lenJ = extension.value.length; j < lenJ; j++) {
            let ext = extension.value[j];
            PcShortToolbarButtonConfig.push(ext);
        }
    }
});
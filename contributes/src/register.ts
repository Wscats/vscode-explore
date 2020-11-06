/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 * @author enoyao
 */

import { schema } from './schema';
import { ExtensionsRegistry, IExtensionPointUser } from './vs/workbench/services/extensions/common/extensionsRegistry';
import { ContextKeyExpr } from './vs/platform/contextkey/common/contextkey';
import { DisposableStore } from './vs/base/common/lifecycle';
import { MenuId, MenuRegistry, IMenuItem, ICommandAction } from './vs/platform/actions/common/actions';
import { localize } from './vs/nls';
import { forEach } from './vs/base/common/collections';

const _commandRegistrations = new DisposableStore();
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
            command,
            alt,
            group,
            component,
            when: ContextKeyExpr.deserialize(when),
        });
    }

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

const _menuRegistrations = new DisposableStore();
ExtensionsRegistry.registerExtensionPoint<{ [loc: string]: schema.IUserFriendlyMenuItem[] }>({
    extensionPoint: 'menus',
    jsonSchema: schema.toolbarsContribution
}).setHandler((extensions) => {
    _menuRegistrations.clear();
    const items: { id: MenuId, item: IMenuItem }[] = [];
    for (let extension of extensions) {
        const { value, collector } = extension;

        forEach(value, entry => {
            if (!schema.isValidMenuItems(entry.value, collector)) {
                return;
            }

            const menu = schema.parseMenuId(entry.key);
            if (typeof menu === 'undefined') {
                collector.warn(localize('menuId.invalid', "`{0}` is not a valid menu identifier", entry.key));
                return;
            }

            if (schema.isProposedAPI(menu) && !extension.description.enableProposedApi) {
                collector.error(localize('proposedAPI.invalid', "{0} is a proposed menu identifier and is only available when running out of dev or with the following command line switch: --enable-proposed-api {1}", entry.key, extension.description.identifier.value));
                return;
            }

            for (let item of entry.value) {
                let command = MenuRegistry.getCommand(item.command);
                let alt = item.alt && MenuRegistry.getCommand(item.alt) || undefined;

                if (!command) {
                    collector.error(localize('missing.command', "Menu item references a command `{0}` which is not defined in the 'commands' section.", item.command));
                    continue;
                }
                if (item.alt && !alt) {
                    collector.warn(localize('missing.altCommand', "Menu item references an alt-command `{0}` which is not defined in the 'commands' section.", item.alt));
                }
                if (item.command === item.alt) {
                    collector.info(localize('dupe.command', "Menu item references the same command as default and alt-command"));
                }

                let group: string | undefined;
                let order: number | undefined;
                if (item.group) {
                    const idx = item.group.lastIndexOf('@');
                    if (idx > 0) {
                        group = item.group.substr(0, idx);
                        order = Number(item.group.substr(idx + 1)) || undefined;
                    } else {
                        group = item.group;
                    }
                }

                items.push({
                    id: menu,
                    item: {
                        command,
                        alt,
                        group,
                        order,
                        when: ContextKeyExpr.deserialize(item.when)
                    }
                });
            }
        });
    }

    _menuRegistrations.add(MenuRegistry.appendMenuItems(items));
});
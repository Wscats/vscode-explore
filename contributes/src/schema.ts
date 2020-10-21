import { ContextKeyExpr, ContextKeyExpression } from './vs/platform/contextkey/common/contextkey';
import { IJSONSchema } from './vs/base/common/jsonSchema';
import { localize } from './vs/nls';
import { isFalsyOrWhitespace } from './vs/base/common/strings';
import { MenuId, MenuRegistry, ILocalizedString, IMenuItem, ICommandAction } from './vs/platform/actions/common/actions';
import { IExtensionPointUser, ExtensionMessageCollector, ExtensionsRegistry } from './vs/workbench/services/extensions/common/extensionsRegistry';

export namespace schema {
    export interface IToolbarRegistrations {
        id: string;
        alt?: string;
        when?: ContextKeyExpression;
        group?: string;
        component?: any;
    }

    export type IUserFriendlyIcon = string | { light: string; dark: string; };

    export interface IUserFriendlyCommand {
        command: string;
        icon?: string;
        alt?: string;
        when?: string;
        group?: string;
        component?: any;
    }

    export function isValidCommand(command: IUserFriendlyCommand, collector: ExtensionMessageCollector): boolean {
        if (!command) {
            collector.error(localize('nonempty', "expected non-empty value."));
            return false;
        }
        if (typeof command.command !== 'string') {
            collector.error(localize('requirestring', "property `{0}` is mandatory and must be of type `string`", 'command'));
            return false;
        }
        if (command.alt && typeof command.alt !== 'string') {
            collector.error(localize('optstring', "property `{0}` can be omitted or must be of type `string`", 'alt'));
            return false;
        }
        if (command.when && typeof command.when !== 'string') {
            collector.error(localize('optstring', "property `{0}` can be omitted or must be of type `string`", 'when'));
            return false;
        }
        if (command.group && typeof command.group !== 'string') {
            collector.error(localize('optstring', "property `{0}` can be omitted or must be of type `string`", 'group'));
            return false;
        }
        if (command.component && typeof command.component !== 'string') {
            collector.error(localize('optstring', "property `{0}` can be omitted or must be of type `string`", 'component'));
            return false;
        }
        return true;
    }

    const toolbarsItem: IJSONSchema = {
        type: 'object',
        properties: {
            command: {
                description: localize('contributes.toolbarItem.command', 'Identifier of the command to execute. The command must be declared in the \'commands\'-section'),
                type: 'string'
            },
            alt: {
                description: localize('contributes.toolbarItem.alt', 'Identifier of an alternative command to execute. The command must be declared in the \'commands\'-section'),
                type: 'string'
            },
            when: {
                description: localize('contributes.toolbarItem.when', 'Condition which must be true to show this item'),
                type: 'string'
            },
            group: {
                description: localize('contributes.toolbarItem.group', 'Group into which this command belongs'),
                type: 'string'
            }
        }
    };

    export const toolbarsContribution: IJSONSchema = {
        description: localize('contributes.toolbars', "Contributes menu items to the editor"),
        type: 'object',
        properties: {
            'commandPalette': {
                description: localize('menus.commandPalette', "The Command Palette"),
                type: 'array',
                items: toolbarsItem
            }
        }
    }
}
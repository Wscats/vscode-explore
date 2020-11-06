/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 * @author enoyao
 */

import { ContextKeyExpr, ContextKeyExpression } from './vs/platform/contextkey/common/contextkey';
import { IJSONSchema } from './vs/base/common/jsonSchema';
import { localize } from './vs/nls';
import { isFalsyOrWhitespace } from './vs/base/common/strings';
import { MenuId } from './vs/platform/actions/common/actions';
import { IExtensionPointUser, ExtensionMessageCollector, ExtensionsRegistry } from './vs/workbench/services/extensions/common/extensionsRegistry';

export namespace schema {
    export interface IToolbarRegistrations {
        id: string;
        command: string;
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

    export interface IUserFriendlyMenuItem {
        command: string;
        alt?: string;
        when?: string;
        group?: string;
    }

    export function isValidMenuItems(menu: IUserFriendlyMenuItem[], collector: ExtensionMessageCollector): boolean {
        if (!Array.isArray(menu)) {
            collector.error(localize('requirearray', "menu items must be an array"));
            return false;
        }

        for (let item of menu) {
            if (typeof item.command !== 'string') {
                collector.error(localize('requirestring', "property `{0}` is mandatory and must be of type `string`", 'command'));
                return false;
            }
            if (item.alt && typeof item.alt !== 'string') {
                collector.error(localize('optstring', "property `{0}` can be omitted or must be of type `string`", 'alt'));
                return false;
            }
            if (item.when && typeof item.when !== 'string') {
                collector.error(localize('optstring', "property `{0}` can be omitted or must be of type `string`", 'when'));
                return false;
            }
            if (item.group && typeof item.group !== 'string') {
                collector.error(localize('optstring', "property `{0}` can be omitted or must be of type `string`", 'group'));
                return false;
            }
        }

        return true;
    }

    export function parseMenuId(value: string): MenuId | undefined {
        switch (value) {
            case 'commandPalette': return MenuId.CommandPalette;
            case 'touchBar': return MenuId.TouchBarContext;
            case 'editor/title': return MenuId.EditorTitle;
            case 'editor/context': return MenuId.EditorContext;
            case 'explorer/context': return MenuId.ExplorerContext;
            case 'editor/title/context': return MenuId.EditorTitleContext;
            case 'debug/callstack/context': return MenuId.DebugCallStackContext;
            case 'debug/toolbar': return MenuId.DebugToolBar;
            case 'debug/toolBar': return MenuId.DebugToolBar;
            case 'menuBar/webNavigation': return MenuId.MenubarWebNavigationMenu;
            case 'scm/title': return MenuId.SCMTitle;
            case 'scm/sourceControl': return MenuId.SCMSourceControl;
            case 'scm/resourceState/context': return MenuId.SCMResourceContext;//
            case 'scm/resourceFolder/context': return MenuId.SCMResourceFolderContext;
            case 'scm/resourceGroup/context': return MenuId.SCMResourceGroupContext;
            case 'scm/change/title': return MenuId.SCMChangeContext;//
            case 'statusBar/windowIndicator': return MenuId.StatusBarWindowIndicatorMenu;
            case 'view/title': return MenuId.ViewTitle;
            case 'view/item/context': return MenuId.ViewItemContext;
            case 'comments/commentThread/title': return MenuId.CommentThreadTitle;
            case 'comments/commentThread/context': return MenuId.CommentThreadActions;
            case 'comments/comment/title': return MenuId.CommentTitle;
            case 'comments/comment/context': return MenuId.CommentActions;
            case 'notebook/cell/title': return MenuId.NotebookCellTitle;
            case 'extension/context': return MenuId.ExtensionContext;
            case 'timeline/title': return MenuId.TimelineTitle;
            case 'timeline/item/context': return MenuId.TimelineItemContext;
        }

        return undefined;
    }

    export function isProposedAPI(menuId: MenuId): boolean {
        switch (menuId) {
            case MenuId.StatusBarWindowIndicatorMenu:
            case MenuId.MenubarWebNavigationMenu:
                return true;
        }
        return false;
    }

    const menuItem: IJSONSchema = {
        type: 'object',
        properties: {
            command: {
                description: localize('vscode.extension.contributes.menuItem.command', 'Identifier of the command to execute. The command must be declared in the \'commands\'-section'),
                type: 'string'
            },
            alt: {
                description: localize('vscode.extension.contributes.menuItem.alt', 'Identifier of an alternative command to execute. The command must be declared in the \'commands\'-section'),
                type: 'string'
            },
            when: {
                description: localize('vscode.extension.contributes.menuItem.when', 'Condition which must be true to show this item'),
                type: 'string'
            },
            group: {
                description: localize('vscode.extension.contributes.menuItem.group', 'Group into which this command belongs'),
                type: 'string'
            }
        }
    };

    export const menusContribution: IJSONSchema = {
        description: localize('vscode.extension.contributes.menus', "Contributes menu items to the editor"),
        type: 'object',
        properties: {
            'commandPalette': {
                description: localize('menus.commandPalette', "The Command Palette"),
                type: 'array',
                items: menuItem
            },
            'touchBar': {
                description: localize('menus.touchBar', "The touch bar (macOS only)"),
                type: 'array',
                items: menuItem
            },
            'editor/title': {
                description: localize('menus.editorTitle', "The editor title menu"),
                type: 'array',
                items: menuItem
            },
            'editor/context': {
                description: localize('menus.editorContext', "The editor context menu"),
                type: 'array',
                items: menuItem
            },
            'explorer/context': {
                description: localize('menus.explorerContext', "The file explorer context menu"),
                type: 'array',
                items: menuItem
            },
            'editor/title/context': {
                description: localize('menus.editorTabContext', "The editor tabs context menu"),
                type: 'array',
                items: menuItem
            },
            'debug/callstack/context': {
                description: localize('menus.debugCallstackContext', "The debug callstack context menu"),
                type: 'array',
                items: menuItem
            },
            'debug/toolBar': {
                description: localize('menus.debugToolBar', "The debug toolbar menu"),
                type: 'array',
                items: menuItem
            },
            'menuBar/webNavigation': {
                description: localize('menus.webNavigation', "The top level navigational menu (web only)"),
                type: 'array',
                items: menuItem
            },
            'scm/title': {
                description: localize('menus.scmTitle', "The Source Control title menu"),
                type: 'array',
                items: menuItem
            },
            'scm/sourceControl': {
                description: localize('menus.scmSourceControl', "The Source Control menu"),
                type: 'array',
                items: menuItem
            },
            'scm/resourceGroup/context': {
                description: localize('menus.resourceGroupContext', "The Source Control resource group context menu"),
                type: 'array',
                items: menuItem
            },
            'scm/resourceState/context': {
                description: localize('menus.resourceStateContext', "The Source Control resource state context menu"),
                type: 'array',
                items: menuItem
            },
            'scm/resourceFolder/context': {
                description: localize('menus.resourceFolderContext', "The Source Control resource folder context menu"),
                type: 'array',
                items: menuItem
            },
            'scm/change/title': {
                description: localize('menus.changeTitle', "The Source Control inline change menu"),
                type: 'array',
                items: menuItem
            },
            'view/title': {
                description: localize('view.viewTitle', "The contributed view title menu"),
                type: 'array',
                items: menuItem
            },
            'view/item/context': {
                description: localize('view.itemContext', "The contributed view item context menu"),
                type: 'array',
                items: menuItem
            },
            'comments/commentThread/title': {
                description: localize('commentThread.title', "The contributed comment thread title menu"),
                type: 'array',
                items: menuItem
            },
            'comments/commentThread/context': {
                description: localize('commentThread.actions', "The contributed comment thread context menu, rendered as buttons below the comment editor"),
                type: 'array',
                items: menuItem
            },
            'comments/comment/title': {
                description: localize('comment.title', "The contributed comment title menu"),
                type: 'array',
                items: menuItem
            },
            'comments/comment/context': {
                description: localize('comment.actions', "The contributed comment context menu, rendered as buttons below the comment editor"),
                type: 'array',
                items: menuItem
            },
            'notebook/cell/title': {
                description: localize('notebook.cell.title', "The contributed notebook cell title menu"),
                type: 'array',
                items: menuItem
            },
            'extension/context': {
                description: localize('menus.extensionContext', "The extension context menu"),
                type: 'array',
                items: menuItem
            },
            'timeline/title': {
                description: localize('view.timelineTitle', "The Timeline view title menu"),
                type: 'array',
                items: menuItem
            },
            'timeline/item/context': {
                description: localize('view.timelineContext', "The Timeline view item context menu"),
                type: 'array',
                items: menuItem
            },
        }
    };

}
/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 * @author enoyao
 */
import { ContextKeyExpression } from '../../../platform/contextkey/common/contextkey';
import { IDisposable } from '../../../base/common/lifecycle';
import { Event } from '../../../base/common/event';
import { URI } from '../../../base/common/uri';
import { UriDto } from '../../../base/common/types';
export interface ILocalizedString {
    value: string;
    original: string;
}
export interface ThemeIcon {
    readonly id: string;
}
export declare type Icon = {
    dark?: URI;
    light?: URI;
} | ThemeIcon;
export interface ICommandAction {
    id: string;
    command: string;
    title: string | ILocalizedString;
    category?: string | ILocalizedString;
    tooltip?: string | ILocalizedString;
    icon?: Icon;
    precondition?: ContextKeyExpression;
    toggled?: ContextKeyExpression | {
        condition: ContextKeyExpression;
        icon?: Icon;
        tooltip?: string | ILocalizedString;
    };
    component?: any;
    when?: ContextKeyExpression;
}
export declare type ISerializableCommandAction = UriDto<ICommandAction>;
export interface IMenuItem {
    command: ICommandAction;
    alt?: ICommandAction;
    when?: ContextKeyExpression;
    group?: 'navigation' | string;
    order?: number;
}
export interface ISubmenuItem {
    title: string | ILocalizedString;
    submenu: MenuId;
    when?: ContextKeyExpression;
    group?: 'navigation' | string;
    order?: number;
}
export declare function isIMenuItem(item: IMenuItem | ISubmenuItem): item is IMenuItem;
export declare function isISubmenuItem(item: IMenuItem | ISubmenuItem): item is ISubmenuItem;
export declare class MenuId {
    private static _idPool;
    static readonly CommandPalette: MenuId;
    static readonly DebugBreakpointsContext: MenuId;
    static readonly DebugCallStackContext: MenuId;
    static readonly DebugConsoleContext: MenuId;
    static readonly DebugVariablesContext: MenuId;
    static readonly DebugWatchContext: MenuId;
    static readonly DebugToolBar: MenuId;
    static readonly EditorContext: MenuId;
    static readonly EditorContextPeek: MenuId;
    static readonly EditorTitle: MenuId;
    static readonly EditorTitleContext: MenuId;
    static readonly EmptyEditorGroupContext: MenuId;
    static readonly ExplorerContext: MenuId;
    static readonly ExtensionContext: MenuId;
    static readonly GlobalActivity: MenuId;
    static readonly MenubarAppearanceMenu: MenuId;
    static readonly MenubarDebugMenu: MenuId;
    static readonly MenubarEditMenu: MenuId;
    static readonly MenubarFileMenu: MenuId;
    static readonly MenubarGoMenu: MenuId;
    static readonly MenubarHelpMenu: MenuId;
    static readonly MenubarLayoutMenu: MenuId;
    static readonly MenubarNewBreakpointMenu: MenuId;
    static readonly MenubarPreferencesMenu: MenuId;
    static readonly MenubarRecentMenu: MenuId;
    static readonly MenubarSelectionMenu: MenuId;
    static readonly MenubarSwitchEditorMenu: MenuId;
    static readonly MenubarSwitchGroupMenu: MenuId;
    static readonly MenubarTerminalMenu: MenuId;
    static readonly MenubarViewMenu: MenuId;
    static readonly MenubarWebNavigationMenu: MenuId;
    static readonly OpenEditorsContext: MenuId;
    static readonly ProblemsPanelContext: MenuId;
    static readonly SCMChangeContext: MenuId;
    static readonly SCMResourceContext: MenuId;
    static readonly SCMResourceFolderContext: MenuId;
    static readonly SCMResourceGroupContext: MenuId;
    static readonly SCMSourceControl: MenuId;
    static readonly SCMTitle: MenuId;
    static readonly SearchContext: MenuId;
    static readonly StatusBarWindowIndicatorMenu: MenuId;
    static readonly TouchBarContext: MenuId;
    static readonly TitleBarContext: MenuId;
    static readonly TunnelContext: MenuId;
    static readonly TunnelInline: MenuId;
    static readonly TunnelTitle: MenuId;
    static readonly ViewItemContext: MenuId;
    static readonly ViewTitle: MenuId;
    static readonly ViewTitleContext: MenuId;
    static readonly CommentThreadTitle: MenuId;
    static readonly CommentThreadActions: MenuId;
    static readonly CommentTitle: MenuId;
    static readonly CommentActions: MenuId;
    static readonly NotebookCellTitle: MenuId;
    static readonly BulkEditTitle: MenuId;
    static readonly BulkEditContext: MenuId;
    static readonly TimelineItemContext: MenuId;
    static readonly TimelineTitle: MenuId;
    static readonly TimelineTitleContext: MenuId;
    static readonly AccountsContext: MenuId;
    readonly id: number;
    readonly _debugName: string;
    constructor(debugName: string);
}
export interface IMenuActionOptions {
    arg?: any;
    shouldForwardArgs?: boolean;
}
export declare type ICommandsMap = Map<string, ICommandAction>;
export interface IMenuRegistryChangeEvent {
    has(id: MenuId): boolean;
}
export interface IMenuRegistry {
    readonly onDidChangeMenu: Event<IMenuRegistryChangeEvent>;
    addCommands(newCommands: Iterable<ICommandAction>): IDisposable;
    addCommand(userCommand: ICommandAction): IDisposable;
    getCommand(id: string): ICommandAction | undefined;
    getCommands(): ICommandsMap;
    appendMenuItems(items: Iterable<{
        id: MenuId;
        item: IMenuItem | ISubmenuItem;
    }>): IDisposable;
    appendMenuItem(menu: MenuId, item: IMenuItem | ISubmenuItem): IDisposable;
    getMenuItems(loc: MenuId): Array<IMenuItem | ISubmenuItem>;
}
export declare const MenuRegistry: IMenuRegistry;

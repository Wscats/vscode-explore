import { ILocalization } from '../../localizations/common/localizations';
import { URI } from '../../../base/common/uri';
export declare const MANIFEST_CACHE_FOLDER = "CachedExtensions";
export declare const USER_MANIFEST_CACHE_FILE = "user";
export declare const BUILTIN_MANIFEST_CACHE_FILE = "builtin";
export interface ICommand {
    command: string;
    title: string;
    category?: string;
}
export interface IConfigurationProperty {
    description: string;
    type: string | string[];
    default?: any;
}
export interface IConfiguration {
    properties: {
        [key: string]: IConfigurationProperty;
    };
}
export interface IDebugger {
    label?: string;
    type: string;
    runtime?: string;
}
export interface IGrammar {
    language: string;
}
export interface IJSONValidation {
    fileMatch: string | string[];
    url: string;
}
export interface IKeyBinding {
    command: string;
    key: string;
    when?: string;
    mac?: string;
    linux?: string;
    win?: string;
}
export interface ILanguage {
    id: string;
    extensions: string[];
    aliases: string[];
}
export interface IMenu {
    command: string;
    alt?: string;
    when?: string;
    group?: string;
}
export interface ISnippet {
    language: string;
}
export interface ITheme {
    label: string;
}
export interface IViewContainer {
    id: string;
    title: string;
}
export interface IView {
    id: string;
    name: string;
}
export interface IColor {
    id: string;
    description: string;
    defaults: {
        light: string;
        dark: string;
        highContrast: string;
    };
}
export interface IWebviewEditor {
    readonly viewType: string;
    readonly priority: string;
    readonly selector: readonly {
        readonly filenamePattern?: string;
    }[];
}
export interface ICodeActionContributionAction {
    readonly kind: string;
    readonly title: string;
    readonly description?: string;
}
export interface ICodeActionContribution {
    readonly languages: readonly string[];
    readonly actions: readonly ICodeActionContributionAction[];
}
export interface IExtensionContributions {
    commands?: ICommand[];
    configuration?: IConfiguration | IConfiguration[];
    debuggers?: IDebugger[];
    grammars?: IGrammar[];
    jsonValidation?: IJSONValidation[];
    keybindings?: IKeyBinding[];
    languages?: ILanguage[];
    menus?: {
        [context: string]: IMenu[];
    };
    snippets?: ISnippet[];
    themes?: ITheme[];
    iconThemes?: ITheme[];
    viewsContainers?: {
        [location: string]: IViewContainer[];
    };
    views?: {
        [location: string]: IView[];
    };
    colors?: IColor[];
    localizations?: ILocalization[];
    readonly customEditors?: readonly IWebviewEditor[];
    readonly codeActions?: readonly ICodeActionContribution[];
}
export declare type ExtensionKind = 'ui' | 'workspace' | 'web';
export declare function isIExtensionIdentifier(thing: any): thing is IExtensionIdentifier;
export interface IExtensionIdentifier {
    id: string;
    uuid?: string;
}
export interface IExtensionManifest {
    readonly name: string;
    readonly displayName?: string;
    readonly publisher: string;
    readonly version: string;
    readonly engines: {
        vscode: string;
    };
    readonly description?: string;
    readonly main?: string;
    readonly icon?: string;
    readonly categories?: string[];
    readonly keywords?: string[];
    readonly activationEvents?: string[];
    readonly extensionDependencies?: string[];
    readonly extensionPack?: string[];
    readonly extensionKind?: ExtensionKind | ExtensionKind[];
    readonly contributes?: IExtensionContributions;
    readonly repository?: {
        url: string;
    };
    readonly bugs?: {
        url: string;
    };
    readonly enableProposedApi?: boolean;
    readonly api?: string;
    readonly scripts?: {
        [key: string]: string;
    };
}
export declare const enum ExtensionType {
    System = 0,
    User = 1
}
export interface IExtension {
    readonly type: ExtensionType;
    readonly identifier: IExtensionIdentifier;
    readonly manifest: IExtensionManifest;
    readonly location: URI;
}
/**
 * **!Do not construct directly!**
 *
 * **!Only static methods because it gets serialized!**
 *
 * This represents the "canonical" version for an extension identifier. Extension ids
 * have to be case-insensitive (due to the marketplace), but we must ensure case
 * preservation because the extension API is already public at this time.
 *
 * For example, given an extension with the publisher `"Hello"` and the name `"World"`,
 * its canonical extension identifier is `"Hello.World"`. This extension could be
 * referenced in some other extension's dependencies using the string `"hello.world"`.
 *
 * To make matters more complicated, an extension can optionally have an UUID. When two
 * extensions have the same UUID, they are considered equal even if their identifier is different.
 */
export declare class ExtensionIdentifier {
    readonly value: string;
    private readonly _lower;
    constructor(value: string);
    static equals(a: ExtensionIdentifier | string | null | undefined, b: ExtensionIdentifier | string | null | undefined): boolean;
    /**
     * Gives the value by which to index (for equality).
     */
    static toKey(id: ExtensionIdentifier | string): string;
}
export interface IExtensionDescription extends IExtensionManifest {
    readonly identifier: ExtensionIdentifier;
    readonly uuid?: string;
    readonly isBuiltin: boolean;
    readonly isUnderDevelopment: boolean;
    readonly extensionLocation: URI;
    enableProposedApi?: boolean;
}
export declare function isLanguagePackExtension(manifest: IExtensionManifest): boolean;

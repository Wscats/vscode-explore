import { IJSONSchema } from '../../../../base/common/jsonSchema';
import { IMessage } from './extensions';
import { IExtensionDescription } from '../../../../platform/extensions/common/extensions';
export declare type ExtensionKind = 'workspace' | 'ui' | undefined;
export declare class ExtensionMessageCollector {
    private readonly _messageHandler;
    private readonly _extension;
    private readonly _extensionPointId;
    constructor(messageHandler: (msg: IMessage) => void, extension: IExtensionDescription, extensionPointId: string);
    private _msg;
    error(message: string): void;
    warn(message: string): void;
    info(message: string): void;
}
export interface IExtensionPointUser<T> {
    description: IExtensionDescription;
    value: T;
    collector: ExtensionMessageCollector;
}
export declare type IExtensionPointHandler<T> = (extensions: readonly IExtensionPointUser<T>[], delta: ExtensionPointUserDelta<T>) => void;
export interface IExtensionPoint<T> {
    name: string;
    setHandler(handler: IExtensionPointHandler<T>): void;
    defaultExtensionKind: ExtensionKind;
}
export declare class ExtensionPointUserDelta<T> {
    readonly added: readonly IExtensionPointUser<T>[];
    readonly removed: readonly IExtensionPointUser<T>[];
    private static _toSet;
    static compute<T>(previous: readonly IExtensionPointUser<T>[] | null, current: readonly IExtensionPointUser<T>[]): ExtensionPointUserDelta<T>;
    constructor(added: readonly IExtensionPointUser<T>[], removed: readonly IExtensionPointUser<T>[]);
}
export declare class ExtensionPoint<T> implements IExtensionPoint<T> {
    readonly name: string;
    readonly defaultExtensionKind: ExtensionKind;
    private _handler;
    private _users;
    private _delta;
    constructor(name: string, defaultExtensionKind: ExtensionKind);
    setHandler(handler: IExtensionPointHandler<T>): void;
    acceptUsers(users: IExtensionPointUser<T>[]): void;
    private _handle;
}
export declare const schema: IJSONSchema;
export interface IExtensionPointDescriptor {
    extensionPoint: string;
    deps?: IExtensionPoint<any>[];
    jsonSchema: IJSONSchema;
    defaultExtensionKind?: ExtensionKind;
}
export declare class ExtensionsRegistryImpl {
    private readonly _extensionPoints;
    registerExtensionPoint<T>(desc: IExtensionPointDescriptor): IExtensionPoint<T>;
    getExtensionPoints(): ExtensionPoint<any>[];
}
export declare const ExtensionsRegistry: ExtensionsRegistryImpl;

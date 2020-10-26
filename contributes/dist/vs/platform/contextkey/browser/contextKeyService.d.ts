import { Event, PauseableEmitter } from '../../../base/common/event';
import { IContext, IContextKey, IContextKeyChangeEvent, IContextKeyService, IContextKeyServiceTarget, ContextKeyExpression } from '../../../platform/contextkey/common/contextkey';
export declare class Context implements IContext {
    protected _parent: Context | null;
    protected _value: {
        [key: string]: any;
    };
    protected _id: number;
    constructor(id: number, parent: Context | null);
    setValue(key: string, value: any): boolean;
    removeValue(key: string): boolean;
    getValue<T>(key: string): T | undefined;
    collectAllValues(): {
        [key: string]: any;
    };
}
export declare abstract class AbstractContextKeyService implements IContextKeyService {
    _serviceBrand: undefined;
    protected _isDisposed: boolean;
    protected _onDidChangeContext: PauseableEmitter<IContextKeyChangeEvent>;
    protected _myContextId: number;
    constructor(myContextId: number);
    abstract dispose(): void;
    createKey<T>(key: string, defaultValue: T | undefined): IContextKey<T>;
    get onDidChangeContext(): Event<IContextKeyChangeEvent>;
    bufferChangeEvents(callback: Function): void;
    createScoped(domNode: IContextKeyServiceTarget): IContextKeyService;
    contextMatchesRules(rules: ContextKeyExpression | undefined): boolean;
    getContextKeyValue<T>(key: string): T | undefined;
    setContext(key: string, value: any): void;
    removeContext(key: string): void;
    getContext(target: IContextKeyServiceTarget | null): IContext;
    abstract getContextValuesContainer(contextId: number): Context;
    abstract createChildContext(parentContextId?: number): number;
    abstract disposeContext(contextId: number): void;
}

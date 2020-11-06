/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 * @author enoyao
 */
export declare function isFalsyOrWhitespace(str: string | undefined): boolean;
export declare const enum ContextKeyExprType {
    False = 0,
    True = 1,
    Defined = 2,
    Not = 3,
    Equals = 4,
    NotEquals = 5,
    And = 6,
    Regex = 7,
    NotRegex = 8,
    Or = 9,
    Greater = 10,
    Less = 11,
    GreaterOrEquals = 12,
    LessOrEquals = 13
}
export interface IContextKeyExprMapper {
    mapDefined(key: string): ContextKeyExpression;
    mapNot(key: string): ContextKeyExpression;
    mapEquals(key: string, value: any): ContextKeyExpression;
    mapNotEquals(key: string, value: any): ContextKeyExpression;
    mapRegex(key: string, regexp: RegExp | null): ContextKeyRegexExpr;
}
export interface IContextKeyExpression {
    cmp(other: ContextKeyExpression): number;
    equals(other: ContextKeyExpression): boolean;
    evaluate(context: IContext): boolean;
    serialize(): string;
    keys(): string[];
    map(mapFnc: IContextKeyExprMapper): ContextKeyExpression;
    negate(): ContextKeyExpression;
}
export declare type ContextKeyExpression = (ContextKeyFalseExpr | ContextKeyTrueExpr | ContextKeyDefinedExpr | ContextKeyNotExpr | ContextKeyEqualsExpr | ContextKeyGreaterExpr | ContextKeyGreaterOrEqualsExpr | ContextKeyLessExpr | ContextKeyLessOrEqualsExpr | ContextKeyNotEqualsExpr | ContextKeyRegexExpr | ContextKeyNotRegexExpr | ContextKeyAndExpr | ContextKeyOrExpr);
export declare abstract class ContextKeyExpr {
    static false(): ContextKeyExpression;
    static true(): ContextKeyExpression;
    static has(key: string): ContextKeyExpression;
    static equals(key: string, value: any): ContextKeyExpression;
    static notEquals(key: string, value: any): ContextKeyExpression;
    static regex(key: string, value: RegExp): ContextKeyExpression;
    static not(key: string): ContextKeyExpression;
    static and(...expr: Array<ContextKeyExpression | undefined | null>): ContextKeyExpression | undefined;
    static or(...expr: Array<ContextKeyExpression | undefined | null>): ContextKeyExpression | undefined;
    static greaterOrEquals(key: string, value: any): ContextKeyExpression;
    static lessOrEquals(key: string, value: any): ContextKeyExpression;
    static greater(key: string, value: any): ContextKeyExpression;
    static less(key: string, value: any): ContextKeyExpression;
    static deserialize(serialized: string | null | undefined, strict?: boolean): ContextKeyExpression | undefined;
    private static _deserializeOrExpression;
    private static _deserializeAndExpression;
    private static _deserializeOne;
    private static _deserializeValue;
    private static _deserializeRegexValue;
}
export declare class ContextKeyFalseExpr implements IContextKeyExpression {
    static INSTANCE: ContextKeyFalseExpr;
    readonly type = ContextKeyExprType.False;
    protected constructor();
    cmp(other: ContextKeyExpression): number;
    equals(other: ContextKeyExpression): boolean;
    evaluate(context: IContext): boolean;
    serialize(): string;
    keys(): string[];
    map(mapFnc: IContextKeyExprMapper): ContextKeyExpression;
    negate(): ContextKeyExpression;
}
export declare class ContextKeyTrueExpr implements IContextKeyExpression {
    static INSTANCE: ContextKeyTrueExpr;
    readonly type = ContextKeyExprType.True;
    protected constructor();
    cmp(other: ContextKeyExpression): number;
    equals(other: ContextKeyExpression): boolean;
    evaluate(context: IContext): boolean;
    serialize(): string;
    keys(): string[];
    map(mapFnc: IContextKeyExprMapper): ContextKeyExpression;
    negate(): ContextKeyExpression;
}
export declare class ContextKeyDefinedExpr implements IContextKeyExpression {
    protected readonly key: string;
    static create(key: string): ContextKeyExpression;
    readonly type = ContextKeyExprType.Defined;
    protected constructor(key: string);
    cmp(other: ContextKeyExpression): number;
    equals(other: ContextKeyExpression): boolean;
    evaluate(context: IContext): boolean;
    serialize(): string;
    keys(): string[];
    map(mapFnc: IContextKeyExprMapper): ContextKeyExpression;
    negate(): ContextKeyExpression;
}
export declare class ContextKeyEqualsExpr implements IContextKeyExpression {
    private readonly key;
    private readonly value;
    static create(key: string, value: any): ContextKeyExpression;
    readonly type = ContextKeyExprType.Equals;
    private constructor();
    cmp(other: ContextKeyExpression): number;
    equals(other: ContextKeyExpression): boolean;
    evaluate(context: IContext): boolean;
    serialize(): string;
    keys(): string[];
    map(mapFnc: IContextKeyExprMapper): ContextKeyExpression;
    negate(): ContextKeyExpression;
}
export declare class ContextKeyNotEqualsExpr implements IContextKeyExpression {
    private readonly key;
    private readonly value;
    static create(key: string, value: any): ContextKeyExpression;
    readonly type = ContextKeyExprType.NotEquals;
    private constructor();
    cmp(other: ContextKeyExpression): number;
    equals(other: ContextKeyExpression): boolean;
    evaluate(context: IContext): boolean;
    serialize(): string;
    keys(): string[];
    map(mapFnc: IContextKeyExprMapper): ContextKeyExpression;
    negate(): ContextKeyExpression;
}
export declare class ContextKeyGreaterOrEqualsExpr implements IContextKeyExpression {
    private readonly key;
    private readonly value;
    static create(key: string, value: any): ContextKeyExpression;
    readonly type = ContextKeyExprType.GreaterOrEquals;
    private constructor();
    cmp(other: ContextKeyExpression): number;
    equals(other: ContextKeyExpression): boolean;
    evaluate(context: IContext): boolean;
    serialize(): string;
    keys(): string[];
    map(mapFnc: IContextKeyExprMapper): ContextKeyExpression;
    negate(): ContextKeyExpression;
}
export declare class ContextKeyGreaterExpr implements IContextKeyExpression {
    private readonly key;
    private readonly value;
    static create(key: string, value: any): ContextKeyExpression;
    readonly type = ContextKeyExprType.Greater;
    private constructor();
    cmp(other: ContextKeyExpression): number;
    equals(other: ContextKeyExpression): boolean;
    evaluate(context: IContext): boolean;
    serialize(): string;
    keys(): string[];
    map(mapFnc: IContextKeyExprMapper): ContextKeyExpression;
    negate(): ContextKeyExpression;
}
export declare class ContextKeyLessExpr implements IContextKeyExpression {
    private readonly key;
    private readonly value;
    static create(key: string, value: any): ContextKeyExpression;
    readonly type = ContextKeyExprType.Less;
    private constructor();
    cmp(other: ContextKeyExpression): number;
    equals(other: ContextKeyExpression): boolean;
    evaluate(context: IContext): boolean;
    serialize(): string;
    keys(): string[];
    map(mapFnc: IContextKeyExprMapper): ContextKeyExpression;
    negate(): ContextKeyExpression;
}
export declare class ContextKeyLessOrEqualsExpr implements IContextKeyExpression {
    private readonly key;
    private readonly value;
    static create(key: string, value: any): ContextKeyExpression;
    readonly type = ContextKeyExprType.LessOrEquals;
    private constructor();
    cmp(other: ContextKeyExpression): number;
    equals(other: ContextKeyExpression): boolean;
    evaluate(context: IContext): boolean;
    serialize(): string;
    keys(): string[];
    map(mapFnc: IContextKeyExprMapper): ContextKeyExpression;
    negate(): ContextKeyExpression;
}
export declare class ContextKeyNotExpr implements IContextKeyExpression {
    private readonly key;
    static create(key: string): ContextKeyExpression;
    readonly type = ContextKeyExprType.Not;
    private constructor();
    cmp(other: ContextKeyExpression): number;
    equals(other: ContextKeyExpression): boolean;
    evaluate(context: IContext): boolean;
    serialize(): string;
    keys(): string[];
    map(mapFnc: IContextKeyExprMapper): ContextKeyExpression;
    negate(): ContextKeyExpression;
}
export declare class ContextKeyRegexExpr implements IContextKeyExpression {
    private readonly key;
    private readonly regexp;
    static create(key: string, regexp: RegExp | null): ContextKeyRegexExpr;
    readonly type = ContextKeyExprType.Regex;
    private constructor();
    cmp(other: ContextKeyExpression): number;
    equals(other: ContextKeyExpression): boolean;
    evaluate(context: IContext): boolean;
    serialize(): string;
    keys(): string[];
    map(mapFnc: IContextKeyExprMapper): ContextKeyRegexExpr;
    negate(): ContextKeyExpression;
}
export declare class ContextKeyNotRegexExpr implements IContextKeyExpression {
    private readonly _actual;
    static create(actual: ContextKeyRegexExpr): ContextKeyExpression;
    readonly type = ContextKeyExprType.NotRegex;
    private constructor();
    cmp(other: ContextKeyExpression): number;
    equals(other: ContextKeyExpression): boolean;
    evaluate(context: IContext): boolean;
    serialize(): string;
    keys(): string[];
    map(mapFnc: IContextKeyExprMapper): ContextKeyExpression;
    negate(): ContextKeyExpression;
}
export declare class ContextKeyAndExpr implements IContextKeyExpression {
    readonly expr: ContextKeyExpression[];
    static create(_expr: ReadonlyArray<ContextKeyExpression | null | undefined>): ContextKeyExpression | undefined;
    readonly type = ContextKeyExprType.And;
    private constructor();
    cmp(other: ContextKeyExpression): number;
    equals(other: ContextKeyExpression): boolean;
    evaluate(context: IContext): boolean;
    private static _normalizeArr;
    serialize(): string;
    keys(): string[];
    map(mapFnc: IContextKeyExprMapper): ContextKeyExpression;
    negate(): ContextKeyExpression;
}
export declare class ContextKeyOrExpr implements IContextKeyExpression {
    readonly expr: ContextKeyExpression[];
    static create(_expr: ReadonlyArray<ContextKeyExpression | null | undefined>): ContextKeyExpression | undefined;
    readonly type = ContextKeyExprType.Or;
    private constructor();
    cmp(other: ContextKeyExpression): number;
    equals(other: ContextKeyExpression): boolean;
    evaluate(context: IContext): boolean;
    private static _normalizeArr;
    serialize(): string;
    keys(): string[];
    map(mapFnc: IContextKeyExprMapper): ContextKeyExpression;
    negate(): ContextKeyExpression;
}
export interface IContext {
    getValue<T>(key: string): T | undefined;
}
export interface IContextKey<T> {
    set(value: T): void;
    reset(): void;
    get(): T | undefined;
}
export interface IContextKeyServiceTarget {
    parentElement: IContextKeyServiceTarget | null;
    setAttribute(attr: string, value: string): void;
    removeAttribute(attr: string): void;
    hasAttribute(attr: string): boolean;
    getAttribute(attr: string): string | null;
}
export interface IReadableSet<T> {
    has(value: T): boolean;
}
export interface IContextKeyChangeEvent {
    affectsSome(keys: IReadableSet<string>): boolean;
}
export declare const SET_CONTEXT_COMMAND_ID = "setContext";
export declare function contextMatchesRules(context: IContext, rules: ContextKeyExpression | null | undefined): boolean;

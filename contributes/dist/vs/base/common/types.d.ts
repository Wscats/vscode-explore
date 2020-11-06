/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 * @author enoyao
 */
import { URI, UriComponents } from './uri';
/**
 * @returns whether the provided parameter is a JavaScript Array or not.
 */
export declare function isArray(array: any): array is any[];
/**
 * @returns whether the provided parameter is a JavaScript String or not.
 */
export declare function isString(str: any): str is string;
/**
 * @returns whether the provided parameter is a JavaScript Array and each element in the array is a string.
 */
export declare function isStringArray(value: any): value is string[];
/**
 *
 * @returns whether the provided parameter is of type `object` but **not**
 *	`null`, an `array`, a `regexp`, nor a `date`.
 */
export declare function isObject(obj: any): obj is Object;
/**
 * In **contrast** to just checking `typeof` this will return `false` for `NaN`.
 * @returns whether the provided parameter is a JavaScript Number or not.
 */
export declare function isNumber(obj: any): obj is number;
/**
 * @returns whether the provided parameter is a JavaScript Boolean or not.
 */
export declare function isBoolean(obj: any): obj is boolean;
/**
 * @returns whether the provided parameter is undefined.
 */
export declare function isUndefined(obj: any): obj is undefined;
/**
 * @returns whether the provided parameter is undefined or null.
 */
export declare function isUndefinedOrNull(obj: any): obj is undefined | null;
export declare function assertType(condition: any, type?: string): asserts condition;
/**
 * Asserts that the argument passed in is neither undefined nor null.
 */
export declare function assertIsDefined<T>(arg: T | null | undefined): T;
/**
 * Asserts that each argument passed in is neither undefined nor null.
 */
export declare function assertAllDefined<T1, T2>(t1: T1 | null | undefined, t2: T2 | null | undefined): [T1, T2];
export declare function assertAllDefined<T1, T2, T3>(t1: T1 | null | undefined, t2: T2 | null | undefined, t3: T3 | null | undefined): [T1, T2, T3];
export declare function assertAllDefined<T1, T2, T3, T4>(t1: T1 | null | undefined, t2: T2 | null | undefined, t3: T3 | null | undefined, t4: T4 | null | undefined): [T1, T2, T3, T4];
/**
 * @returns whether the provided parameter is an empty JavaScript Object or not.
 */
export declare function isEmptyObject(obj: any): obj is any;
/**
 * @returns whether the provided parameter is a JavaScript Function or not.
 */
export declare function isFunction(obj: any): obj is Function;
/**
 * @returns whether the provided parameters is are JavaScript Function or not.
 */
export declare function areFunctions(...objects: any[]): boolean;
export declare type TypeConstraint = string | Function;
export declare function validateConstraints(args: any[], constraints: Array<TypeConstraint | undefined>): void;
export declare function validateConstraint(arg: any, constraint: TypeConstraint | undefined): void;
export declare function getAllPropertyNames(obj: object): string[];
export declare function getAllMethodNames(obj: object): string[];
export declare function createProxyObject<T extends object>(methodNames: string[], invoke: (method: string, args: any[]) => any): T;
/**
 * Converts null to undefined, passes all other values through.
 */
export declare function withNullAsUndefined<T>(x: T | null): T | undefined;
/**
 * Converts undefined to null, passes all other values through.
 */
export declare function withUndefinedAsNull<T>(x: T | undefined): T | null;
/**
 * Allows to add a first parameter to functions of a type.
 */
export declare type AddFirstParameterToFunctions<Target, TargetFunctionsReturnType, FirstParameter> = {
    [K in keyof Target]: Target[K] extends (...args: any) => TargetFunctionsReturnType ? (firstArg: FirstParameter, ...args: Parameters<Target[K]>) => ReturnType<Target[K]> : Target[K];
};
/**
 * Mapped-type that replaces all occurrences of URI with UriComponents
 */
export declare type UriDto<T> = {
    [K in keyof T]: T[K] extends URI ? UriComponents : UriDto<T[K]>;
};
/**
 * Mapped-type that replaces all occurrences of URI with UriComponents and
 * drops all functions.
 * todo@joh use toJSON-results
 */
export declare type Dto<T> = {
    [K in keyof T]: T[K] extends URI ? UriComponents : T[K] extends Function ? never : UriDto<T[K]>;
};
export declare function NotImplementedProxy<T>(name: string): {
    new (): T;
};

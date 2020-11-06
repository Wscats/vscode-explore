/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 * @author enoyao
 */
/**
 * An interface for a JavaScript object that
 * acts a dictionary. The keys are strings.
 */
export declare type IStringDictionary<V> = Record<string, V>;
/**
 * An interface for a JavaScript object that
 * acts a dictionary. The keys are numbers.
 */
export declare type INumberDictionary<V> = Record<number, V>;
/**
 * Returns an array which contains all values that reside
 * in the given dictionary.
 */
export declare function values<T>(from: IStringDictionary<T> | INumberDictionary<T>): T[];
export declare function size<T>(from: IStringDictionary<T> | INumberDictionary<T>): number;
export declare function first<T>(from: IStringDictionary<T> | INumberDictionary<T>): T | undefined;
/**
 * Iterates over each entry in the provided dictionary. The iterator allows
 * to remove elements and will stop when the callback returns {{false}}.
 */
export declare function forEach<T>(from: IStringDictionary<T> | INumberDictionary<T>, callback: (entry: {
    key: any;
    value: T;
}, remove: () => void) => any): void;
/**
 * Groups the collection into a dictionary based on the provided
 * group function.
 */
export declare function groupBy<T>(data: T[], groupFn: (element: T) => string): IStringDictionary<T[]>;
export declare function fromMap<T>(original: Map<string, T>): IStringDictionary<T>;
export declare class SetMap<K, V> {
    private map;
    add(key: K, value: V): void;
    delete(key: K, value: V): void;
    forEach(key: K, fn: (value: V) => void): void;
}

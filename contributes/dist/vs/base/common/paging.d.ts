/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 * @author enoyao
 */
import { CancellationToken } from './cancellation';
/**
 * A Pager is a stateless abstraction over a paged collection.
 */
export interface IPager<T> {
    firstPage: T[];
    total: number;
    pageSize: number;
    getPage(pageIndex: number, cancellationToken: CancellationToken): Promise<T[]>;
}
/**
 * A PagedModel is a stateful model over an abstracted paged collection.
 */
export interface IPagedModel<T> {
    length: number;
    isResolved(index: number): boolean;
    get(index: number): T;
    resolve(index: number, cancellationToken: CancellationToken): Promise<T>;
}
export declare function singlePagePager<T>(elements: T[]): IPager<T>;
export declare class PagedModel<T> implements IPagedModel<T> {
    private pager;
    private pages;
    get length(): number;
    constructor(arg: IPager<T> | T[]);
    isResolved(index: number): boolean;
    get(index: number): T;
    resolve(index: number, cancellationToken: CancellationToken): Promise<T>;
}
export declare class DelayedPagedModel<T> implements IPagedModel<T> {
    private model;
    private timeout;
    get length(): number;
    constructor(model: IPagedModel<T>, timeout?: number);
    isResolved(index: number): boolean;
    get(index: number): T;
    resolve(index: number, cancellationToken: CancellationToken): Promise<T>;
}
/**
 * Similar to array.map, `mapPager` lets you map the elements of an
 * abstract paged collection to another type.
 */
export declare function mapPager<T, R>(pager: IPager<T>, fn: (t: T) => R): IPager<R>;
/**
 * Merges two pagers.
 */
export declare function mergePagers<T>(one: IPager<T>, other: IPager<T>): IPager<T>;

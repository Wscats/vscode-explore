/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 * @author enoyao
 */
import { Event } from './event';
export interface ISplice<T> {
    readonly start: number;
    readonly deleteCount: number;
    readonly toInsert: T[];
}
export interface ISpliceable<T> {
    splice(start: number, deleteCount: number, toInsert: T[]): void;
}
export interface ISequence<T> {
    readonly elements: T[];
    readonly onDidSplice: Event<ISplice<T>>;
}
export declare class Sequence<T> implements ISequence<T>, ISpliceable<T> {
    readonly elements: T[];
    private readonly _onDidSplice;
    readonly onDidSplice: Event<ISplice<T>>;
    splice(start: number, deleteCount: number, toInsert?: T[]): void;
}

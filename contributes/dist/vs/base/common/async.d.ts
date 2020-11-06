/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 * @author enoyao
 */
import { CancellationToken } from './cancellation';
export interface CancelablePromise<T> extends Promise<T> {
    cancel(): void;
}
export declare function createCancelablePromise<T>(callback: (token: CancellationToken) => Promise<T>): CancelablePromise<T>;
export declare function timeout(millis: number): CancelablePromise<void>;
export declare function timeout(millis: number, token: CancellationToken): Promise<void>;

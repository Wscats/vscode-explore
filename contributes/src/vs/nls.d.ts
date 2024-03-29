/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 * @author enoyao
 */

export interface ILocalizeInfo {
	key: string;
	comment: string[];
}

/**
 * Localize a message.
 *
 * `message` can contain `{n}` notation where it is replaced by the nth value in `...args`
 * For example, `localize({ key: 'sayHello', comment: ['Welcomes user'] }, 'hello {0}', name)`
 */
export declare function localize(info: ILocalizeInfo, message: string, ...args: (string | number | boolean | undefined | null)[]): string;

/**
 * Localize a message.
 *
 * `message` can contain `{n}` notation where it is replaced by the nth value in `...args`
 * For example, `localize('sayHello', 'hello {0}', name)`
 */
export declare function localize(key: string, message: string, ...args: (string | number | boolean | undefined | null)[]): string;

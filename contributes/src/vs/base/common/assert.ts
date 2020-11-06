/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 * @author enoyao
 */

/**
 * Throws an error with the provided message if the provided value does not evaluate to a true Javascript value.
 */
export function ok(value?: unknown, message?: string) {
	if (!value) {
		throw new Error(message ? `Assertion failed (${message})` : 'Assertion Failed');
	}
}

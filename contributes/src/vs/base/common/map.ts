/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 * @author enoyao
 */

/**
 * @deprecated ES6: use `[...SetOrMap.values()]`
 */
export function values<V = any>(set: Set<V>): V[];
export function values<K = any, V = any>(map: Map<K, V>): V[];
export function values<V>(forEachable: { forEach(callback: (value: V, ...more: any[]) => any): void }): V[] {
	const result: V[] = [];
	forEachable.forEach(value => result.push(value));
	return result;
}


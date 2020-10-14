/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from './uri';
import { CharCode } from './charCode';
import { compareSubstringIgnoreCase, compare, compareSubstring } from './strings';
import { Schemas } from './network';
import { isLinux } from './platform';

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

/**
 * @deprecated ES6: use `[...map.keys()]`
 */
export function keys<K, V>(map: Map<K, V>): K[] {
	const result: K[] = [];
	map.forEach((_value, key) => result.push(key));

	return result;
}

export function getOrSet<K, V>(map: Map<K, V>, key: K, value: V): V {
	let result = map.get(key);
	if (result === undefined) {
		result = value;
		map.set(key, result);
	}

	return result;
}

export function mapToString<K, V>(map: Map<K, V>): string {
	const entries: string[] = [];
	map.forEach((value, key) => {
		entries.push(`${key} => ${value}`);
	});

	return `Map(${map.size}) {${entries.join(', ')}}`;
}

export function setToString<K>(set: Set<K>): string {
	const entries: K[] = [];
	set.forEach(value => {
		entries.push(value);
	});

	return `Set(${set.size}) {${entries.join(', ')}}`;
}

export interface IKeyIterator<K> {
	reset(key: K): this;
	next(): this;

	hasNext(): boolean;
	cmp(a: string): number;
	value(): string;
}

export class StringIterator implements IKeyIterator<string> {

	private _value: string = '';
	private _pos: number = 0;

	reset(key: string): this {
		this._value = key;
		this._pos = 0;
		return this;
	}

	next(): this {
		this._pos += 1;
		return this;
	}

	hasNext(): boolean {
		return this._pos < this._value.length - 1;
	}

	cmp(a: string): number {
		const aCode = a.charCodeAt(0);
		const thisCode = this._value.charCodeAt(this._pos);
		return aCode - thisCode;
	}

	value(): string {
		return this._value[this._pos];
	}
}

export class PathIterator implements IKeyIterator<string> {

	private _value!: string;
	private _from!: number;
	private _to!: number;

	constructor(
		private readonly _splitOnBackslash: boolean = true,
		private readonly _caseSensitive: boolean = true
	) { }

	reset(key: string): this {
		this._value = key.replace(/\\$|\/$/, '');
		this._from = 0;
		this._to = 0;
		return this.next();
	}

	hasNext(): boolean {
		return this._to < this._value.length;
	}

	next(): this {
		// this._data = key.split(/[\\/]/).filter(s => !!s);
		this._from = this._to;
		let justSeps = true;
		for (; this._to < this._value.length; this._to++) {
			const ch = this._value.charCodeAt(this._to);
			if (ch === CharCode.Slash || this._splitOnBackslash && ch === CharCode.Backslash) {
				if (justSeps) {
					this._from++;
				} else {
					break;
				}
			} else {
				justSeps = false;
			}
		}
		return this;
	}

	cmp(a: string): number {
		return this._caseSensitive
			? compareSubstring(a, this._value, 0, a.length, this._from, this._to)
			: compareSubstringIgnoreCase(a, this._value, 0, a.length, this._from, this._to);
	}

	value(): string {
		return this._value.substring(this._from, this._to);
	}
}

const enum UriIteratorState {
	Scheme = 1, Authority = 2, Path = 3, Query = 4, Fragment = 5
}

export class UriIterator implements IKeyIterator<URI> {

	private _pathIterator!: PathIterator;
	private _value!: URI;
	private _states: UriIteratorState[] = [];
	private _stateIdx: number = 0;

	reset(key: URI): this {
		this._value = key;
		this._states = [];
		if (this._value.scheme) {
			this._states.push(UriIteratorState.Scheme);
		}
		if (this._value.authority) {
			this._states.push(UriIteratorState.Authority);
		}
		if (this._value.path) {
			//todo@jrieken the case-sensitive logic is copied form `resources.ts#hasToIgnoreCase`
			// which cannot be used because it depends on this
			const caseSensitive = key.scheme === Schemas.file && isLinux;
			this._pathIterator = new PathIterator(false, caseSensitive);
			this._pathIterator.reset(key.path);
			if (this._pathIterator.value()) {
				this._states.push(UriIteratorState.Path);
			}
		}
		if (this._value.query) {
			this._states.push(UriIteratorState.Query);
		}
		if (this._value.fragment) {
			this._states.push(UriIteratorState.Fragment);
		}
		this._stateIdx = 0;
		return this;
	}

	next(): this {
		if (this._states[this._stateIdx] === UriIteratorState.Path && this._pathIterator.hasNext()) {
			this._pathIterator.next();
		} else {
			this._stateIdx += 1;
		}
		return this;
	}

	hasNext(): boolean {
		return (this._states[this._stateIdx] === UriIteratorState.Path && this._pathIterator.hasNext())
			|| this._stateIdx < this._states.length - 1;
	}

	cmp(a: string): number {
		if (this._states[this._stateIdx] === UriIteratorState.Scheme) {
			return compareSubstringIgnoreCase(a, this._value.scheme);
		} else if (this._states[this._stateIdx] === UriIteratorState.Authority) {
			return compareSubstringIgnoreCase(a, this._value.authority);
		} else if (this._states[this._stateIdx] === UriIteratorState.Path) {
			return this._pathIterator.cmp(a);
		} else if (this._states[this._stateIdx] === UriIteratorState.Query) {
			return compare(a, this._value.query);
		} else if (this._states[this._stateIdx] === UriIteratorState.Fragment) {
			return compare(a, this._value.fragment);
		}
		throw new Error();
	}

	value(): string {
		if (this._states[this._stateIdx] === UriIteratorState.Scheme) {
			return this._value.scheme;
		} else if (this._states[this._stateIdx] === UriIteratorState.Authority) {
			return this._value.authority;
		} else if (this._states[this._stateIdx] === UriIteratorState.Path) {
			return this._pathIterator.value();
		} else if (this._states[this._stateIdx] === UriIteratorState.Query) {
			return this._value.query;
		} else if (this._states[this._stateIdx] === UriIteratorState.Fragment) {
			return this._value.fragment;
		}
		throw new Error();
	}
}

class TernarySearchTreeNode<K, V> {
	segment!: string;
	value: V | undefined;
	key!: K;
	left: TernarySearchTreeNode<K, V> | undefined;
	mid: TernarySearchTreeNode<K, V> | undefined;
	right: TernarySearchTreeNode<K, V> | undefined;

	isEmpty(): boolean {
		return !this.left && !this.mid && !this.right && !this.value;
	}
}

export class TernarySearchTree<K, V> {

	static forUris<E>(): TernarySearchTree<URI, E> {
		return new TernarySearchTree<URI, E>(new UriIterator());
	}

	static forPaths<E>(): TernarySearchTree<string, E> {
		return new TernarySearchTree<string, E>(new PathIterator());
	}

	static forStrings<E>(): TernarySearchTree<string, E> {
		return new TernarySearchTree<string, E>(new StringIterator());
	}

	private _iter: IKeyIterator<K>;
	private _root: TernarySearchTreeNode<K, V> | undefined;

	constructor(segments: IKeyIterator<K>) {
		this._iter = segments;
	}

	clear(): void {
		this._root = undefined;
	}

	set(key: K, element: V): V | undefined {
		const iter = this._iter.reset(key);
		let node: TernarySearchTreeNode<K, V>;

		if (!this._root) {
			this._root = new TernarySearchTreeNode<K, V>();
			this._root.segment = iter.value();
		}

		node = this._root;
		while (true) {
			const val = iter.cmp(node.segment);
			if (val > 0) {
				// left
				if (!node.left) {
					node.left = new TernarySearchTreeNode<K, V>();
					node.left.segment = iter.value();
				}
				node = node.left;

			} else if (val < 0) {
				// right
				if (!node.right) {
					node.right = new TernarySearchTreeNode<K, V>();
					node.right.segment = iter.value();
				}
				node = node.right;

			} else if (iter.hasNext()) {
				// mid
				iter.next();
				if (!node.mid) {
					node.mid = new TernarySearchTreeNode<K, V>();
					node.mid.segment = iter.value();
				}
				node = node.mid;
			} else {
				break;
			}
		}
		const oldElement = node.value;
		node.value = element;
		node.key = key;
		return oldElement;
	}

	get(key: K): V | undefined {
		const iter = this._iter.reset(key);
		let node = this._root;
		while (node) {
			const val = iter.cmp(node.segment);
			if (val > 0) {
				// left
				node = node.left;
			} else if (val < 0) {
				// right
				node = node.right;
			} else if (iter.hasNext()) {
				// mid
				iter.next();
				node = node.mid;
			} else {
				break;
			}
		}
		return node ? node.value : undefined;
	}

	delete(key: K): void {

		const iter = this._iter.reset(key);
		const stack: [-1 | 0 | 1, TernarySearchTreeNode<K, V>][] = [];
		let node = this._root;

		// find and unset node
		while (node) {
			const val = iter.cmp(node.segment);
			if (val > 0) {
				// left
				stack.push([1, node]);
				node = node.left;
			} else if (val < 0) {
				// right
				stack.push([-1, node]);
				node = node.right;
			} else if (iter.hasNext()) {
				// mid
				iter.next();
				stack.push([0, node]);
				node = node.mid;
			} else {
				// remove element
				node.value = undefined;

				// clean up empty nodes
				while (stack.length > 0 && node.isEmpty()) {
					let [dir, parent] = stack.pop()!;
					switch (dir) {
						case 1: parent.left = undefined; break;
						case 0: parent.mid = undefined; break;
						case -1: parent.right = undefined; break;
					}
					node = parent;
				}
				break;
			}
		}
	}

	findSubstr(key: K): V | undefined {
		const iter = this._iter.reset(key);
		let node = this._root;
		let candidate: V | undefined = undefined;
		while (node) {
			const val = iter.cmp(node.segment);
			if (val > 0) {
				// left
				node = node.left;
			} else if (val < 0) {
				// right
				node = node.right;
			} else if (iter.hasNext()) {
				// mid
				iter.next();
				candidate = node.value || candidate;
				node = node.mid;
			} else {
				break;
			}
		}
		return node && node.value || candidate;
	}

	findSuperstr(key: K): Iterator<V> | undefined {
		const iter = this._iter.reset(key);
		let node = this._root;
		while (node) {
			const val = iter.cmp(node.segment);
			if (val > 0) {
				// left
				node = node.left;
			} else if (val < 0) {
				// right
				node = node.right;
			} else if (iter.hasNext()) {
				// mid
				iter.next();
				node = node.mid;
			} else {
				// collect
				if (!node.mid) {
					return undefined;
				} else {
					return this._nodeIterator(node.mid);
				}
			}
		}
		return undefined;
	}

	private _nodeIterator(node: TernarySearchTreeNode<K, V>): Iterator<V> {
		let res: { done: false; value: V; };
		let idx: number;
		let data: V[];
		const next = (): IteratorResult<V> => {
			if (!data) {
				// lazy till first invocation
				data = [];
				idx = 0;
				this._forEach(node, value => data.push(value));
			}
			if (idx >= data.length) {
				return { done: true, value: undefined };
			}

			if (!res) {
				res = { done: false, value: data[idx++] };
			} else {
				res.value = data[idx++];
			}
			return res;
		};
		return { next };
	}

	forEach(callback: (value: V, index: K) => any) {
		this._forEach(this._root, callback);
	}

	private _forEach(node: TernarySearchTreeNode<K, V> | undefined, callback: (value: V, index: K) => any) {
		if (node) {
			// left
			this._forEach(node.left, callback);

			// node
			if (node.value) {
				// callback(node.value, this._iter.join(parts));
				callback(node.value, node.key);
			}
			// mid
			this._forEach(node.mid, callback);

			// right
			this._forEach(node.right, callback);
		}
	}
}

export class ResourceMap<T> implements Map<URI, T> {

	readonly [Symbol.toStringTag] = 'ResourceMap';

	protected readonly map: Map<string, T>;
	protected readonly ignoreCase?: boolean;

	constructor() {
		this.map = new Map<string, T>();
		this.ignoreCase = false; // in the future this should be an uri-comparator
	}

	set(resource: URI, value: T): this {
		this.map.set(this.toKey(resource), value);
		return this;
	}

	get(resource: URI): T | undefined {
		return this.map.get(this.toKey(resource));
	}

	has(resource: URI): boolean {
		return this.map.has(this.toKey(resource));
	}

	get size(): number {
		return this.map.size;
	}

	clear(): void {
		this.map.clear();
	}

	delete(resource: URI): boolean {
		return this.map.delete(this.toKey(resource));
	}

	forEach(clb: (value: T, key: URI, map: Map<URI, T>) => void, thisArg?: any): void {
		if (typeof thisArg !== 'undefined') {
			clb = clb.bind(thisArg);
		}
		for (let [index, value] of this.map) {
			clb(value, URI.parse(index), <any>this);
		}
	}

	values(): IterableIterator<T> {
		return this.map.values();
	}

	*keys(): IterableIterator<URI> {
		for (let key of this.map.keys()) {
			yield URI.parse(key);
		}
	}

	*entries(): IterableIterator<[URI, T]> {
		for (let tuple of this.map.entries()) {
			yield [URI.parse(tuple[0]), tuple[1]];
		}
	}

	*[Symbol.iterator](): IterableIterator<[URI, T]> {
		for (let item of this.map) {
			yield [URI.parse(item[0]), item[1]];
		}
	}

	private toKey(resource: URI): string {
		let key = resource.toString();
		if (this.ignoreCase) {
			key = key.toLowerCase();
		}

		return key;
	}

	clone(): ResourceMap<T> {
		const resourceMap = new ResourceMap<T>();

		this.map.forEach((value, key) => resourceMap.map.set(key, value));

		return resourceMap;
	}
}

interface Item<K, V> {
	previous: Item<K, V> | undefined;
	next: Item<K, V> | undefined;
	key: K;
	value: V;
}

export const enum Touch {
	None = 0,
	AsOld = 1,
	AsNew = 2
}

export class LinkedMap<K, V> implements Map<K, V> {

	readonly [Symbol.toStringTag] = 'LinkedMap';

	private _map: Map<K, Item<K, V>>;
	private _head: Item<K, V> | undefined;
	private _tail: Item<K, V> | undefined;
	private _size: number;

	private _state: number;

	constructor() {
		this._map = new Map<K, Item<K, V>>();
		this._head = undefined;
		this._tail = undefined;
		this._size = 0;
		this._state = 0;
	}

	clear(): void {
		this._map.clear();
		this._head = undefined;
		this._tail = undefined;
		this._size = 0;
		this._state++;
	}

	isEmpty(): boolean {
		return !this._head && !this._tail;
	}

	get size(): number {
		return this._size;
	}

	get first(): V | undefined {
		return this._head?.value;
	}

	get last(): V | undefined {
		return this._tail?.value;
	}

	has(key: K): boolean {
		return this._map.has(key);
	}

	get(key: K, touch: Touch = Touch.None): V | undefined {
		const item = this._map.get(key);
		if (!item) {
			return undefined;
		}
		if (touch !== Touch.None) {
			this.touch(item, touch);
		}
		return item.value;
	}

	set(key: K, value: V, touch: Touch = Touch.None): this {
		let item = this._map.get(key);
		if (item) {
			item.value = value;
			if (touch !== Touch.None) {
				this.touch(item, touch);
			}
		} else {
			item = { key, value, next: undefined, previous: undefined };
			switch (touch) {
				case Touch.None:
					this.addItemLast(item);
					break;
				case Touch.AsOld:
					this.addItemFirst(item);
					break;
				case Touch.AsNew:
					this.addItemLast(item);
					break;
				default:
					this.addItemLast(item);
					break;
			}
			this._map.set(key, item);
			this._size++;
		}
		return this;
	}

	delete(key: K): boolean {
		return !!this.remove(key);
	}

	remove(key: K): V | undefined {
		const item = this._map.get(key);
		if (!item) {
			return undefined;
		}
		this._map.delete(key);
		this.removeItem(item);
		this._size--;
		return item.value;
	}

	shift(): V | undefined {
		if (!this._head && !this._tail) {
			return undefined;
		}
		if (!this._head || !this._tail) {
			throw new Error('Invalid list');
		}
		const item = this._head;
		this._map.delete(item.key);
		this.removeItem(item);
		this._size--;
		return item.value;
	}

	forEach(callbackfn: (value: V, key: K, map: LinkedMap<K, V>) => void, thisArg?: any): void {
		const state = this._state;
		let current = this._head;
		while (current) {
			if (thisArg) {
				callbackfn.bind(thisArg)(current.value, current.key, this);
			} else {
				callbackfn(current.value, current.key, this);
			}
			if (this._state !== state) {
				throw new Error(`LinkedMap got modified during iteration.`);
			}
			current = current.next;
		}
	}

	keys(): IterableIterator<K> {
		const map = this;
		const state = this._state;
		let current = this._head;
		const iterator: IterableIterator<K> = {
			[Symbol.iterator]() {
				return iterator;
			},
			next(): IteratorResult<K> {
				if (map._state !== state) {
					throw new Error(`LinkedMap got modified during iteration.`);
				}
				if (current) {
					const result = { value: current.key, done: false };
					current = current.next;
					return result;
				} else {
					return { value: undefined, done: true };
				}
			}
		};
		return iterator;
	}

	values(): IterableIterator<V> {
		const map = this;
		const state = this._state;
		let current = this._head;
		const iterator: IterableIterator<V> = {
			[Symbol.iterator]() {
				return iterator;
			},
			next(): IteratorResult<V> {
				if (map._state !== state) {
					throw new Error(`LinkedMap got modified during iteration.`);
				}
				if (current) {
					const result = { value: current.value, done: false };
					current = current.next;
					return result;
				} else {
					return { value: undefined, done: true };
				}
			}
		};
		return iterator;
	}

	entries(): IterableIterator<[K, V]> {
		const map = this;
		const state = this._state;
		let current = this._head;
		const iterator: IterableIterator<[K, V]> = {
			[Symbol.iterator]() {
				return iterator;
			},
			next(): IteratorResult<[K, V]> {
				if (map._state !== state) {
					throw new Error(`LinkedMap got modified during iteration.`);
				}
				if (current) {
					const result: IteratorResult<[K, V]> = { value: [current.key, current.value], done: false };
					current = current.next;
					return result;
				} else {
					return { value: undefined, done: true };
				}
			}
		};
		return iterator;
	}

	[Symbol.iterator](): IterableIterator<[K, V]> {
		return this.entries();
	}

	protected trimOld(newSize: number) {
		if (newSize >= this.size) {
			return;
		}
		if (newSize === 0) {
			this.clear();
			return;
		}
		let current = this._head;
		let currentSize = this.size;
		while (current && currentSize > newSize) {
			this._map.delete(current.key);
			current = current.next;
			currentSize--;
		}
		this._head = current;
		this._size = currentSize;
		if (current) {
			current.previous = undefined;
		}
		this._state++;
	}

	private addItemFirst(item: Item<K, V>): void {
		// First time Insert
		if (!this._head && !this._tail) {
			this._tail = item;
		} else if (!this._head) {
			throw new Error('Invalid list');
		} else {
			item.next = this._head;
			this._head.previous = item;
		}
		this._head = item;
		this._state++;
	}

	private addItemLast(item: Item<K, V>): void {
		// First time Insert
		if (!this._head && !this._tail) {
			this._head = item;
		} else if (!this._tail) {
			throw new Error('Invalid list');
		} else {
			item.previous = this._tail;
			this._tail.next = item;
		}
		this._tail = item;
		this._state++;
	}

	private removeItem(item: Item<K, V>): void {
		if (item === this._head && item === this._tail) {
			this._head = undefined;
			this._tail = undefined;
		}
		else if (item === this._head) {
			// This can only happend if size === 1 which is handle
			// by the case above.
			if (!item.next) {
				throw new Error('Invalid list');
			}
			item.next.previous = undefined;
			this._head = item.next;
		}
		else if (item === this._tail) {
			// This can only happend if size === 1 which is handle
			// by the case above.
			if (!item.previous) {
				throw new Error('Invalid list');
			}
			item.previous.next = undefined;
			this._tail = item.previous;
		}
		else {
			const next = item.next;
			const previous = item.previous;
			if (!next || !previous) {
				throw new Error('Invalid list');
			}
			next.previous = previous;
			previous.next = next;
		}
		item.next = undefined;
		item.previous = undefined;
		this._state++;
	}

	private touch(item: Item<K, V>, touch: Touch): void {
		if (!this._head || !this._tail) {
			throw new Error('Invalid list');
		}
		if ((touch !== Touch.AsOld && touch !== Touch.AsNew)) {
			return;
		}

		if (touch === Touch.AsOld) {
			if (item === this._head) {
				return;
			}

			const next = item.next;
			const previous = item.previous;

			// Unlink the item
			if (item === this._tail) {
				// previous must be defined since item was not head but is tail
				// So there are more than on item in the map
				previous!.next = undefined;
				this._tail = previous;
			}
			else {
				// Both next and previous are not undefined since item was neither head nor tail.
				next!.previous = previous;
				previous!.next = next;
			}

			// Insert the node at head
			item.previous = undefined;
			item.next = this._head;
			this._head.previous = item;
			this._head = item;
			this._state++;
		} else if (touch === Touch.AsNew) {
			if (item === this._tail) {
				return;
			}

			const next = item.next;
			const previous = item.previous;

			// Unlink the item.
			if (item === this._head) {
				// next must be defined since item was not tail but is head
				// So there are more than on item in the map
				next!.previous = undefined;
				this._head = next;
			} else {
				// Both next and previous are not undefined since item was neither head nor tail.
				next!.previous = previous;
				previous!.next = next;
			}
			item.next = undefined;
			item.previous = this._tail;
			this._tail.next = item;
			this._tail = item;
			this._state++;
		}
	}

	toJSON(): [K, V][] {
		const data: [K, V][] = [];

		this.forEach((value, key) => {
			data.push([key, value]);
		});

		return data;
	}

	fromJSON(data: [K, V][]): void {
		this.clear();

		for (const [key, value] of data) {
			this.set(key, value);
		}
	}
}

export class LRUCache<K, V> extends LinkedMap<K, V> {

	private _limit: number;
	private _ratio: number;

	constructor(limit: number, ratio: number = 1) {
		super();
		this._limit = limit;
		this._ratio = Math.min(Math.max(0, ratio), 1);
	}

	get limit(): number {
		return this._limit;
	}

	set limit(limit: number) {
		this._limit = limit;
		this.checkTrim();
	}

	get ratio(): number {
		return this._ratio;
	}

	set ratio(ratio: number) {
		this._ratio = Math.min(Math.max(0, ratio), 1);
		this.checkTrim();
	}

	get(key: K, touch: Touch = Touch.AsNew): V | undefined {
		return super.get(key, touch);
	}

	peek(key: K): V | undefined {
		return super.get(key, Touch.None);
	}

	set(key: K, value: V): this {
		super.set(key, value, Touch.AsNew);
		this.checkTrim();
		return this;
	}

	private checkTrim() {
		if (this.size > this._limit) {
			this.trimOld(Math.round(this._limit * this._ratio));
		}
	}
}

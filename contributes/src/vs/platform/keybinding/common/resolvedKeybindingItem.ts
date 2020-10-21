/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { CharCode } from '../../../base/common/charCode';
import { ResolvedKeybinding } from '../../../base/common/keyCodes';
import { ContextKeyExpression } from '../../../platform/contextkey/common/contextkey';

export class ResolvedKeybindingItem {
	_resolvedKeybindingItemBrand: void;

	public readonly resolvedKeybinding: ResolvedKeybinding | undefined;
	public readonly keypressParts: string[];
	public readonly bubble: boolean;
	public readonly command: string | null;
	public readonly commandArgs: any;
	public readonly when: ContextKeyExpression | undefined;
	public readonly isDefault: boolean;

	constructor(resolvedKeybinding: ResolvedKeybinding | undefined, command: string | null, commandArgs: any, when: ContextKeyExpression | undefined, isDefault: boolean) {
		this.resolvedKeybinding = resolvedKeybinding;
		this.keypressParts = resolvedKeybinding ? removeElementsAfterNulls(resolvedKeybinding.getDispatchParts()) : [];
		this.bubble = (command ? command.charCodeAt(0) === CharCode.Caret : false);
		this.command = this.bubble ? command!.substr(1) : command;
		this.commandArgs = commandArgs;
		this.when = when;
		this.isDefault = isDefault;
	}
}

export function removeElementsAfterNulls<T>(arr: (T | null)[]): T[] {
	let result: T[] = [];
	for (let i = 0, len = arr.length; i < len; i++) {
		const element = arr[i];
		if (!element) {
			// stop processing at first encountered null
			return result;
		}
		result.push(element);
	}
	return result;
}

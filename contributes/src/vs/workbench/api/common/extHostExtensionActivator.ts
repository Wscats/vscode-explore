/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


import { ExtensionIdentifier } from '../../../platform/extensions/common/extensions';


export interface ExtensionActivationReason {
	readonly startup: boolean;
	readonly extensionId: ExtensionIdentifier;
	readonly activationEvent: string;
}
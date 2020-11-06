/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 * @author enoyao
 */

import { Event } from '../../../../base/common/event';
import Severity from '../../../../base/common/severity';
import { URI } from '../../../../base/common/uri';
import { ExtensionIdentifier, IExtension, ExtensionType, IExtensionDescription } from '../../../../platform/extensions/common/extensions';
import { getGalleryExtensionId } from '../../../../platform/extensionManagement/common/extensionManagementUtil';
import { IMessagePassingProtocol } from '../../../../base/parts/ipc/common/ipc';
import { ExtensionActivationReason } from '../../../../workbench/api/common/extHostExtensionActivator';

export const nullExtensionDescription = Object.freeze(<IExtensionDescription>{
	identifier: new ExtensionIdentifier('nullExtensionDescription'),
	name: 'Null Extension Description',
	version: '0.0.0',
	publisher: 'vscode',
	enableProposedApi: false,
	engines: { vscode: '' },
	extensionLocation: URI.parse('void:location'),
	isBuiltin: false,
});


export interface IMessage {
	type: Severity;
	message: string;
	extensionId: ExtensionIdentifier;
	extensionPointId: string;
}

export interface IExtensionsStatus {
	messages: IMessage[];
	activationTimes: ActivationTimes | undefined;
	runtimeErrors: Error[];
}

export type ExtensionActivationError = string | MissingDependencyError;
export class MissingDependencyError {
	constructor(readonly dependency: string) { }
}

/**
 * e.g.
 * ```
 * {
 *    startTime: 1511954813493000,
 *    endTime: 1511954835590000,
 *    deltas: [ 100, 1500, 123456, 1500, 100000 ],
 *    ids: [ 'idle', 'self', 'extension1', 'self', 'idle' ]
 * }
 * ```
 */
export interface IExtensionHostProfile {
	/**
	 * Profiling start timestamp in microseconds.
	 */
	startTime: number;
	/**
	 * Profiling end timestamp in microseconds.
	 */
	endTime: number;
	/**
	 * Duration of segment in microseconds.
	 */
	deltas: number[];
	/**
	 * Segment identifier: extension id or one of the four known strings.
	 */
	ids: ProfileSegmentId[];

	/**
	 * Get the information as a .cpuprofile.
	 */
	data: object;

	/**
	 * Get the aggregated time per segmentId
	 */
	getAggregatedTimes(): Map<ProfileSegmentId, number>;
}

export interface IExtensionHostStarter {
	readonly onExit: Event<[number, string | null]>;

	start(): Promise<IMessagePassingProtocol> | null;
	getInspectPort(): number | undefined;
	enableInspectPort(): Promise<boolean>;
	dispose(): void;
}


/**
 * Extension id or one of the four known program states.
 */
export type ProfileSegmentId = string | 'idle' | 'program' | 'gc' | 'self';

export class ActivationTimes {
	constructor(
		public readonly codeLoadingTime: number,
		public readonly activateCallTime: number,
		public readonly activateResolvedTime: number,
		public readonly activationReason: ExtensionActivationReason
	) {
	}
}

export class ExtensionPointContribution<T> {
	readonly description: IExtensionDescription;
	readonly value: T;

	constructor(description: IExtensionDescription, value: T) {
		this.description = description;
		this.value = value;
	}
}

export const ExtensionHostLogFileName = 'exthost';

export interface IWillActivateEvent {
	readonly event: string;
	readonly activation: Promise<void>;
}

export interface IResponsiveStateChangeEvent {
	isResponsive: boolean;
}



export interface ProfileSession {
	stop(): Promise<IExtensionHostProfile>;
}

export function checkProposedApiEnabled(extension: IExtensionDescription): void {
	if (!extension.enableProposedApi) {
		throwProposedApiError(extension);
	}
}

export function throwProposedApiError(extension: IExtensionDescription): never {
	throw new Error(`[${extension.identifier.value}]: Proposed API is only available when running out of dev or with the following command line switch: --enable-proposed-api ${extension.identifier.value}`);
}

export function toExtension(extensionDescription: IExtensionDescription): IExtension {
	return {
		type: extensionDescription.isBuiltin ? ExtensionType.System : ExtensionType.User,
		identifier: { id: getGalleryExtensionId(extensionDescription.publisher, extensionDescription.name), uuid: extensionDescription.uuid },
		manifest: extensionDescription,
		location: extensionDescription.extensionLocation,
	};
}

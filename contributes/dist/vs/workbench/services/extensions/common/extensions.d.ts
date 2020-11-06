/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 * @author enoyao
 */
import { Event } from '../../../../base/common/event';
import Severity from '../../../../base/common/severity';
import { ExtensionIdentifier, IExtension, IExtensionDescription } from '../../../../platform/extensions/common/extensions';
import { IMessagePassingProtocol } from '../../../../base/parts/ipc/common/ipc';
import { ExtensionActivationReason } from '../../../../workbench/api/common/extHostExtensionActivator';
export declare const nullExtensionDescription: Readonly<IExtensionDescription>;
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
export declare type ExtensionActivationError = string | MissingDependencyError;
export declare class MissingDependencyError {
    readonly dependency: string;
    constructor(dependency: string);
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
export declare type ProfileSegmentId = string | 'idle' | 'program' | 'gc' | 'self';
export declare class ActivationTimes {
    readonly codeLoadingTime: number;
    readonly activateCallTime: number;
    readonly activateResolvedTime: number;
    readonly activationReason: ExtensionActivationReason;
    constructor(codeLoadingTime: number, activateCallTime: number, activateResolvedTime: number, activationReason: ExtensionActivationReason);
}
export declare class ExtensionPointContribution<T> {
    readonly description: IExtensionDescription;
    readonly value: T;
    constructor(description: IExtensionDescription, value: T);
}
export declare const ExtensionHostLogFileName = "exthost";
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
export declare function checkProposedApiEnabled(extension: IExtensionDescription): void;
export declare function throwProposedApiError(extension: IExtensionDescription): never;
export declare function toExtension(extensionDescription: IExtensionDescription): IExtension;

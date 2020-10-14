import { Event } from '../../../../base/common/event';
import Severity from '../../../../base/common/severity';
import { IExtensionPoint } from '../../../../workbench/services/extensions/common/extensionsRegistry';
import { ExtensionIdentifier, IExtension, IExtensionDescription } from '../../../../platform/extensions/common/extensions';
import { IMessagePassingProtocol } from '../../../../base/parts/ipc/common/ipc';
import { ExtensionActivationReason } from '../../../../workbench/api/common/extHostExtensionActivator';
export declare const nullExtensionDescription: Readonly<IExtensionDescription>;
export declare const IExtensionService: import("../../../../platform/instantiation/common/instantiation").ServiceIdentifier<IExtensionService>;
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
export interface IExtensionService {
    _serviceBrand: undefined;
    /**
     * An event emitted when extensions are registered after their extension points got handled.
     *
     * This event will also fire on startup to signal the installed extensions.
     *
     * @returns the extensions that got registered
     */
    onDidRegisterExtensions: Event<void>;
    /**
     * @event
     * Fired when extensions status changes.
     * The event contains the ids of the extensions that have changed.
     */
    onDidChangeExtensionsStatus: Event<ExtensionIdentifier[]>;
    /**
     * Fired when the available extensions change (i.e. when extensions are added or removed).
     */
    onDidChangeExtensions: Event<void>;
    /**
     * An event that is fired when activation happens.
     */
    onWillActivateByEvent: Event<IWillActivateEvent>;
    /**
     * An event that is fired when an extension host changes its
     * responsive-state.
     */
    onDidChangeResponsiveChange: Event<IResponsiveStateChangeEvent>;
    /**
     * Send an activation event and activate interested extensions.
     */
    activateByEvent(activationEvent: string): Promise<void>;
    /**
     * An promise that resolves when the installed extensions are registered after
     * their extension points got handled.
     */
    whenInstalledExtensionsRegistered(): Promise<boolean>;
    /**
     * Return all registered extensions
     */
    getExtensions(): Promise<IExtensionDescription[]>;
    /**
     * Return a specific extension
     * @param id An extension id
     */
    getExtension(id: string): Promise<IExtensionDescription | undefined>;
    /**
     * Returns `true` if the given extension can be added. Otherwise `false`.
     * @param extension An extension
     */
    canAddExtension(extension: IExtensionDescription): boolean;
    /**
     * Returns `true` if the given extension can be removed. Otherwise `false`.
     * @param extension An extension
     */
    canRemoveExtension(extension: IExtensionDescription): boolean;
    /**
     * Read all contributions to an extension point.
     */
    readExtensionPointContributions<T>(extPoint: IExtensionPoint<T>): Promise<ExtensionPointContribution<T>[]>;
    /**
     * Get information about extensions status.
     */
    getExtensionsStatus(): {
        [id: string]: IExtensionsStatus;
    };
    /**
     * Return the inspect port or `0`, the latter means inspection
     * is not possible.
     */
    getInspectPort(tryEnableInspector: boolean): Promise<number>;
    /**
     * Restarts the extension host.
     */
    restartExtensionHost(): void;
    /**
     * Modify the environment of the remote extension host
     * @param env New properties for the remote extension host
     */
    setRemoteEnvironment(env: {
        [key: string]: string | null;
    }): Promise<void>;
    _logOrShowMessage(severity: Severity, msg: string): void;
    _activateById(extensionId: ExtensionIdentifier, reason: ExtensionActivationReason): Promise<void>;
    _onWillActivateExtension(extensionId: ExtensionIdentifier): void;
    _onDidActivateExtension(extensionId: ExtensionIdentifier, codeLoadingTime: number, activateCallTime: number, activateResolvedTime: number, activationReason: ExtensionActivationReason): void;
    _onExtensionRuntimeError(extensionId: ExtensionIdentifier, err: Error): void;
    _onExtensionHostExit(code: number): void;
}
export interface ProfileSession {
    stop(): Promise<IExtensionHostProfile>;
}
export declare function checkProposedApiEnabled(extension: IExtensionDescription): void;
export declare function throwProposedApiError(extension: IExtensionDescription): never;
export declare function toExtension(extensionDescription: IExtensionDescription): IExtension;
export declare class NullExtensionService implements IExtensionService {
    _serviceBrand: undefined;
    onDidRegisterExtensions: Event<void>;
    onDidChangeExtensionsStatus: Event<ExtensionIdentifier[]>;
    onDidChangeExtensions: Event<void>;
    onWillActivateByEvent: Event<IWillActivateEvent>;
    onDidChangeResponsiveChange: Event<IResponsiveStateChangeEvent>;
    activateByEvent(_activationEvent: string): Promise<void>;
    whenInstalledExtensionsRegistered(): Promise<boolean>;
    getExtensions(): Promise<IExtensionDescription[]>;
    getExtension(): Promise<undefined>;
    readExtensionPointContributions<T>(_extPoint: IExtensionPoint<T>): Promise<ExtensionPointContribution<T>[]>;
    getExtensionsStatus(): {
        [id: string]: IExtensionsStatus;
    };
    getInspectPort(_tryEnableInspector: boolean): Promise<number>;
    restartExtensionHost(): void;
    setRemoteEnvironment(_env: {
        [key: string]: string | null;
    }): Promise<void>;
    canAddExtension(): boolean;
    canRemoveExtension(): boolean;
    _logOrShowMessage(_severity: Severity, _msg: string): void;
    _activateById(_extensionId: ExtensionIdentifier, _reason: ExtensionActivationReason): Promise<void>;
    _onWillActivateExtension(_extensionId: ExtensionIdentifier): void;
    _onDidActivateExtension(_extensionId: ExtensionIdentifier, _codeLoadingTime: number, _activateCallTime: number, _activateResolvedTime: number, _activationReason: ExtensionActivationReason): void;
    _onExtensionRuntimeError(_extensionId: ExtensionIdentifier, _err: Error): void;
    _onExtensionHostExit(code: number): void;
}

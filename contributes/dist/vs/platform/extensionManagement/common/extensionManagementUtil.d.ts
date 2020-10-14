import { ILocalExtension, IGalleryExtension, IExtensionIdentifier, IReportedExtension } from '../../../platform/extensionManagement/common/extensionManagement';
import { ExtensionIdentifier } from '../../../platform/extensions/common/extensions';
export declare function areSameExtensions(a: IExtensionIdentifier, b: IExtensionIdentifier): boolean;
export declare class ExtensionIdentifierWithVersion {
    readonly identifier: IExtensionIdentifier;
    readonly version: string;
    constructor(identifier: IExtensionIdentifier, version: string);
    key(): string;
    equals(o: any): boolean;
}
export declare function adoptToGalleryExtensionId(id: string): string;
export declare function getGalleryExtensionId(publisher: string, name: string): string;
export declare function groupByExtension<T>(extensions: T[], getExtensionIdentifier: (t: T) => IExtensionIdentifier): T[][];
export declare function getLocalExtensionTelemetryData(extension: ILocalExtension): any;
export declare function getGalleryExtensionTelemetryData(extension: IGalleryExtension): any;
export declare const BetterMergeId: ExtensionIdentifier;
export declare function getMaliciousExtensionsSet(report: IReportedExtension[]): Set<string>;

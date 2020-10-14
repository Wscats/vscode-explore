/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { localize } from '../../../nls';
import { Event } from '../../../base/common/event';
import { IPager } from '../../../base/common/paging';
import { createDecorator } from '../../instantiation/common/instantiation';
import { URI } from '../../../base/common/uri';
import { CancellationToken } from '../../../base/common/cancellation';
import { IExtensionManifest, IExtension, ExtensionType } from '../../extensions/common/extensions';
import { IExeBasedExtensionTip } from '../../product/common/productService';

export const EXTENSION_IDENTIFIER_PATTERN = '^([a-z0-9A-Z][a-z0-9\-A-Z]*)\\.([a-z0-9A-Z][a-z0-9\-A-Z]*)$';
export const EXTENSION_IDENTIFIER_REGEX = new RegExp(EXTENSION_IDENTIFIER_PATTERN);

export interface IGalleryExtensionProperties {
	dependencies?: string[];
	extensionPack?: string[];
	engine?: string;
	localizedLanguages?: string[];
}

export interface IGalleryExtensionAsset {
	uri: string;
	fallbackUri: string;
}

export interface IGalleryExtensionAssets {
	manifest: IGalleryExtensionAsset | null;
	readme: IGalleryExtensionAsset | null;
	changelog: IGalleryExtensionAsset | null;
	license: IGalleryExtensionAsset | null;
	repository: IGalleryExtensionAsset | null;
	download: IGalleryExtensionAsset;
	icon: IGalleryExtensionAsset;
	coreTranslations: [string, IGalleryExtensionAsset][];
}

export function isIExtensionIdentifier(thing: any): thing is IExtensionIdentifier {
	return thing
		&& typeof thing === 'object'
		&& typeof thing.id === 'string'
		&& (!thing.uuid || typeof thing.uuid === 'string');
}

/* __GDPR__FRAGMENT__
	"ExtensionIdentifier" : {
		"id" : { "classification": "SystemMetaData", "purpose": "FeatureInsight" },
		"uuid": { "classification": "SystemMetaData", "purpose": "FeatureInsight" }
	}
 */
export interface IExtensionIdentifier {
	id: string;
	uuid?: string;
}

export interface IGalleryExtensionIdentifier extends IExtensionIdentifier {
	uuid: string;
}

export interface IGalleryExtensionVersion {
	version: string;
	date: string;
}

export interface IGalleryExtension {
	name: string;
	identifier: IGalleryExtensionIdentifier;
	version: string;
	date: string;
	displayName: string;
	publisherId: string;
	publisher: string;
	publisherDisplayName: string;
	description: string;
	installCount: number;
	rating: number;
	ratingCount: number;
	assets: IGalleryExtensionAssets;
	properties: IGalleryExtensionProperties;
	telemetryData: any;
	preview: boolean;
}

export interface IGalleryMetadata {
	id: string;
	publisherId: string;
	publisherDisplayName: string;
}

export interface ILocalExtension extends IExtension {
	readonly manifest: IExtensionManifest;
	metadata: IGalleryMetadata;
	readmeUrl: URI | null;
	changelogUrl: URI | null;
}

export const IExtensionManagementService = createDecorator<IExtensionManagementService>('extensionManagementService');
export const IExtensionGalleryService = createDecorator<IExtensionGalleryService>('extensionGalleryService');

export const enum SortBy {
	NoneOrRelevance = 0,
	LastUpdatedDate = 1,
	Title = 2,
	PublisherName = 3,
	InstallCount = 4,
	PublishedDate = 5,
	AverageRating = 6,
	WeightedRating = 12
}

export const enum SortOrder {
	Default = 0,
	Ascending = 1,
	Descending = 2
}

export interface IQueryOptions {
	text?: string;
	ids?: string[];
	names?: string[];
	pageSize?: number;
	sortBy?: SortBy;
	sortOrder?: SortOrder;
	source?: string;
}

export const enum StatisticType {
	Uninstall = 'uninstall'
}

export interface IReportedExtension {
	id: IExtensionIdentifier;
	malicious: boolean;
}

export const enum InstallOperation {
	None = 0,
	Install,
	Update
}

export interface ITranslation {
	contents: { [key: string]: {} };
}

export interface IExtensionGalleryService {
	_serviceBrand: undefined;
	isEnabled(): boolean;
	query(token: CancellationToken): Promise<IPager<IGalleryExtension>>;
	query(options: IQueryOptions, token: CancellationToken): Promise<IPager<IGalleryExtension>>;
	download(extension: IGalleryExtension, location: URI, operation: InstallOperation): Promise<void>;
	reportStatistic(publisher: string, name: string, version: string, type: StatisticType): Promise<void>;
	getReadme(extension: IGalleryExtension, token: CancellationToken): Promise<string>;
	getManifest(extension: IGalleryExtension, token: CancellationToken): Promise<IExtensionManifest | null>;
	getChangelog(extension: IGalleryExtension, token: CancellationToken): Promise<string>;
	getCoreTranslation(extension: IGalleryExtension, languageId: string): Promise<ITranslation | null>;
	getAllVersions(extension: IGalleryExtension, compatible: boolean): Promise<IGalleryExtensionVersion[]>;
	getExtensionsReport(): Promise<IReportedExtension[]>;
	getCompatibleExtension(extension: IGalleryExtension): Promise<IGalleryExtension | null>;
	getCompatibleExtension(id: IExtensionIdentifier, version?: string): Promise<IGalleryExtension | null>;
}

export interface InstallExtensionEvent {
	identifier: IExtensionIdentifier;
	zipPath?: string;
	gallery?: IGalleryExtension;
}

export interface DidInstallExtensionEvent {
	identifier: IExtensionIdentifier;
	operation: InstallOperation;
	zipPath?: string;
	gallery?: IGalleryExtension;
	local?: ILocalExtension;
	error?: string;
}

export interface DidUninstallExtensionEvent {
	identifier: IExtensionIdentifier;
	error?: string;
}

export const INSTALL_ERROR_NOT_SUPPORTED = 'notsupported';
export const INSTALL_ERROR_MALICIOUS = 'malicious';
export const INSTALL_ERROR_INCOMPATIBLE = 'incompatible';

export interface IExtensionManagementService {
	_serviceBrand: undefined;

	onInstallExtension: Event<InstallExtensionEvent>;
	onDidInstallExtension: Event<DidInstallExtensionEvent>;
	onUninstallExtension: Event<IExtensionIdentifier>;
	onDidUninstallExtension: Event<DidUninstallExtensionEvent>;

	zip(extension: ILocalExtension): Promise<URI>;
	unzip(zipLocation: URI, type: ExtensionType): Promise<IExtensionIdentifier>;
	getManifest(vsix: URI): Promise<IExtensionManifest>;
	install(vsix: URI): Promise<ILocalExtension>;
	installFromGallery(extension: IGalleryExtension): Promise<ILocalExtension>;
	uninstall(extension: ILocalExtension, force?: boolean): Promise<void>;
	reinstallFromGallery(extension: ILocalExtension): Promise<void>;
	getInstalled(type?: ExtensionType): Promise<ILocalExtension[]>;
	getExtensionsReport(): Promise<IReportedExtension[]>;

	updateMetadata(local: ILocalExtension, metadata: IGalleryMetadata): Promise<ILocalExtension>;
}

export const DISABLED_EXTENSIONS_STORAGE_PATH = 'extensionsIdentifiers/disabled';
export const ENABLED_EXTENSIONS_STORAGE_PATH = 'extensionsIdentifiers/enabled';
export const IGlobalExtensionEnablementService = createDecorator<IGlobalExtensionEnablementService>('IGlobalExtensionEnablementService');

export interface IGlobalExtensionEnablementService {
	_serviceBrand: undefined;
	readonly onDidChangeEnablement: Event<{ readonly extensions: IExtensionIdentifier[], readonly source?: string }>;

	getDisabledExtensions(): IExtensionIdentifier[];
	enableExtension(extension: IExtensionIdentifier, source?: string): Promise<boolean>;
	disableExtension(extension: IExtensionIdentifier, source?: string): Promise<boolean>;

}

export type IConfigBasedExtensionTip = {
	readonly extensionId: string,
	readonly extensionName: string,
	readonly isExtensionPack: boolean,
	readonly configName: string,
	readonly important: boolean,
};
export type IExecutableBasedExtensionTip = { extensionId: string } & Omit<Omit<IExeBasedExtensionTip, 'recommendations'>, 'important'>;
export type IWorkspaceTips = { readonly remoteSet: string[]; readonly recommendations: string[]; };

export const IExtensionTipsService = createDecorator<IExtensionTipsService>('IExtensionTipsService');
export interface IExtensionTipsService {
	_serviceBrand: undefined;

	getConfigBasedTips(folder: URI): Promise<IConfigBasedExtensionTip[]>;
	getImportantExecutableBasedTips(): Promise<IExecutableBasedExtensionTip[]>;
	getOtherExecutableBasedTips(): Promise<IExecutableBasedExtensionTip[]>;
	getAllWorkspacesTips(): Promise<IWorkspaceTips[]>;
}


// export const DefaultIconPath = require.toUrl('./media/defaultIcon.png');
export const ExtensionsLabel = localize('extensions', "Extensions");
export const ExtensionsChannelId = 'extensions';
export const PreferencesLabel = localize('preferences', "Preferences");

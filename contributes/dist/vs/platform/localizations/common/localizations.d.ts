import { Event } from '../../../base/common/event';
export interface ILocalization {
    languageId: string;
    languageName?: string;
    localizedLanguageName?: string;
    translations: ITranslation[];
    minimalTranslations?: {
        [key: string]: string;
    };
}
export interface ITranslation {
    id: string;
    path: string;
}
export declare const enum LanguageType {
    Core = 1,
    Contributed = 2
}
export declare const ILocalizationsService: import("../../instantiation/common/instantiation").ServiceIdentifier<ILocalizationsService>;
export interface ILocalizationsService {
    _serviceBrand: undefined;
    readonly onDidLanguagesChange: Event<void>;
    getLanguageIds(type?: LanguageType): Promise<string[]>;
}
export declare function isValidLocalization(localization: ILocalization): boolean;

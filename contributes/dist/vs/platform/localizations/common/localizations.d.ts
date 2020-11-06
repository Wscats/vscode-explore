/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 * @author enoyao
 */
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

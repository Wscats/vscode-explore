/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 * @author enoyao
 */


export function getGalleryExtensionId(publisher: string, name: string): string {
	return `${publisher.toLocaleLowerCase()}.${name.toLocaleLowerCase()}`;
}
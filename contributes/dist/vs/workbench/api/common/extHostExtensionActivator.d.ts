/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 * @author enoyao
 */
import { ExtensionIdentifier } from '../../../platform/extensions/common/extensions';
export interface ExtensionActivationReason {
    readonly startup: boolean;
    readonly extensionId: ExtensionIdentifier;
    readonly activationEvent: string;
}

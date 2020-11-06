/**
 * Copyright © 1998 - 2020 Tencent. All Rights Reserved.
 * @author enoyao
 */
import { Event } from '../../../common/event';
import { VSBuffer } from '../../../common/buffer';
export interface IMessagePassingProtocol {
    send(buffer: VSBuffer): void;
    onMessage: Event<VSBuffer>;
}

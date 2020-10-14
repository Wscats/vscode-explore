/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { isWindows, isMacintosh, setImmediate, IProcessEnvironment } from './platform';

interface IProcess {
	platform: string;
	env: IProcessEnvironment;

	cwd(): string;
	nextTick(callback: (...args: any[]) => void): void;
}

declare const process: IProcess;
const safeProcess: IProcess = (typeof process === 'undefined') ? {
	cwd(): string { return '/'; },
	env: Object.create(null),
	get platform(): string { return isWindows ? 'win32' : isMacintosh ? 'darwin' : 'linux'; },
	nextTick(callback: (...args: any[]) => void): void { return setImmediate(callback); }
} : process;

export const cwd = safeProcess.cwd;
export const env = safeProcess.env;
export const platform = safeProcess.platform;
export const nextTick = safeProcess.nextTick;

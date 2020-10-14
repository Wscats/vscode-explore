import * as streams from './stream';
export declare class VSBuffer {
    static alloc(byteLength: number): VSBuffer;
    static wrap(actual: Uint8Array): VSBuffer;
    static fromString(source: string): VSBuffer;
    static concat(buffers: VSBuffer[], totalLength?: number): VSBuffer;
    readonly buffer: Uint8Array;
    readonly byteLength: number;
    private constructor();
    toString(): string;
    slice(start?: number, end?: number): VSBuffer;
    set(array: VSBuffer, offset?: number): void;
    set(array: Uint8Array, offset?: number): void;
    readUInt32BE(offset: number): number;
    writeUInt32BE(value: number, offset: number): void;
    readUInt32LE(offset: number): number;
    writeUInt32LE(value: number, offset: number): void;
    readUInt8(offset: number): number;
    writeUInt8(value: number, offset: number): void;
}
export declare function readUInt16LE(source: Uint8Array, offset: number): number;
export declare function writeUInt16LE(destination: Uint8Array, value: number, offset: number): void;
export declare function readUInt32BE(source: Uint8Array, offset: number): number;
export declare function writeUInt32BE(destination: Uint8Array, value: number, offset: number): void;
export declare function readUInt32LE(source: Uint8Array, offset: number): number;
export declare function writeUInt32LE(destination: Uint8Array, value: number, offset: number): void;
export declare function readUInt8(source: Uint8Array, offset: number): number;
export declare function writeUInt8(destination: Uint8Array, value: number, offset: number): void;
export interface VSBufferReadable extends streams.Readable<VSBuffer> {
}
export interface VSBufferReadableStream extends streams.ReadableStream<VSBuffer> {
}
export interface VSBufferWriteableStream extends streams.WriteableStream<VSBuffer> {
}
export declare function readableToBuffer(readable: VSBufferReadable): VSBuffer;
export declare function bufferToReadable(buffer: VSBuffer): VSBufferReadable;
export declare function streamToBuffer(stream: streams.ReadableStream<VSBuffer>): Promise<VSBuffer>;
export declare function bufferToStream(buffer: VSBuffer): streams.ReadableStream<VSBuffer>;
export declare function streamToBufferReadableStream(stream: streams.ReadableStreamEvents<Uint8Array | string>): streams.ReadableStream<VSBuffer>;
export declare function newWriteableBufferStream(): streams.WriteableStream<VSBuffer>;

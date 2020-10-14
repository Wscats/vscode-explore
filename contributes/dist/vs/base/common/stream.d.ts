/**
 * The payload that flows in readable stream events.
 */
export declare type ReadableStreamEventPayload<T> = T | Error | 'end';
export interface ReadableStreamEvents<T> {
    /**
     * The 'data' event is emitted whenever the stream is
     * relinquishing ownership of a chunk of data to a consumer.
     */
    on(event: 'data', callback: (data: T) => void): void;
    /**
     * Emitted when any error occurs.
     */
    on(event: 'error', callback: (err: Error) => void): void;
    /**
     * The 'end' event is emitted when there is no more data
     * to be consumed from the stream. The 'end' event will
     * not be emitted unless the data is completely consumed.
     */
    on(event: 'end', callback: () => void): void;
}
/**
 * A interface that emulates the API shape of a node.js readable
 * stream for use in desktop and web environments.
 */
export interface ReadableStream<T> extends ReadableStreamEvents<T> {
    /**
     * Stops emitting any events until resume() is called.
     */
    pause(): void;
    /**
     * Starts emitting events again after pause() was called.
     */
    resume(): void;
    /**
     * Destroys the stream and stops emitting any event.
     */
    destroy(): void;
}
/**
 * A interface that emulates the API shape of a node.js readable
 * for use in desktop and web environments.
 */
export interface Readable<T> {
    /**
     * Read data from the underlying source. Will return
     * null to indicate that no more data can be read.
     */
    read(): T | null;
}
/**
 * A interface that emulates the API shape of a node.js writeable
 * stream for use in desktop and web environments.
 */
export interface WriteableStream<T> extends ReadableStream<T> {
    /**
     * Writing data to the stream will trigger the on('data')
     * event listener if the stream is flowing and buffer the
     * data otherwise until the stream is flowing.
     */
    write(data: T): void;
    /**
     * Signals an error to the consumer of the stream via the
     * on('error') handler if the stream is flowing.
     */
    error(error: Error): void;
    /**
     * Signals the end of the stream to the consumer. If the
     * result is not an error, will trigger the on('data') event
     * listener if the stream is flowing and buffer the data
     * otherwise until the stream is flowing.
     *
     * In case of an error, the on('error') event will be used
     * if the stream is flowing.
     */
    end(result?: T | Error): void;
}
export declare function isReadableStream<T>(obj: unknown): obj is ReadableStream<T>;
export interface IReducer<T> {
    (data: T[]): T;
}
export interface IDataTransformer<Original, Transformed> {
    (data: Original): Transformed;
}
export interface IErrorTransformer {
    (error: Error): Error;
}
export interface ITransformer<Original, Transformed> {
    data: IDataTransformer<Original, Transformed>;
    error?: IErrorTransformer;
}
export declare function newWriteableStream<T>(reducer: IReducer<T>): WriteableStream<T>;
/**
 * Helper to fully read a T readable into a T.
 */
export declare function consumeReadable<T>(readable: Readable<T>, reducer: IReducer<T>): T;
/**
 * Helper to read a T readable up to a maximum of chunks. If the limit is
 * reached, will return a readable instead to ensure all data can still
 * be read.
 */
export declare function consumeReadableWithLimit<T>(readable: Readable<T>, reducer: IReducer<T>, maxChunks: number): T | Readable<T>;
/**
 * Helper to fully read a T stream into a T.
 */
export declare function consumeStream<T>(stream: ReadableStream<T>, reducer: IReducer<T>): Promise<T>;
/**
 * Helper to read a T stream up to a maximum of chunks. If the limit is
 * reached, will return a stream instead to ensure all data can still
 * be read.
 */
export declare function consumeStreamWithLimit<T>(stream: ReadableStream<T>, reducer: IReducer<T>, maxChunks: number): Promise<T | ReadableStream<T>>;
/**
 * Helper to create a readable stream from an existing T.
 */
export declare function toStream<T>(t: T, reducer: IReducer<T>): ReadableStream<T>;
/**
 * Helper to convert a T into a Readable<T>.
 */
export declare function toReadable<T>(t: T): Readable<T>;
/**
 * Helper to transform a readable stream into another stream.
 */
export declare function transform<Original, Transformed>(stream: ReadableStreamEvents<Original>, transformer: ITransformer<Original, Transformed>, reducer: IReducer<Transformed>): ReadableStream<Transformed>;

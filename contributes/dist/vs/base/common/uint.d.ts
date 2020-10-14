export declare const enum Constants {
    /**
     * MAX SMI (SMall Integer) as defined in v8.
     * one bit is lost for boxing/unboxing flag.
     * one bit is lost for sign flag.
     * See https://thibaultlaurens.github.io/javascript/2013/04/29/how-the-v8-engine-works/#tagged-values
     */
    MAX_SAFE_SMALL_INTEGER = 1073741824,
    /**
     * MIN SMI (SMall Integer) as defined in v8.
     * one bit is lost for boxing/unboxing flag.
     * one bit is lost for sign flag.
     * See https://thibaultlaurens.github.io/javascript/2013/04/29/how-the-v8-engine-works/#tagged-values
     */
    MIN_SAFE_SMALL_INTEGER = -1073741824,
    /**
     * Max unsigned integer that fits on 8 bits.
     */
    MAX_UINT_8 = 255,
    /**
     * Max unsigned integer that fits on 16 bits.
     */
    MAX_UINT_16 = 65535,
    /**
     * Max unsigned integer that fits on 32 bits.
     */
    MAX_UINT_32 = 4294967295,
    UNICODE_SUPPLEMENTARY_PLANE_BEGIN = 65536
}
export declare function toUint8(v: number): number;
export declare function toUint32(v: number): number;

export declare function isFalsyOrWhitespace(str: string | undefined): boolean;
/**
 * @deprecated ES6: use `String.padStart`
 */
export declare function pad(n: number, l: number, char?: string): string;
/**
 * Helper to produce a string with a variable number of arguments. Insert variable segments
 * into the string using the {n} notation where N is the index of the argument following the string.
 * @param value string to which formatting is applied
 * @param args replacements for {n}-entries
 */
export declare function format(value: string, ...args: any[]): string;
/**
 * Converts HTML characters inside the string to use entities instead. Makes the string safe from
 * being used e.g. in HTMLElement.innerHTML.
 */
export declare function escape(html: string): string;
/**
 * Escapes regular expression characters in a given string
 */
export declare function escapeRegExpCharacters(value: string): string;
/**
 * Removes all occurrences of needle from the beginning and end of haystack.
 * @param haystack string to trim
 * @param needle the thing to trim (default is a blank)
 */
export declare function trim(haystack: string, needle?: string): string;
/**
 * Removes all occurrences of needle from the beginning of haystack.
 * @param haystack string to trim
 * @param needle the thing to trim
 */
export declare function ltrim(haystack: string, needle: string): string;
/**
 * Removes all occurrences of needle from the end of haystack.
 * @param haystack string to trim
 * @param needle the thing to trim
 */
export declare function rtrim(haystack: string, needle: string): string;
export declare function convertSimple2RegExpPattern(pattern: string): string;
export declare function stripWildcards(pattern: string): string;
/**
 * @deprecated ES6: use `String.startsWith`
 */
export declare function startsWith(haystack: string, needle: string): boolean;
/**
 * @deprecated ES6: use `String.endsWith`
 */
export declare function endsWith(haystack: string, needle: string): boolean;
export interface RegExpOptions {
    matchCase?: boolean;
    wholeWord?: boolean;
    multiline?: boolean;
    global?: boolean;
    unicode?: boolean;
}
export declare function createRegExp(searchString: string, isRegex: boolean, options?: RegExpOptions): RegExp;
export declare function regExpLeadsToEndlessLoop(regexp: RegExp): boolean;
export declare function regExpContainsBackreference(regexpValue: string): boolean;
export declare function regExpFlags(regexp: RegExp): string;
/**
 * Returns first index of the string that is not whitespace.
 * If string is empty or contains only whitespaces, returns -1
 */
export declare function firstNonWhitespaceIndex(str: string): number;
/**
 * Returns the leading whitespace of the string.
 * If the string contains only whitespaces, returns entire string
 */
export declare function getLeadingWhitespace(str: string, start?: number, end?: number): string;
/**
 * Returns last index of the string that is not whitespace.
 * If string is empty or contains only whitespaces, returns -1
 */
export declare function lastNonWhitespaceIndex(str: string, startIndex?: number): number;
export declare function compare(a: string, b: string): number;
export declare function compareSubstring(a: string, b: string, aStart?: number, aEnd?: number, bStart?: number, bEnd?: number): number;
export declare function compareIgnoreCase(a: string, b: string): number;
export declare function compareSubstringIgnoreCase(a: string, b: string, aStart?: number, aEnd?: number, bStart?: number, bEnd?: number): number;
export declare function isLowerAsciiLetter(code: number): boolean;
export declare function isUpperAsciiLetter(code: number): boolean;
export declare function equalsIgnoreCase(a: string, b: string): boolean;
export declare function startsWithIgnoreCase(str: string, candidate: string): boolean;
/**
 * @returns the length of the common prefix of the two strings.
 */
export declare function commonPrefixLength(a: string, b: string): number;
/**
 * @returns the length of the common suffix of the two strings.
 */
export declare function commonSuffixLength(a: string, b: string): number;
/**
 * See http://en.wikipedia.org/wiki/Surrogate_pair
 */
export declare function isHighSurrogate(charCode: number): boolean;
/**
 * See http://en.wikipedia.org/wiki/Surrogate_pair
 */
export declare function isLowSurrogate(charCode: number): boolean;
/**
 * See http://en.wikipedia.org/wiki/Surrogate_pair
 */
export declare function computeCodePoint(highSurrogate: number, lowSurrogate: number): number;
/**
 * get the code point that begins at offset `offset`
 */
export declare function getNextCodePoint(str: string, len: number, offset: number): number;
export declare function nextCharLength(str: string, offset: number): number;
export declare function prevCharLength(str: string, offset: number): number;
export declare function getCharContainingOffset(str: string, offset: number): [number, number];
/**
 * A manual encoding of `str` to UTF8.
 * Use only in environments which do not offer native conversion methods!
 */
export declare function encodeUTF8(str: string): Uint8Array;
/**
 * A manual decoding of a UTF8 string.
 * Use only in environments which do not offer native conversion methods!
 */
export declare function decodeUTF8(buffer: Uint8Array): string;
/**
 * Returns true if `str` contains any Unicode character that is classified as "R" or "AL".
 */
export declare function containsRTL(str: string): boolean;
export declare function containsEmoji(str: string): boolean;
/**
 * Returns true if `str` contains only basic ASCII characters in the range 32 - 126 (including 32 and 126) or \n, \r, \t
 */
export declare function isBasicASCII(str: string): boolean;
export declare const UNUSUAL_LINE_TERMINATORS: RegExp;
/**
 * Returns true if `str` contains unusual line terminators, like LS, PS or NEL
 */
export declare function containsUnusualLineTerminators(str: string): boolean;
export declare function containsFullWidthCharacter(str: string): boolean;
export declare function isFullWidthCharacter(charCode: number): boolean;
/**
 * A fast function (therefore imprecise) to check if code points are emojis.
 * Generated using https://github.com/alexandrudima/unicode-utils/blob/master/generate-emoji-test.js
 */
export declare function isEmojiImprecise(x: number): boolean;
/**
 * Given a string and a max length returns a shorted version. Shorting
 * happens at favorable positions - such as whitespace or punctuation characters.
 */
export declare function lcut(text: string, n: number): string;
export declare function removeAnsiEscapeCodes(str: string): string;
export declare const UTF8_BOM_CHARACTER: string;
export declare function startsWithUTF8BOM(str: string): boolean;
export declare function stripUTF8BOM(str: string): string;
export declare function safeBtoa(str: string): string;
/**
 * @deprecated ES6
 */
export declare function repeat(s: string, count: number): string;
/**
 * Checks if the characters of the provided query string are included in the
 * target string. The characters do not have to be contiguous within the string.
 */
export declare function fuzzyContains(target: string, query: string): boolean;
export declare function containsUppercaseCharacter(target: string, ignoreEscapedChars?: boolean): boolean;
export declare function uppercaseFirstLetter(str: string): string;
export declare function getNLines(str: string, n?: number): string;
/**
 * Produces 'a'-'z', followed by 'A'-'Z'... followed by 'a'-'z', etc.
 */
export declare function singleLetterHash(n: number): string;
export declare function getGraphemeBreakType(codePoint: number): GraphemeBreakType;
export declare function breakBetweenGraphemeBreakType(breakTypeA: GraphemeBreakType, breakTypeB: GraphemeBreakType): boolean;
export declare const enum GraphemeBreakType {
    Other = 0,
    Prepend = 1,
    CR = 2,
    LF = 3,
    Control = 4,
    Extend = 5,
    Regional_Indicator = 6,
    SpacingMark = 7,
    L = 8,
    V = 9,
    T = 10,
    LV = 11,
    LVT = 12,
    ZWJ = 13,
    Extended_Pictographic = 14
}

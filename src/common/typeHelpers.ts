/**
 * Get the item type of an array type. If the type is not an array, it returns the type itself.
 * @example
 * type T1 = ArrayItemType<string[]>; // T1 is string
 * type T2 = ArrayItemType<number>; // T2 is number
 * type T3 = ArrayItemType<readonly boolean[]>; // T3 is boolean
 */
export type ArrayItemType<T> = T extends readonly (infer U)[] ? U : T;

/**
 * Recursively get the item type of a nested array type. If the type is not an array, it returns the type itself.
 * @example
 * type T1 = DeepArrayItemType<string[][][]>; // T1 is string
 * type T2 = DeepArrayItemType<number>; // T2 is number
 * type T3 = DeepArrayItemType<readonly boolean[][]>; // T3 is boolean
 */
export type DeepArrayItemType<T> = T extends readonly (infer U)[] ? DeepArrayItemType<U> : T;

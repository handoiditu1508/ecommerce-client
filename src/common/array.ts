export const distinct = <T extends number | string>(arr: T[]): T[] => [...new Set(arr)];

export const percentFormat = (value: number) => `${value}%`;
export const reversedPercentFormat = (value: number) => `${100 - value}%`;
export const camelToKebabCase = (value: string) => value.replace(/[A-Z]/g, (c) => `-${c.toLowerCase()}`);
export const camelToTitleCase = (value: string) => value.charAt(0).toUpperCase() + value.replace(/[A-Z]/g, (c) => ` ${c}`).slice(1);
export const kebabToTitleCase = (value: string) => value.replace(/(^\w|-\w)/g, (s) => s.replace(/-/, " ").toUpperCase());
export const kebabToPascalCase = (value: string) => value.replace(/(^\w|-\w)/g, kebabReplacer);
export const kebabToCamelCase = (value: string) => value.replace(/-\w/g, kebabReplacer);

const kebabReplacer = (substring: string) => substring.replace(/-/, "").toUpperCase();

import { INSERT_CHECK_LIST_COMMAND, INSERT_ORDERED_LIST_COMMAND, INSERT_UNORDERED_LIST_COMMAND } from "@lexical/list";
import { HeadingTagType } from "@lexical/rich-text";

export type ListType = "bullet" | "number" | "check";
export type BlockType = "paragraph" | HeadingTagType | "quote" | "code";
export type BlockSelectValue = BlockType | ListType;

export const LIST_COMMANDS: Record<ListType, typeof INSERT_UNORDERED_LIST_COMMAND> = {
  bullet: INSERT_UNORDERED_LIST_COMMAND,
  number: INSERT_ORDERED_LIST_COMMAND,
  check: INSERT_CHECK_LIST_COMMAND,
};

export function isListType(value: BlockSelectValue): value is ListType {
  return value === "bullet" || value === "number" || value === "check";
}

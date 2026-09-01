import { $createHorizontalRuleNode, INSERT_HORIZONTAL_RULE_COMMAND } from "@lexical/react/LexicalHorizontalRuleNode";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $insertNodeToNearestRoot } from "@lexical/utils";
import { COMMAND_PRIORITY_EDITOR } from "lexical";
import { useEffect } from "react";

// The bundled `HorizontalRulePlugin` component is a legacy no-op in this Lexical version; register
// the command handler ourselves, matching the pattern used for images/embeds.
function HorizontalRulePlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => editor.registerCommand(
    INSERT_HORIZONTAL_RULE_COMMAND,
    () => {
      $insertNodeToNearestRoot($createHorizontalRuleNode());

      return true;
    },
    COMMAND_PRIORITY_EDITOR,
  ), [editor]);

  return null;
}

export default HorizontalRulePlugin;

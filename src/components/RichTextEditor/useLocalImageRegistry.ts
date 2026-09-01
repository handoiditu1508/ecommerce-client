import { LexicalEditor } from "lexical";
import { v1 as uuidv1 } from "uuid";

type LocalImageRegistryEntry = {
  file: File;
  objectUrl: string;
};

export type LocalImageRegistry = {
  registerLocalFile: (file: File) => string;
  getLocalFile: (localId: string) => File | undefined;
  getObjectUrl: (localId: string) => string | undefined;
  resolve: (localId: string) => void;
  clear: () => void;
};

// Scoped per LexicalEditor instance so multiple RichTextEditor mounts never share pending files.
const registries = new WeakMap<LexicalEditor, LocalImageRegistry>();

function createLocalImageRegistry(): LocalImageRegistry {
  const entries = new Map<string, LocalImageRegistryEntry>();

  return {
    registerLocalFile(file) {
      const localId = uuidv1();
      entries.set(localId, { file, objectUrl: URL.createObjectURL(file) });

      return localId;
    },
    getLocalFile(localId) {
      return entries.get(localId)?.file;
    },
    getObjectUrl(localId) {
      return entries.get(localId)?.objectUrl;
    },
    resolve(localId) {
      const entry = entries.get(localId);
      if (!entry) return;
      URL.revokeObjectURL(entry.objectUrl);
      entries.delete(localId);
    },
    clear() {
      entries.forEach((entry) => URL.revokeObjectURL(entry.objectUrl));
      entries.clear();
    },
  };
}

export function getLocalImageRegistry(editor: LexicalEditor): LocalImageRegistry {
  let registry = registries.get(editor);
  if (!registry) {
    registry = createLocalImageRegistry();
    registries.set(editor, registry);
  }

  return registry;
}

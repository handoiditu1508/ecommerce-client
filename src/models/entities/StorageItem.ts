export type SimpleFileView = {
  id: string;
  name: string;
  filePath: string;
  /**
   * Echoes back the `localId` submitted for this file in `UploadProductImagesCommand.localIds`.
   * Only populated for files uploaded in the current request; not persisted.
   */
  localId?: string;
};

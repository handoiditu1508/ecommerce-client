/**
 * Converts an object to FormData, handling FileList instances and primitive values.
 * @param data - Object with string keys and values of FileList, string, number, boolean, or undefined
 * @returns FormData instance with appended entries
 */
export function objectToFormData(
  data: Record<string, FileList | string | number | boolean | undefined | null>,
): FormData {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof FileList) {
      Array.from(value).forEach((file) => formData.append(key, file));
    } else if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });

  return formData;
}

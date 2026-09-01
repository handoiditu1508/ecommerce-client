/**
 * Converts an object to FormData, handling FileList instances, arrays, and primitive values.
 * @param data - Object with string keys and values of FileList, an array of files/primitives, string, number, boolean, or undefined
 * @returns FormData instance with appended entries
 */
type FormDataPrimitive = string | number | boolean | undefined | null;

type FormDataValue = FileList | (File | FormDataPrimitive)[] | FormDataPrimitive;

export function objectToFormData(
  data: Record<string, FormDataValue>,
): FormData {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value instanceof FileList) {
      Array.from(value).forEach((file) => formData.append(key, file));
    } else if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item instanceof File) {
          formData.append(key, item);
        } else if (item !== undefined && item !== null) {
          formData.append(key, item.toString());
        }
      });
    } else if (value !== undefined && value !== null) {
      formData.append(key, value.toString());
    }
  });

  return formData;
}

import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const loadFileFromUrl = async (url: string, name?: string): Promise<File> => {
  const response = await axios.get<Blob>(url, { responseType: "blob" });
  const file = new File([response.data], name || uuidv4(), { type: response.headers["content-type"] });

  return file;
};

import CONFIG from "@/configs";

const ABSOLUTE_URL_REGEX = /^https?:\/\//i;

/**
 * Resolves a path that may already be an absolute URL (e.g. a third-party provider's image)
 * or a server-relative path (e.g. an uploaded file) into an absolute URL.
 */
export const resolveFileUrl = (path?: string | null): string | undefined => {
  if (!path) {
    return undefined;
  }

  return ABSOLUTE_URL_REGEX.test(path) ? path : `${CONFIG.FILE_URL}${path}`;
};

export const currentUrlWithPage = (page?: number | null, paramName: string = "page"): URL => {
  const url = new URL(window.location.href);
  if (page) {
    url.searchParams.set(paramName, page.toString());
  }

  return url;
};

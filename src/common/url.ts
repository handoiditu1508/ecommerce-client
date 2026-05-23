export const currentUrlWithPage = (page?: number | null, paramName: string = "page"): URL => {
  const url = new URL(window.location.href);
  if (page) {
    url.searchParams.set(paramName, page.toString());
  }

  return url;
};

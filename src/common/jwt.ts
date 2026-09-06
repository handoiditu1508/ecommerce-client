/**
 * Decodes the payload of a JWT without verifying its signature.
 * Only use this to read informational claims client-side (e.g. email for display);
 * the server independently verifies the token's signature and claims.
 */
export function decodeJwtPayload<T>(token: string): T | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((char) => `%${char.charCodeAt(0).toString(16)
          .padStart(2, "0")}`)
        .join("")
    );

    return JSON.parse(json) as T;
  } catch {
    return null;
  }
}

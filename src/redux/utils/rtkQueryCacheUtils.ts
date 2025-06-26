import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

/**
 * Default tags used by the cacher helpers
 */
export const defaultTags = ["UNAUTHORIZED", "UNKNOWN_ERROR"] as const;
export type DefaultTags = typeof defaultTags[number];
export const entityTags = ["Post"] as const;
export type EntityTags = typeof entityTags[number];
export const allTags = [
  ...defaultTags,
  ...entityTags,
] as const;

/**
 * An individual cache item
 */
export type CacheItem<T extends EntityTags, ID extends string | number> = {
  type: T;
  id: ID;
};

/**
 * A list of cache items, including a LIST entity cache
 */
export type CacheList<T extends EntityTags, ID extends string | number> = (
  | CacheItem<T, "LIST">
  | CacheItem<T, `LIST-${string}`>// invalidate only lists that contain specific id without invalidate getById
  | CacheItem<T, ID>
  | DefaultTags
)[];

/**
 * ```ts
 * providesListTags("Post", [{ id: 2 }, { id: 5 }], error);
 * // return
 * [{ type: "Post", id: "LIST" }, { type: "Post", id: 2 }, { type: "Post", id: "LIST-2" }, { type: "Post", id: 5 }, { type: "Post", id: "LIST-5" }
 * // or
 * [{ type: "Post", id: "LIST" }, "UNAUTHORIZED"]
 * // or
 * [{ type: "Post", id: "LIST" }, "UNKNOWN_ERROR"]
 * ```
 * @param tagType Tag type.
 * @param resultsWithIds Array of entities.
 * @param error Error object returned by RTK Query.
 * @returns Array of tags.
 */
export function providesListTags<T extends EntityTags, R extends { id: string | number; }>(
  tagType: T,
  resultsWithIds: R[] | undefined,
  error: FetchBaseQueryError | undefined
): CacheList<T, R["id"]> {
  var tags: CacheList<T, R["id"]> = [{ type: tagType, id: "LIST" }];

  if (resultsWithIds) {
    tags.push(...resultsWithIds.flatMap(({ id }) => [
      { type: tagType, id },
      { type: tagType, id: `LIST-${id}` },
    ]));
  }

  if (error) {
    tags.push(error.status === 401 ? "UNAUTHORIZED" : "UNKNOWN_ERROR");
  }

  return tags;
}

/**
 * ```ts
 * providesIdTag("Post", 2, error);
 * // return
 * [{ type: "Post", id: 2 }]
 * // or
 * [{ type: "Post", id: 2 }, "UNAUTHORIZED"]
 * // or
 * [{ type: "Post", id: 2 }, "UNKNOWN_ERROR"]
 * ```
 * @param tagType Tag type.
 * @param id Entity id.
 * @param error Error object returned by RTK Query.
 * @returns Array of tags.
 */
export function providesIdTag<T extends EntityTags, ID extends string | number>(
  tagType: T,
  id: ID,
  error: FetchBaseQueryError | undefined
): CacheList<T, ID> {
  var tags: CacheList<T, ID> = [{ type: tagType, id }];

  if (error) {
    tags.push(error.status === 401 ? "UNAUTHORIZED" : "UNKNOWN_ERROR");
  }

  return tags;
}

/**
 * ```ts
 * invalidatesListTag("Post", error);
 * // return
 * [{ type: "Post", id: "List" }]
 * // or
 * []
 * ```
 * @param tagType Tag type.
 * @param error Error object returned by RTK Query.
 * @returns Array of tags.
 */
export function invalidatesListTag<T extends EntityTags>(
  tagType: T,
  error: FetchBaseQueryError | undefined
): CacheList<T, "LIST"> {
  return error ? [] : [{ type: tagType, id: "LIST" }];
}

/**
 * ```ts
 * invalidatesIdTag("Post", 2, error);
 * // return
 * [{ type: "Post", id: 2 }]
 * // or
 * []
 * ```
 * @param tagType Tag type.
 * @param id Entity id.
 * @param error Error object returned by RTK Query.
 * @returns Array of tags.
 */
export function invalidatesIdTag<T extends EntityTags, ID extends string | number>(
  tagType: T,
  id: ID,
  error: FetchBaseQueryError | undefined
): CacheList<T, ID> {
  return error ? [] : [{ type: tagType, id: id }];
}

/**
 * ```ts
 * invalidatesOptimisticPessimisticIdTag("Post", 2, error);
 * // return
 * [{ type: "Post", id: 2 }]
 * // or
 * [{ type: "Post", id: "LIST-2" }]
 * ```
 * @param tagType Tag type.
 * @param id Entity id.
 * @param error Error object returned by RTK Query.
 * @returns Array of tags.
 */
export function invalidatesOptimisticPessimisticIdTag<T extends EntityTags, ID extends string | number>(
  tagType: T,
  id: ID,
  error: FetchBaseQueryError | undefined
): CacheList<T, ID> {
  return error ? [{ type: tagType, id }] : [{ type: tagType, id: `LIST-${id}` }];
}

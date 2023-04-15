// Read more: https://relay.dev/graphql/connections.htm#
import { ObjectId } from "mongodb";
import { UserInputError } from "../errors/index.js";

export interface Edge<T> {
  cursor: string;
  node: NonNullable<T>;
}

export interface PageInfo {
  startCursor: string;
  endCursor: string;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface Connection<T> {
  edges: Edge<T>[];
  pageInfo: PageInfo;
}

export interface WithIndex {
  [key: string]: any;
}

export type PaginationArgs<T> = {
  allEdges: T[];
  before?: string | null;
  after?: string | null;
  first?: number | null;
  last?: number | null;
};

/**
 * Transforms data to Edges
 *
 * @param cursorField - Which field in the object we want as the cursor, e.g.: id
 */
export const transformDataToEdges = <T extends WithIndex>(
  data: T[],
  cursorField: string
): Edge<T>[] =>
  data.map(item => {
    let cursor = item[cursorField];

    if (cursor instanceof ObjectId) {
      cursor = cursor.toHexString();
    }

    return { cursor, node: item };
  });

/**
 * Slice edges based on before or after cursor.

 * @param after - If provided, return edges after and excluding the edge this cursor points to
 * @param before - If provided, return edges before and excluding the edge this cursor points to
 */
export const applyCursorsToEdges = <T extends Edge<any>>({
  allEdges,
  before,
  after
}: {
  allEdges: T[];
  before?: string | null;
  after?: string | null;
}) => {
  let edges = allEdges;

  // forward pagination
  if (after) {
    let afterEdgeIndex = edges.findIndex(edge => edge.cursor === after);

    if (afterEdgeIndex >= 0) {
      // Remove all elements of edges before and including afterEdge.
      edges = edges.slice(afterEdgeIndex + 1);
    }
  }

  // backward pagination
  if (before) {
    let beforeEdgeIndex = edges.findIndex(edge => edge.cursor === before);

    if (beforeEdgeIndex >= 0) {
      // Remove all elements of edges after and including beforeEdge.
      edges = edges.slice(0, beforeEdgeIndex);
    }
  }

  return edges;
};

/**
 * Slice and return [first] or [last] number of edges from
 * pre-processed edges array by applyCursorsToEdges,
 * slice from the start if after and first are provided,
 * slice from the end if before and last are provided,
 *
 * @param before - Cursor of the first element in the previous page
 * @param after - Cursor of the last element in the previous page
 * @param first - Number of elements to return
 * @param last - Number of elements to return
 */
export const edgesToReturn = <T extends Edge<any>>({
  allEdges,
  before,
  after,
  first,
  last
}: PaginationArgs<T>) => {
  let edges = applyCursorsToEdges({ allEdges, after, before });

  // forward pagination
  if (first) {
    if (first < 0) {
      throw new UserInputError("Invalid limit input");
    }

    if (edges.length > first) {
      // Slice edges to be of length first from the start of edges
      edges = edges.slice(0, first);
    }
  }

  // backward pagination
  if (last) {
    if (last < 0) {
      throw new UserInputError("Invalid limit input");
    }
    if (edges.length > last) {
      // Slice edges to be of length last from the end of edges
      edges = edges.slice(-last);
    }
  }

  // no first is provided, return all edges
  return edges;
};

/**
 * Returns a boolean value indicating whether
 * there's a next page
 */
export const getHasNextPage = <T extends Edge<any>>({
  allEdges,
  before,
  after,
  first,
  last
}: PaginationArgs<T>) => {
  // forward pagination
  if (first) {
    let edges = applyCursorsToEdges({ allEdges, after, before });
    // the remaining edges contains more than [first] number of elements
    // which means there's a next page
    if (edges.length > first) {
      return true;
    }

    return false;
  }

  // backward pagination
  if (before) {
    let beforeEdgeIndex = allEdges.findIndex(edge => edge.cursor === before);
    // The edge with [before] cursor is not the first one in the edges array,
    // which means there's a next page
    if (beforeEdgeIndex > 0) {
      return true;
    }
  }

  return false;
};

/**
 * Returns a boolean value indicating whether
 * there's a previous page
 */
export const getHasPreviousPage = <T extends Edge<any>>({
  allEdges,
  before,
  after,
  first,
  last
}: PaginationArgs<T>) => {
  // backward pagination
  if (last) {
    let edges = applyCursorsToEdges({ allEdges, after, before });
    // The remaining edges contains more than [last] number of elements
    // which means there's a previous page
    if (edges.length > last) {
      return true;
    }
    return false;
  }

  // forward pagination
  if (after) {
    let afterEdgeIndex = allEdges.findIndex(edge => edge.cursor === after);
    // There exists an element before the [after] edge, which means there's a previous page
    if (afterEdgeIndex > 0) {
      return true;
    }
  }
  return false;
};

/**
 * Transforms an array of documents from the database to a GraphQL Connections-compliant query result object
 */
export const transformDataToConnection = <T extends WithIndex>({
  data,
  cursorField = "_id",
  ...paginationArgs
}: {
  data: T[];
  before?: string | null;
  after?: string | null;
  first?: number | null;
  last?: number | null;
  cursorField?: string;
}): Connection<T> => {
  const allEdges = transformDataToEdges(data, cursorField);

  const edges = edgesToReturn({
    allEdges,
    ...paginationArgs
  });

  const hasNextPage = getHasNextPage({
    allEdges,
    ...paginationArgs
  });

  const hasPreviousPage = getHasPreviousPage({
    allEdges,
    ...paginationArgs
  });

  // The cursor of the first/last element in edges.
  // API consumers can then use this cursor
  // to request number of elements before/after this element
  const startCursor = edges.at(0)?.cursor || "";
  const endCursor = edges.at(-1)?.cursor || "";

  return {
    edges,
    pageInfo: {
      startCursor,
      endCursor,
      hasNextPage,
      hasPreviousPage
    }
  };
};

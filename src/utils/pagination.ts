// Read more: https://relay.dev/graphql/connections.htm#
import { ObjectId } from "mongodb";
import { UserInputError } from "../errors/index.js";

interface Edge<T> {
  cursor: string;
  node: NonNullable<T>;
}

interface WithIndex {
  [key: string]: any;
}

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
 * Removes all elements of edges before and including
 * the element that after points to.
 * @param after - Cursor to slice edges with
 */
export const applyCursorsToEdges = <T extends Edge<any>>({
  allEdges,
  after
}: {
  allEdges: T[];
  after?: string | null;
}) => {
  let edges = allEdges;

  if (after) {
    let afterEdgeIndex = edges.findIndex(edge => edge.cursor === after);

    if (afterEdgeIndex >= 0) {
      edges = edges.slice(afterEdgeIndex + 1);
    }
  }

  return edges;
};

/**
 * Returns the first [first] number of elements from
 * pre-processed edges array by applyCursorsToEdges

 * @param after - Cursor of the last element in the previous page
 * @param first - Number of elements to return
 */
export const edgesToReturn = <T extends Edge<any>>({
  allEdges,
  after,
  first
}: {
  allEdges: T[];
  after?: string | null;
  first?: number | null;
}) => {
  let edges = applyCursorsToEdges({ allEdges, after });

  if (first) {
    if (first < 0) {
      throw new UserInputError("Invalid limit input");
    }

    if (edges.length > first) {
      // Slice edges to be of length first
      edges = edges.slice(0, first);
    }
  }
  // no first is provided, return all edges
  return edges;
};

/**
 * Returns a boolean value indicating whether
 * there's a next page

 * @param after - Cursor of the last element in the previous page
 * @param first - Number of elements to return
 */
export const isHasNextPage = <T extends Edge<any>>({
  allEdges,
  after,
  first
}: {
  allEdges: T[];
  after?: string | null;
  first?: number | null;
}) => {
  if (first) {
    let edges = applyCursorsToEdges({ allEdges, after });
    if (edges.length > first) {
      return true;
    }
    return false;
  }
  return false;
};

/**
 * Returns a boolean value indicating whether
 * there's a previous page

 * @param after - Cursor of the last element in the previous page
 */
export const isHasPreviousPage = <T extends Edge<any>>({
  allEdges,
  after
}: {
  allEdges: T[];
  after?: string | null;
}) => {
  if (after) {
    let afterEdgeIndex = allEdges.findIndex(edge => edge.cursor === after);
    // There exists an element before the [after] edge, which means there's a previous page
    if (afterEdgeIndex > 0) {
      return true;
    }
  }
  return false;
};

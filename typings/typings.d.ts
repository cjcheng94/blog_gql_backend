export interface WithIndexSignature {
  [index: string]: any;
}
export type WithIndex<T> = T & WithIndexSignature;

declare module "Utils" {
  interface WithIndexSignature {
    [index: string]: any;
  }
  type WithIndex<T> = T & WithIndexSignature;
}

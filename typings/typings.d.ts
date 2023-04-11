import { Db } from "mongodb";

export interface WithIndexSignature {
  [index: string]: any;
}
export type WithIndex<T> = T & WithIndexSignature;

export type DecodedToken = {
  username: string;
  userId: string;
  iat: number;
  exp: number;
};

export interface Context {
  db: Db;
  userData: DecodedToken;
  isAuthed: boolean;
  isAdmin: boolean;
}

import { ApolloError } from "apollo-server";

export default class ConflictError extends ApolloError {
  constructor(message: string) {
    super(message, "CONFLICT");
    Object.defineProperty(this, "name", { value: "CONFLICT" });
  }
}

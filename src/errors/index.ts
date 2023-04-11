import { GraphQLError } from "graphql";

export class ForbiddenError extends GraphQLError {
  constructor(message: string = "FORBIDDEN") {
    super(message, {
      extensions: {
        code: "FORBIDDEN"
      }
    });
  }
}

export class AuthenticationError extends GraphQLError {
  constructor(message: string = "UNAUTHORIZED") {
    super(message, {
      extensions: {
        code: "UNAUTHORIZED"
      }
    });
  }
}

export class ConflictError extends GraphQLError {
  constructor(message: string = "CONFLICT") {
    super(message, {
      extensions: {
        code: "CONFLICT"
      }
    });
  }
}
export class NotFoundError extends GraphQLError {
  constructor(message: string = "NOT FOUND") {
    super(message, {
      extensions: {
        code: "NOT FOUND"
      }
    });
  }
}

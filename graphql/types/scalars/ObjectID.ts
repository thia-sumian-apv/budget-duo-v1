import { GraphQLScalarType, Kind, GraphQLError } from "graphql";
import { ObjectId } from "mongodb";

const objectIdRegexp = /^[a-fA-F0-9]{24}$/;

const ObjectID = new GraphQLScalarType<ObjectId, string>({
  name: "ObjectID",
  description: "MongoDB ObjectID scalar",
  serialize(value) {
    if (value instanceof ObjectId) return value.toString();
    if (typeof value === "string" && objectIdRegexp.test(value)) return value;
    throw new TypeError(`Value is not a valid ObjectID: ${value as any}`);
  },
  parseValue(value) {
    if (typeof value !== "string" || !objectIdRegexp.test(value)) {
      throw new TypeError(`Value is not a valid ObjectID: ${value as any}`);
    }
    return new ObjectId(value);
  },
  parseLiteral(ast) {
    if (ast.kind !== Kind.STRING) {
      throw new GraphQLError(
        `Can only validate strings as ObjectID but got: ${ast.kind}`
      );
    }
    if (!objectIdRegexp.test(ast.value)) {
      throw new TypeError(`Value is not a valid ObjectID: ${ast.value}`);
    }
    return new ObjectId(ast.value);
  },
});

export default ObjectID;

import { loadFilesSync } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "@graphql-tools/merge";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sources = loadFilesSync(path.join(__dirname, "./**/*.graphql"));
// Ensure scalar definitions are discovered
const typeDefs = mergeTypeDefs(sources);

export default typeDefs;

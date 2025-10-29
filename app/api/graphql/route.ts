// Route handlers use the standard Web Request type
import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import schema from "@/graphql/schema";

const server = new ApolloServer({
  schema,
  introspection: process.env.NODE_ENV !== "production",
  plugins:
    process.env.NODE_ENV !== "production"
      ? [ApolloServerPluginLandingPageLocalDefault()]
      : [],
});

const handler = startServerAndCreateNextHandler<Request>(
  server as unknown as ApolloServer<object>,
  {
    context: async () => {
      const session = await getServerSession(authOptions);
      return { session } as unknown as object;
    },
  }
);

export async function GET(request: Request, _context: any) {
  // Route handlers must accept the RouteContext as the 2nd arg in Next.js 15
  void _context;
  return handler(request as any);
}

export async function POST(request: Request, _context: any) {
  void _context;
  return handler(request as any);
}

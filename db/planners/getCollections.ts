import type { Collection } from "mongodb";
import clientPromise from "@/lib/mongodb";
import type { PlannerDocument } from "@/types/planners/planner";

export interface PlannerCollections {
  planners: Collection<PlannerDocument>;
}

const getPlannerCollections = async (): Promise<PlannerCollections> => {
  const client = await clientPromise;
  const db = client.db();
  return {
    planners: db.collection<PlannerDocument>("planners"),
  };
};

export default getPlannerCollections;

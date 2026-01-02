import type { Collection } from "mongodb";
import clientPromise from "@/lib/mongodb";
import type { GoalDocument } from "@/types/planners/goal";

export interface GoalCollections {
  goals: Collection<GoalDocument>;
}

const getGoalCollections = async (): Promise<GoalCollections> => {
  const client = await clientPromise;
  const db = client.db();
  return {
    goals: db.collection<GoalDocument>("goals"),
  };
};

export default getGoalCollections;

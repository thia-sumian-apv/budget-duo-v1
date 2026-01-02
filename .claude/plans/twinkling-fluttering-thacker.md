# Fix GraphQL Schema Loading for Vercel Production

## Problem
GraphQL API returns 405 in production with error:
```
Error: "User" defined in resolvers, but not in schema
```

## Root Cause
`loadFilesSync` from `@graphql-tools/load-files` uses filesystem glob operations that fail in Vercel's serverless environment. Even with `outputFileTracingIncludes` configured, the `__dirname` resolution via `import.meta.url` doesn't correctly resolve paths in the bundled serverless function.

## Solution
Replace dynamic file loading with explicit imports using raw GraphQL string imports via Next.js webpack configuration.

## Files to Modify

### 1. `next.config.ts`
Add webpack configuration to handle `.graphql` file imports as raw strings:
```typescript
webpack: (config) => {
  config.module.rules.push({
    test: /\.graphql$/,
    type: 'asset/source',
  });
  return config;
}
```

### 2. `graphql/schema/typeDefs.ts`
Replace `loadFilesSync` with explicit imports of all `.graphql` files:

```typescript
import { mergeTypeDefs } from "@graphql-tools/merge";

// Core schema
import scalar from "./scalar.graphql";
import query from "./query.graphql";
import mutation from "./mutation.graphql";
import subscription from "./subscription.graphql";

// Error types
import ErrorResponse from "./error/ErrorResponse.graphql";
import ErrorOnField from "./error/ErrorOnField.graphql";

// User types
import User from "./user/types/User.graphql";
import CreateUserPayload from "./user/types/CreateUserPayload.graphql";
import UpdateUserPayload from "./user/types/UpdateUserPayload.graphql";
import UpdateProfilePayload from "./user/types/UpdateProfilePayload.graphql";
import CreateUserInput from "./user/inputs/CreateUserInput.graphql";
import UpdateUserInput from "./user/inputs/UpdateUserInput.graphql";
import UpdateProfileInput from "./user/inputs/UpdateProfileInput.graphql";
import Role from "./user/enums/Role.graphql";

// Planner types
import Planner from "./planner/types/Planner.graphql";
import PlannerMember from "./planner/types/PlannerMember.graphql";
import Goal from "./planner/types/Goal.graphql";
import CPFBreakdown from "./planner/types/CPFBreakdown.graphql";
import CreatePlannerPayload from "./planner/types/CreatePlannerPayload.graphql";
import JoinPlannerPayload from "./planner/types/JoinPlannerPayload.graphql";
import LeavePlannerPayload from "./planner/types/LeavePlannerPayload.graphql";
import GoalPayloads from "./planner/types/GoalPayloads.graphql";
import UpdateMemberDataPayload from "./planner/types/UpdateMemberDataPayload.graphql";

// Planner inputs
import CreatePlannerInput from "./planner/inputs/CreatePlannerInput.graphql";
import JoinPlannerInput from "./planner/inputs/JoinPlannerInput.graphql";
import CreateGoalInput from "./planner/inputs/CreateGoalInput.graphql";
import UpdateGoalInput from "./planner/inputs/UpdateGoalInput.graphql";
import UpdateMemberDataInput from "./planner/inputs/UpdateMemberDataInput.graphql";
import RatioSettingsInput from "./planner/inputs/RatioSettingsInput.graphql";

// Planner enums
import GoalCategory from "./planner/enums/GoalCategory.graphql";
import GoalFlowType from "./planner/enums/GoalFlowType.graphql";
import GoalOwnerType from "./planner/enums/GoalOwnerType.graphql";
import PlannerMemberRole from "./planner/enums/PlannerMemberRole.graphql";
import RatioMode from "./planner/enums/RatioMode.graphql";

const typeDefs = mergeTypeDefs([
  scalar,
  query,
  mutation,
  subscription,
  ErrorResponse,
  ErrorOnField,
  User,
  CreateUserPayload,
  UpdateUserPayload,
  UpdateProfilePayload,
  CreateUserInput,
  UpdateUserInput,
  UpdateProfileInput,
  Role,
  Planner,
  PlannerMember,
  Goal,
  CPFBreakdown,
  CreatePlannerPayload,
  JoinPlannerPayload,
  LeavePlannerPayload,
  GoalPayloads,
  UpdateMemberDataPayload,
  CreatePlannerInput,
  JoinPlannerInput,
  CreateGoalInput,
  UpdateGoalInput,
  UpdateMemberDataInput,
  RatioSettingsInput,
  GoalCategory,
  GoalFlowType,
  GoalOwnerType,
  PlannerMemberRole,
  RatioMode,
]);

export default typeDefs;
```

### 3. `graphql/schema/graphql.d.ts` (new file)
Add TypeScript declaration for `.graphql` imports:
```typescript
declare module "*.graphql" {
  const content: string;
  export default content;
}
```

### 4. `next.config.ts` cleanup
Remove `outputFileTracingIncludes` as it's no longer needed after switching to explicit imports.

## Implementation Steps
1. Create `graphql/schema/graphql.d.ts` with TypeScript declarations
2. Update `next.config.ts` to add webpack rule for `.graphql` files
3. Rewrite `graphql/schema/typeDefs.ts` with explicit imports
4. Remove `outputFileTracingIncludes` from `next.config.ts`
5. Test locally with `npm run build && npm run start`
6. Deploy to Vercel and verify the GraphQL endpoint works

import { agentsRouter } from "@/components/agents/server/procedure";
import { createTRPCRouter } from "../init";
import { meetingsRouter } from "@/components/meetings/server/procedure";

export const appRouter = createTRPCRouter({
  agents: agentsRouter,
  meeting: meetingsRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;

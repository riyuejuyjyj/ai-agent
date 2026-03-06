import { db } from "@/db";
import { agents } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { agentInsetSchema } from "../schema";
import z from "zod";
import { eq } from "drizzle-orm";

export const agentsRouter = createTRPCRouter({
  //TODO:use protected
  getMany: protectedProcedure.query(async () => {
    const data = await db.select().from(agents);

    return data;
  }),

  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const [data] = await db
        .select()
        .from(agents)
        .where(eq(agents.id, input.id));

      return data;
    }),
  create: protectedProcedure
    .input(agentInsetSchema)
    .mutation(async ({ input, ctx }) => {
      const [createAgent] = await db
        .insert(agents)
        .values({
          ...input,
          userId: ctx.auth.user.id,
        })
        .returning();
      return createAgent;
    }),
});

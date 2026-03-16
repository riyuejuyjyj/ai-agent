import z from "zod";

export const meetingInsetSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  agentId: z.string().min(1, { message: "instructions is required" }),
});

export const meetingsUpdateSchema = meetingInsetSchema.extend({
  id: z.string().min(1, { message: "ID is required" }),
});

import { createTRPCRouter, publicProcedure } from "../trpc";

export const urlRouter = createTRPCRouter({
  getLinksCount: publicProcedure.query(async ({ ctx }) => {
    const urlCount = (await ctx.db.query.urls.findMany()).length;
    return urlCount;
  }),
});

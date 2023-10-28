import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { urlSchema } from "~/server/db/schema";
import { createLinkFormSchema } from "~/pages/links/create";
import { nanoid } from "nanoid";

export const urlRouter = createTRPCRouter({
  getLinksCount: publicProcedure.query(async ({ ctx }) => {
    const urlCount = (await ctx.db.query.urlSchema.findMany()).length;

    return urlCount;
  }),

  getUserLinksCreateCount: protectedProcedure.query(async ({ ctx }) => {
    const urlCount = (
      await ctx.db.query.urlSchema.findMany({
        where: (urls, { eq }) => eq(urls.userAuthId, ctx.auth.userId),
      })
    ).length;

    return urlCount;
  }),

  getUserLinksClickCount: protectedProcedure.query(async ({ ctx }) => {
    const urls = await ctx.db.query.urlSchema.findMany({
      where: (urls, { eq }) => eq(urls.userAuthId, ctx.auth.userId),
    });

    const totalClicks = urls.reduce((acc, curr) => {
      return acc + curr.totalVisitCount;
    }, 0);

    return totalClicks - urls.length;
  }),

  getUserLinks: protectedProcedure.query(async ({ ctx }) => {
    const urls = await ctx.db.query.urlSchema.findMany({
      where: (urls, { eq }) => eq(urls.userAuthId, ctx.auth.userId),
    });

    return urls;
  }),

  createLink: protectedProcedure
    .input(createLinkFormSchema)
    .mutation(async ({ ctx, input }) => {
      const finalSlug = input.slug ?? nanoid(6);
      await ctx.db.insert(urlSchema).values({
        url: input.link,
        description: input.description,
        shortUrl: finalSlug,
        userAuthId: ctx.auth.userId,
        disabled: !input.enabled,
      });

      return `${ctx.req.headers.origin}/snip/${finalSlug}`;
    }),

  // updateLinkClicks: publicProcedure.mutation(async ({ ctx }) => {})
});

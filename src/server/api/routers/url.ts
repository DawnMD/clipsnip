import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { urlSchema } from "~/server/db/schema";
import { createLinkFormSchema } from "~/pages/links/create";
import { nanoid } from "nanoid";
import * as z from "zod";
import { eq } from "drizzle-orm";

export const urlRouter = createTRPCRouter({
  // Total number of links created despite the user
  getLinksCount: publicProcedure.query(async ({ ctx }) => {
    const urlCount = (await ctx.db.query.urlSchema.findMany()).length;

    return urlCount;
  }),

  // Total number of links created by the user
  getUserLinksCreateCount: protectedProcedure.query(async ({ ctx }) => {
    const urlCount = (
      await ctx.db.query.urlSchema.findMany({
        where: (urls, { eq }) => eq(urls.userAuthId, ctx.auth.userId),
      })
    ).length;

    return urlCount;
  }),

  // Total number of clicks on the links created by the user
  getUserLinksClickCount: protectedProcedure.query(async ({ ctx }) => {
    const urls = await ctx.db.query.urlSchema.findMany({
      where: (urls, { eq }) => eq(urls.userAuthId, ctx.auth.userId),
    });

    const totalClicks = urls.reduce((acc, curr) => {
      return acc + curr.totalVisitCount;
    }, 0);

    return totalClicks - urls.length;
  }),

  // Get all links created by the user
  getUserLinks: protectedProcedure.query(async ({ ctx }) => {
    const urls = await ctx.db.query.urlSchema.findMany({
      where: (urls, { eq }) => eq(urls.userAuthId, ctx.auth.userId),
    });

    return urls;
  }),

  // Create a new link
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

  // Update the status of a link
  updateLinkStatus: protectedProcedure
    .input(z.object({ slug: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const url = await ctx.db.query.urlSchema.findFirst({
        where: (urls, { eq }) => eq(urls.shortUrl, input.slug),
      });

      if (url) {
        await ctx.db
          .update(urlSchema)
          .set({
            disabled: !url.disabled,
          })
          .where(eq(urlSchema.shortUrl, input.slug));
      }
    }),
});

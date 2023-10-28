import { eq } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/server/db";
import { urlSchema } from "~/server/db/schema";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug } = req.query;

  if (!slug || typeof slug !== "string") {
    return res.status(400).json({
      error:
        "[X] Error: Missing slug? Remember that urls start like this: /u/yourLink",
    });
  }

  const data = await db.query.urlSchema.findFirst({
    where: (urls, { eq }) => eq(urls.shortUrl, slug),
  });

  if (!data) {
    return res.status(404).json({
      error:
        "[X] Error: Link not found or removed. Go to slug.vercel.app and create a new link.",
    });
  }

  // Cache:
  res.setHeader("Cache-Control", "s-maxage=1000000, stale-while-revalidate");

  // Update link visit count if not disabled:
  if (!data.disabled) {
    await db
      .update(urlSchema)
      .set({
        totalVisitCount: data.totalVisitCount + 1,
      })
      .where(eq(urlSchema.shortUrl, slug));
  }

  return res.json(data);
};

export default handler;

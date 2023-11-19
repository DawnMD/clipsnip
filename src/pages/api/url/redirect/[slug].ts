import { eq, sql } from "drizzle-orm";
import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "~/server/db";
import { urlSchema } from "~/server/db/schema";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { slug,country } = req.query;

  if (!slug || typeof slug !== "string") {
    return res.status(400).json({
      error:
        "[X] Error: Missing slug? Remember that urls start like this: /snip/yourLink",
    });
  }

  const data = await db.query.urlSchema.findFirst({
    where: (urls, { eq }) => eq(urls.shortUrl, slug),
  });

  if (!data) {
    return res.status(404).json({
      error:
        "[X] Error: Link not found or removed. Go to clipsnip.vercel.app and create a new link.",
    });
  }

  // Cache:
  res.setHeader("Cache-Control", "s-maxage=1000000, stale-while-revalidate");

  // Update link visit count if not disabled:
  if (!data.disabled) {
    // Update total visit count
    await db
      .update(urlSchema)
      .set({
        totalVisitCount: data.totalVisitCount + 1,
      })
      .where(eq(urlSchema.shortUrl, slug));

    // Update unique geodata visit count
    await db.execute(
      sql.raw(`
    UPDATE
      clipsnip_url
    SET
      visit_count_by_country = JSON_SET(visit_count_by_country, '$."${country}"', COALESCE(JSON_EXTRACT(visit_count_by_country, '$."${country}"'), 0) + 1)
    WHERE
      short_url = "${slug}";
`));

    // Update visit count by date
    await db.execute(
      sql.raw(`
    UPDATE
      clipsnip_url
    SET
      visit_count_by_date = JSON_SET(visit_count_by_date, '$."${new Date().setHours(0,0,0,0)}"', COALESCE(JSON_EXTRACT(visit_count_by_date, '$."${new Date().setHours(0,0,0,0)}"'), 0) + 1)
    WHERE
      short_url = "${slug}";
`));
  }

  return res.json(data);
};

export default handler;

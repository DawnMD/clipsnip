import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/references/nextjs/auth-middleware for more information about configuring your Middleware
export default authMiddleware({
  publicRoutes: ["/", "/snip/:slug*"],
  async beforeAuth(req, _) {
    if (req.nextUrl.pathname.startsWith("/snip/")) {
      const slug = req.nextUrl.pathname.split("/").pop();

      if (!slug) {
        return NextResponse.redirect(req.nextUrl.origin);
      }

      const data = await fetch(`${req.nextUrl.origin}/api/url/${slug}`);

      if (data.status === 404) {
        return NextResponse.redirect(`${req.nextUrl.origin}/404`);
      }

      const dataToJson = (await data.json()) as { url: string };

      if (data?.url) {
        return NextResponse.redirect(new URL(dataToJson.url));
      }
    }
  },
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)",
    "/",
    "/(api|trpc)(.*)",
    "/snip/:slug*",
  ],
};

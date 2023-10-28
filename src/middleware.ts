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

      // Get the slug:
      if (!slug) {
        return NextResponse.redirect(req.nextUrl.origin);
      }

      // Get the data:
      const data = await fetch(
        `${req.nextUrl.origin}/api/url/redirect/${slug}`,
      );

      // If the data is not found:
      if (data.status === 404) {
        return NextResponse.redirect(`${req.nextUrl.origin}/404`);
      }

      // Convert the data to JSON:
      const dataToJson = (await data.json()) as {
        url: string;
        disabled: boolean;
      };

      // If the data is disabled:
      if (dataToJson.disabled) {
        return NextResponse.redirect(`${req.nextUrl.origin}/404`);
      }

      // If the data is enabled, rediret:
      if (data.url) {
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

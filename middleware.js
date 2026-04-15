import { NextResponse } from "next/server";

/**
 * /scan/* замд зөвхөн утас зөвшөөрөх
 */
export function middleware(req) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/scan")) {
    const ua = req.headers.get("user-agent") || "";
    const isMobile = /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);

    if (!isMobile) {
      // Desktop-ийн хувьд анхааруулга харуулах хуудас руу чиглүүлэх
      return NextResponse.redirect(new URL("/mobile-only", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/scan/:path*"],
};

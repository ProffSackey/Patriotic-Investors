import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    const adminSession = request.cookies.get("admin_session");

    if (!adminSession) {
      // Redirect to login if no session
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const sessionData = JSON.parse(adminSession.value);

      // Check if user has correct role for specific paths
      if (pathname.startsWith("/admin/account-manager")) {
        if (sessionData.role !== "account-manager") {
          return NextResponse.redirect(new URL("/login", request.url));
        }
      } else if (pathname.startsWith("/admin/customer-service")) {
        if (sessionData.role !== "customer-service") {
          return NextResponse.redirect(new URL("/login", request.url));
        }
      } else if (pathname.startsWith("/admin/executives")) {
        if (sessionData.role !== "executive") {
          return NextResponse.redirect(new URL("/login", request.url));
        }
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

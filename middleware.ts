import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const protectedRoute =
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/interview" ||
    pathname.startsWith("/interview/");

  if (!protectedRoute) return NextResponse.next();

  const rawCookie =
    request.cookies.get("authjs.session-token")?.value ||
    request.cookies.get("__Secure-authjs.session-token")?.value ||
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value;

  if (!rawCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });

    if (!token) {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("authjs.session-token");
      response.cookies.delete("__Secure-authjs.session-token");
      response.cookies.delete("next-auth.session-token");
      response.cookies.delete("__Secure-next-auth.session-token");
      return response;
    }
  } catch {
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("authjs.session-token");
    response.cookies.delete("__Secure-authjs.session-token");
    response.cookies.delete("next-auth.session-token");
    response.cookies.delete("__Secure-next-auth.session-token");
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/interview/:path*"],
};

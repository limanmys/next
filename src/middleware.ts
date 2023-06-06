import { NextResponse, type NextRequest } from "next/server"

const authRoutes = ["/auth/login"]

export function middleware(request: NextRequest) {
  if (
    request.nextUrl.pathname.includes("_next") ||
    request.nextUrl.pathname.includes("favicon")
  ) {
    return NextResponse.next()
  }

  const currentUser = request.cookies.get("currentUser")?.value

  if (!currentUser && !authRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/auth/login", request.url))
  }

  if (currentUser && Date.now() > JSON.parse(currentUser).expired_at) {
    request.cookies.delete("currentUser")
    const response = NextResponse.redirect(new URL("/auth/login", request.url))
    response.cookies.delete("currentUser")
    return response
  }

  if (currentUser && authRoutes.includes(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

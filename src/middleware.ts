import { NextRequest, NextResponse } from "next/server";
export default function middleware(req: NextRequest) {
  if (req.cookies.has("token")) {
    console.log('Tiene el token')
  } else {
    return NextResponse.redirect("http://localhost:3000/login");
  }
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico|login|logo.png).*)",
};

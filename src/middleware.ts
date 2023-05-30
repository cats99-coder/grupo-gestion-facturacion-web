import { NextRequest, NextResponse } from "next/server";

export default async function middleware(req: NextRequest) {
  let isAuth = true;
  console.log("REQ: ", req.cookies.has("token"));
  if (req.cookies.has("token")) {
    try {
      const url = process.env.NEXT_PUBLIC_URL;
      await fetch(url + "/auth/verify", {
        method: "POST",
        headers: {
          authorization: `Bearer ${req.cookies.get("token")?.value}`,
          "content-type": "application/json",
        },
      })
        .then((response) => {
          console.log(response.ok);
          if (!response.ok) throw new Error("Error login");
        })
        .catch((err) => {
          console.log(err);
          isAuth = false;
          console.log("Auth", isAuth);
        });
    } catch (err) {}
  } else {
    return NextResponse.redirect(
      new URL(process.env.NEXT_PUBLIC_URL_LOGIN || "")
    );
  }
  if (!isAuth) {
    console.log("redirigir");
    return NextResponse.redirect(
      new URL(process.env.NEXT_PUBLIC_URL_LOGIN || "")
    );
  }
}

export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico|login|logo.png).*)",
};

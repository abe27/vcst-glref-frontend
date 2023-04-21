import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

const middleware = async (req) => {
  const session = await getToken({ req, secret: process.env.JWT_SECRET });
  if (!session) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/", "/feature", "/feature/:path*"],
};

export default middleware;

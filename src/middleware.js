import { jwtDecode } from "jwt-decode";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const authToken = request.cookies.get("authToken");
  //console.log("im middleware")
  if (!authToken) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const decoded = await jwtDecode(authToken.value);
  const rolename = decoded.rolename;
  //console.log("role: "+rolename);

  if (request.nextUrl.pathname.startsWith("/myDashboard")) {
    if (rolename != "Employee") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (rolename != "Admin") {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }
  if (request.nextUrl.pathname.startsWith("/timestablu-dashboard")) {
   if (rolename != "Times Tablu Admin") {
     return NextResponse.redirect(new URL("/login", request.url));
   }
 }
}

export const config = {
  matcher: ["/dashboard/:path*", "/myDashboard/:path*", "/timestablu-dashboard/:path*"],
};

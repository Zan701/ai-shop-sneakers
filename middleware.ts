import NextAuth from "next-auth";
import { authConfig } from "./src/auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Hanya jalankan middleware pada rute selain statis dan internal Next.js
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
};

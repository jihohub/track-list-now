import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      email: string;
      name?: string | null;
      image?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    id: number;
    email: string;
    name?: string | null;
    image?: string | null;
    googleId?: string;
    profileImage?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: number;
    email?: string;
  }
}

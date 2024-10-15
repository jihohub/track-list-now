import prisma from "@/libs/prisma/prismaClient";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) {
        return false;
      }

      try {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          await prisma.user.create({
            data: {
              googleId: account?.providerAccountId || "",
              email: user.email,
              name: user.name || "",
              profileImage: user.image || "",
            },
          });
        }
        return true;
      } catch (error: unknown) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다.";
        JSON.stringify(errorMessage);
        return false;
      }
    },

    async session({ session }) {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email as string },
      });

      if (dbUser) {
        return {
          ...session,
          user: {
            ...session.user,
            id: dbUser.id,
          },
        };
      }

      return session;
    },
  },
};

export default NextAuth(authOptions);

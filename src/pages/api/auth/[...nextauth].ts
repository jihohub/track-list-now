import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const prisma = new PrismaClient();

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      const existingUser = await prisma.user.findUnique({
        where: { googleId: account.providerAccountId },
      });

      if (!existingUser) {
        await prisma.user.create({
          data: {
            googleId: account.providerAccountId,
            email: user.email,
            name: user.name,
            profileImage: user.image,
          },
        });
      }
      return true;
    },

    async session({ session, token, user }) {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (dbUser) {
        session.user.id = dbUser.id;
      }
      return session;
    },
  },
});

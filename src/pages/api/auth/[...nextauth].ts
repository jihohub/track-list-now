import prisma from "@/libs/prisma/prismaClient";
import { DatabaseError } from "@/types/error";
import { User } from "@prisma/client";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// 사용자 생성/업데이트를 위한 인터페이스
interface UserData {
  googleId: string;
  email: string;
  name: string;
  profileImage: string;
}

// 사용자 데이터베이스 작업 함수
const userOperations = {
  // 사용자 찾기
  findUser: async (email: string): Promise<User | null> => {
    try {
      return await prisma.user.findUnique({
        where: { email },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new DatabaseError(`Failed to find user: ${error.message}`);
      }
      throw error;
    }
  },

  // 새 사용자 생성
  createUser: async (userData: UserData): Promise<User> => {
    try {
      return await prisma.user.create({
        data: userData,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        // 중복 이메일 처리
        if (error.code === "P2002") {
          throw new DatabaseError("User with this email already exists");
        }
        throw new DatabaseError(`Failed to create user: ${error.message}`);
      }
      throw error;
    }
  },
};

// 환경 변수 검증
const validateEnvVariables = () => {
  const required = [
    "NEXTAUTH_SECRET",
    "GOOGLE_CLIENT_ID",
    "GOOGLE_CLIENT_SECRET",
  ];

  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`,
    );
  }
};

// NextAuth 설정
export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      try {
        if (!user.email) {
          return false;
        }

        const existingUser = await userOperations.findUser(user.email);

        if (!existingUser) {
          await userOperations.createUser({
            googleId: account?.providerAccountId || "",
            email: user.email,
            name: user.name || "",
            profileImage: user.image || "",
          });
        }

        return true;
        /* eslint-disable @typescript-eslint/no-unused-vars */
      } catch (error) {
        return false;
      }
    },

    async jwt({ token, user, trigger, session }) {
      try {
        // 초기 로그인 시 토큰에 사용자 ID 추가
        if (user?.email && !token.userId) {
          const dbUser = await userOperations.findUser(user.email);
          if (dbUser) {
            return {
              ...token,
              userId: dbUser.id,
              email: dbUser.email,
            };
          }
        }

        // 세션 업데이트 트리거 시 토큰 업데이트
        if (trigger === "update" && session) {
          return { ...token, ...session };
        }

        // 기존 토큰 반환
        return token;
        /* eslint-disable @typescript-eslint/no-unused-vars */
      } catch (error) {
        // 에러 발생 시에도 기존 토큰은 유지
        return token;
      }
    },

    async session({ session, token }) {
      try {
        if (!session.user?.email) {
          throw new Error("No user email in session");
        }

        const dbUser = await userOperations.findUser(session.user.email);

        if (!dbUser) {
          throw new Error("User not found in database");
        }

        return {
          ...session,
          user: {
            ...session.user,
            id: token.userId!,
          },
        };
        /* eslint-disable @typescript-eslint/no-unused-vars */
      } catch (error) {
        return session;
      }
    },
  },

  // 세션 설정
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30일
  },

  // 디버그 모드 (개발 환경에서만)
  debug: process.env.NODE_ENV === "development",
};

// 환경 변수 검증 실행
validateEnvVariables();

export default NextAuth(authOptions);

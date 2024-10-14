import prisma from "@/libs/prisma/prismaClient";
import { User as PrismaUser } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

interface UserResponse {
  id: number;
  googleId: string;
  email: string;
  name?: string | null;
  profileImage?: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ErrorResponse {
  error: string;
}

type ResponseData = UserResponse | ErrorResponse;

const serializeUser = (user: PrismaUser): UserResponse => ({
  ...user,
  createdAt: user.createdAt.toISOString(),
  updatedAt: user.updatedAt.toISOString(),
});

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>,
) => {
  const { method } = req;

  if (method !== "GET") {
    res.setHeader("Allow", ["GET"]);
    return res.status(405).end(`Method ${method} Not Allowed`);
  }

  const { userId } = req.query;

  if (!userId || Array.isArray(userId)) {
    return res.status(400).json({ error: "Invalid or missing userId" });
  }

  const parsedUserId = parseInt(userId, 10);

  if (Number.isNaN(parsedUserId)) {
    return res.status(400).json({ error: "userId must be a number" });
  }

  try {
    const user = await prisma.user.findFirst({
      where: { id: parsedUserId },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // if (!user.isPublic) {
    //   return res.status(403).json({ error: "This profile is private" });
    // }

    const serializedUser = serializeUser(user);
    return res.status(200).json(serializedUser);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "알 수 없는 오류가 발생했습니다.";
    return res.status(500).json({ error: errorMessage });
  }
};

export default handler;

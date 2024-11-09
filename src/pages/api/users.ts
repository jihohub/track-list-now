import prisma from "@/libs/prisma/prismaClient";
import withErrorHandling from "@/libs/utils/errorHandler";
import { APIError, DatabaseError, ValidationError } from "@/types/error";
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

type ResponseData = UserResponse;

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
    throw new APIError(`Method ${method} Not Allowed`, {
      statusCode: 405,
      errorCode: "METHOD_NOT_ALLOWED",
    });
  }

  const { userId } = req.query;

  if (!userId || Array.isArray(userId)) {
    throw new ValidationError("Invalid or missing userId");
  }

  const parsedUserId = parseInt(userId, 10);

  if (Number.isNaN(parsedUserId)) {
    throw new ValidationError("userId must be a number");
  }

  try {
    const user = await prisma.user.findFirst({
      where: { id: parsedUserId },
    });

    if (!user) {
      throw new APIError("User not found", {
        statusCode: 404,
        errorCode: "USER_NOT_FOUND",
      });
    }

    const serializedUser = serializeUser(user);
    return res.status(200).json(serializedUser);
  } catch (error: unknown) {
    if (error instanceof APIError || error instanceof ValidationError) {
      throw error;
    }
    throw new DatabaseError("Failed to fetch user data");
  }
};

export default withErrorHandling(handler);

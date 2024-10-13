// /pages/api/users.ts

import prisma from "@/libs/prisma/prismaClient";
import { NextApiRequest, NextApiResponse } from "next";

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = req.query;

  if (!userId || Array.isArray(userId)) {
    return res.status(400).json({ error: "Invalid or missing userId" });
  }

  const parsedUserId = parseInt(userId, 10);

  if (Number.isNaN(parsedUserId)) {
    return res.status(400).json({ error: "userId must be a number" });
  }

  const user = await prisma.user.findFirst({
    where: { id: parsedUserId },
  });

  if (!user.isPublic) {
    return res.status(403).json({ error: "This profile is private" });
  }

  res.status(200).json(user);
};

export default handler;

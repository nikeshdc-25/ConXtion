import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const profile = await currentProfilePages(req);
    const { content, fileUrl } = req.body;
    const { convoId } = req.query;

    if (!profile) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!convoId) {
      return res.status(400).json({ message: "Conversation ID is required" });
    }
    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const convo = await db.convo.findFirst({
      where: {
        id: convoId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!convo) {
      return res.status(404).json({ message: "Conversation not found!" });
    }

    const member =
      convo.memberOne.profileId === profile.id
        ? convo.memberOne
        : convo.memberTwo;

    if (!member) {
      return res.status(404).json({ message: "Member NOT FOUND" });
    }

    const message = await db.directMessage.create({
      data: {
        content,
        fileUrl,
        convoId: convoId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${convoId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("Direct_Message_POST Error", error);
    return res.status(500).json({ message: "Internal Error" });
  }
}

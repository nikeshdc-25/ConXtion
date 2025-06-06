import { currentProfilePages } from "@/lib/current-profile-pages";
import { db } from "@/lib/db";
import { NextApiResponseServerIo } from "@/types";
import { MemberRole } from "@prisma/client";
import { NextApiRequest } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponseServerIo
) {
  if (req.method !== "DELETE" && req.method !== "PATCH") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const profile = await currentProfilePages(req);
    const { directMessageId, convoId } = req.query;
    const { content } = req.body;
    if (!profile) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    if (!convoId) {
      return res.status(400).json({ error: "Conversation ID required" });
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
      return res.status(404).json({ error: "Conversation not found!" });
    }

    const member =
      convo.memberOne.profileId === profile.id
        ? convo.memberOne
        : convo.memberTwo;

    if (!member) {
      return res.status(404).json({ error: "Member not found!" });
    }

    let directMessage = await db.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        convoId: convoId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!directMessage || directMessage.deleted) {
      return res.status(404).json({ error: "Direct Message not found!" });
    }

    const isMessageOwner = directMessage.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) {
      return res.status(401).json({ error: "Unauthorized to do this action!" });
    }
    if (req.method === "DELETE") {
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          fileUrl: null,
          content: "(This message has been deleted.)",
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }
    if (req.method === "PATCH") {
      if (!isMessageOwner) {
        return res
          .status(401)
          .json({ error: "Unauthorized to do this action!" });
      }
      directMessage = await db.directMessage.update({
        where: {
          id: directMessageId as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }
    const updateKey = `chat:${convo.id}:messages:update`;
    res?.socket?.server?.io?.emit(updateKey, directMessage);
    return res.status(200).json(directMessage);
  } catch (error) {
    console.log("MESSAGE ID Error", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

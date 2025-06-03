import { db } from "./db";

export const getOrCreateConvo = async (
  memberOneId: string,
  memberTwoId: string
) => {
  let convo =
    (await findConvo(memberOneId, memberTwoId)) ||
    (await findConvo(memberTwoId, memberOneId));

  if (!convo) {
    convo = await createNewConvo(memberOneId, memberTwoId);
  }
  return convo;
};

const findConvo = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await db.convo.findFirst({
      where: {
        AND: [{ memberOneId: memberOneId }, { memberTwoId: memberTwoId }],
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
  } catch {
    return null;
  }
};

const createNewConvo = async (memberOneId: string, memberTwoId: string) => {
  try {
    return await db.convo.create({
      data: {
        memberOneId,
        memberTwoId,
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
  } catch {
    return null;
  }
};

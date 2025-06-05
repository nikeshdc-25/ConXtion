import { ChatHeader } from "@/components/chat/chat-header";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { MediaRoom } from "@/components/media-room";
import { getOrCreateConvo } from "@/lib/convo";
import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { RedirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface MemberIdPageProps {
  params: Promise<{
    serverId: string;
    memberId: string;
  }>;

  searchParams: Promise<{
    video?: boolean;
  }>;
}

const MemberIdPage = async ({ params, searchParams }: MemberIdPageProps) => {
  const profile = await currentProfile();

  if (!profile) {
    return <RedirectToSignIn />;
  }

  const currentMember = await db.member.findFirst({
    where: {
      serverId: (await params).serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) {
    return redirect("/");
  }

  const convo = await getOrCreateConvo(
    currentMember.id,
    (
      await params
    ).memberId
  );

  if (!convo) {
    return redirect(`/servers/${(await params).serverId}`);
  }

  const { memberOne, memberTwo } = convo;

  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        serverId={(await params).serverId}
        type="convo"
      />
      {(await searchParams).video && (
        <MediaRoom chatId={convo.id} video={true} audio={true} />
      )}
      {!(await searchParams).video && (
        <>
          <ChatMessages
            member={currentMember}
            name={otherMember.profile.name}
            chatId={convo.id}
            type="convo"
            apiUrl="/api/direct-messages"
            paramKey="convoId"
            paramValue={convo.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              convoId: convo.id,
            }}
          />
          <ChatInput
            name={otherMember.profile.name}
            type="convo"
            apiUrl="/api/socket/direct-messages"
            query={{
              convoId: convo.id,
            }}
          />
        </>
      )}
    </div>
  );
};

export default MemberIdPage;

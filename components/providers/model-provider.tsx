"use client";

import { useEffect, useState } from "react";
import { CreateServerModel } from "@/components/models/create-server-model";
import { InviteModel } from "../models/invite-model";
import { EditServerModel } from "../models/edit-server-model";
import { MembersModel } from "../models/members-model";
import { CreateChannelModel } from "../models/create-channel-model";
import { LeaveServerModel } from "../models/leave-server-model";
import { DeleteServerModel } from "../models/delete-server-model";
import { DeleteChannelodel } from "../models/delete-channel-model";
import { EditChannelModel } from "../models/edit-channel-model";
import { MessageFileModel } from "../models/message-file-model";

export const ModelProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) {
    return null; // Prevents rendering on the server side
  }
  return (
    <>
      <CreateServerModel />
      <InviteModel />
      <EditServerModel />
      <MembersModel />
      <CreateChannelModel />
      <LeaveServerModel />
      <DeleteServerModel />
      <DeleteChannelodel />
      <EditChannelModel />
      <MessageFileModel />
    </>
  );
};

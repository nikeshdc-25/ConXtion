"use client";

import { useEffect, useState } from "react";
import { CreateServerModel } from "@/components/models/create-server-model";
import { InviteModel } from "../models/invite-model";

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
    </>
  );
};

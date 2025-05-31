"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { useModel } from "@/hooks/use-model-store";
import { Label } from "../ui/label";


export const InviteModel = () => {
  const { isOpen, onClose, type } = useModel();

  const isModelOpen = isOpen && type === "invite";



  return (
    <Dialog open={isModelOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden top-[20%] left-[35%]">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl font-bold text-center">
            Invite Friends
          </DialogTitle>
          
        </DialogHeader>
        <div className="p-6">
          <Label className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">Server Invite Link</Label>
        </div>
      </DialogContent>
    </Dialog>
  );
};

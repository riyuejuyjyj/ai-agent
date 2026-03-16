"use client";
import ResponsiveDialog from "@/components/ResponsiveDialog";
import MeetingForm from "./MeetingForm";
import { useRouter } from "next/navigation";

interface NewMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewMeetingDialog = ({ open, onOpenChange }: NewMeetingDialogProps) => {
  const router = useRouter();
  return (
    <ResponsiveDialog
      title="New Agent"
      description="Create a new Agent"
      open={open}
      onOpen={onOpenChange}
    >
      <MeetingForm
        onSuccess={(id) => {
          onOpenChange(false);
          router.push(`/meetings/${id}`);
        }}
        onCancel={() => onOpenChange}
      />
    </ResponsiveDialog>
  );
};

export default NewMeetingDialog;

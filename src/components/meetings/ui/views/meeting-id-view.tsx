"use client";
import { useTRPC } from "@/trpc/client";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { MeetingIdViewHeader } from "../meeting-id-view-header";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";
import UpdateMeetingDialog from "../update-meeting-dialog";
import { useState } from "react";

interface props {
  meetingId: string;
}
export const MeetingIdView = ({ meetingId }: props) => {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.meeting.getOne.queryOptions({ id: meetingId }),
  );
  const queryClient = useQueryClient();
  const [RemoveConfirmation, confirmRemove] = useConfirm(
    "Are you sure?",
    "The follow action will remove this meeting",
  );
  const router = useRouter();
  const [updateMeetingDialog, setUpdateMeetingDialog] = useState(false);
  const removeMeeting = useMutation(
    trpc.meeting.remove.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries(trpc.meeting.getMany.queryOptions({}));
        toast("remove successfully");
        router.push("/meetings");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    }),
  );
  const handleRemoveMeeting = async () => {
    const ok = await confirmRemove();
    if (!ok) return;
    await removeMeeting.mutateAsync({ id: meetingId });
  };
  return (
    <>
      <RemoveConfirmation />
      <UpdateMeetingDialog
        open={updateMeetingDialog}
        onOpenChange={setUpdateMeetingDialog}
        initialValues={data}
      />
      <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4">
        <MeetingIdViewHeader
          meetingId={meetingId}
          meetingName={data.name}
          onEdit={() => setUpdateMeetingDialog(true)}
          onRemove={handleRemoveMeeting}
        />
        {JSON.stringify(data)}
      </div>
    </>
  );
};

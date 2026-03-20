import ErrorState from "@/components/ErrorState";
import LoadingState from "@/components/LoadingState";
import { MeetingIdView } from "@/components/meetings/ui/views/meeting-id-view";
import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface Props {
  params: Promise<{
    meetingId: string;
  }>;
}
const page = async ({ params }: Props) => {
  const { meetingId } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return redirect("/sign-in");
  }
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(
    trpc.meeting.getOne.queryOptions({ id: meetingId }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <LoadingState
            title="Loading Meeting"
            description="This may take a few seconds"
          />
        }
      >
        <ErrorBoundary
          fallback={
            <ErrorState
              title="Error Loading Meeting"
              description="Something went wrong"
            />
          }
        >
          <MeetingIdView meetingId={meetingId} />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default page;

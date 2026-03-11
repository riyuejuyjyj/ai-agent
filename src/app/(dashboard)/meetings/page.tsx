import ErrorState from "@/components/ErrorState";
import LoadingState from "@/components/LoadingState";
import { MeetingsView } from "@/components/meetings/ui/views/meetings-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const page = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.meeting.getMany.queryOptions({}));
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense
        fallback={
          <LoadingState
            title="Loading Meetings"
            description="This may take a few seconds"
          />
        }
      >
        <ErrorBoundary
          fallback={
            <ErrorState
              title="Error Loading Meetings"
              description="Something went wrong"
            />
          }
        >
          <MeetingsView />
        </ErrorBoundary>
      </Suspense>
    </HydrationBoundary>
  );
};

export default page;

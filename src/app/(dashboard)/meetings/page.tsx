import ErrorState from "@/components/ErrorState";
import LoadingState from "@/components/LoadingState";
import MeetingsListHeader from "@/components/meetings/ui/meeting-list-header";
import { MeetingsView } from "@/components/meetings/ui/views/meetings-view";
import { auth } from "@/lib/auth";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

const page = async () => {
  const queryClient = getQueryClient();

  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/sign-in");
  }

  void queryClient.prefetchQuery(trpc.meeting.getMany.queryOptions({}));
  return (
    <>
      <MeetingsListHeader />
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
    </>
  );
};

export default page;

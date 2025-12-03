"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
const HomeView = () => {
  const { data: session } = authClient.useSession();
  const router = useRouter();
  if (!session)
    return (
      <div>
        <p>loading</p>
      </div>
    );
  return (
    <div className="flex flex-col p-4 gap-y-4">
      <p>Logged in as {session.user.name}</p>
      <Button
        onClick={() =>
          authClient.signOut({
            fetchOptions: {
              onSuccess: () => router.push("/sign-in"),
            },
          })
        }
      >
        SignOut
      </Button>
    </div>
  );
};

export default HomeView;

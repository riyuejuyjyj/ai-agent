"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";

const HomePage = () => {
  const { data: session } = authClient.useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const onSubmit = async () => {
    await authClient.signUp.email(
      {
        email,
        password,
        name,
      },
      {
        onError: () => {
          window.alert("Something went wrong");
        },
        onSuccess: () => {
          window.alert("Success");
        },
      }
    );
  };

  const onLogin = async () => {
    await authClient.signIn.email(
      {
        email,
        password,
      },
      {
        onError: () => {
          window.alert("Something went wrong");
        },
        onSuccess: () => {
          window.alert("Success");
        },
      }
    );
  };
  if (session) {
    return (
      <div className="flex flex-col p-4 gap-y-4">
        <p>Logged in as {session.user.name}</p>
        <Button onClick={async () => await authClient.signOut()}>
          SignOut
        </Button>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex flex-col w-[300px] gap-y-4 p-4">
        <Input
          placeholder="name"
          onChange={(e) => setName(e.target.value)}
          value={name}
        />
        <Input
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
        />
        <Input
          placeholder="password"
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={onSubmit}>create user</Button>
      </div>

      <div className="flex flex-col w-[300px] gap-y-4 p-4">
        <Input
          placeholder="email"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
        />
        <Input
          placeholder="password"
          value={password}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button onClick={onLogin}>Login</Button>
      </div>
    </div>
  );
};

export default HomePage;

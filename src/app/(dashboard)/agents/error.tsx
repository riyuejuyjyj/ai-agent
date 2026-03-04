"use client";
import ErrorState from "@/components/ErrorState";

const error = () => {
  return (
    <ErrorState
      title="Error Loading Agents"
      description="Something went wrong"
    />
  );
};

export default error;

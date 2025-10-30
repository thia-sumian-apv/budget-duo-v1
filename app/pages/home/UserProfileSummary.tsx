"use client";

import { useGetUserQuery } from "./Home.api";

export interface UserProfileSummaryProps {
  userId: string;
}

const UserProfileSummary = ({ userId }: UserProfileSummaryProps) => {
  const { data, loading, error } = useGetUserQuery({
    variables: { id: userId },
    skip: !userId,
  });

  if (loading) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm text-white/70">
        Loading profile…
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5 text-sm text-red-500">
        Failed to load profile
      </div>
    );
  }

  const user = data?.getUser;

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
      <h2 className="text-base font-semibold">Profile</h2>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
          <div className="text-xs text-white/70">Name</div>
          <div className="mt-1 text-sm">{user?.name ?? "—"}</div>
        </div>
        <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
          <div className="text-xs text-white/70">Email</div>
          <div className="mt-1 text-sm">{user?.email ?? "—"}</div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSummary;

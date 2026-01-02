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
      <div className="rounded-xl border border-navy/10 bg-white/50 p-5 text-sm text-navy/70">
        Loading profile…
      </div>
    );
  }
  if (error) {
    return (
      <div className="rounded-xl border border-navy/10 bg-white/50 p-5 text-sm text-red-600">
        Failed to load profile
      </div>
    );
  }

  const user = data?.getUser;

  return (
    <div className="rounded-xl border border-navy/10 bg-white/50 p-5">
      <h2 className="text-base font-heading font-semibold text-navy">Profile</h2>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-navy/10 bg-white/70 p-3">
          <div className="text-xs text-navy/70">Name</div>
          <div className="mt-1 text-sm text-navy">{user?.name ?? "—"}</div>
        </div>
        <div className="rounded-lg border border-navy/10 bg-white/70 p-3">
          <div className="text-xs text-navy/70">Email</div>
          <div className="mt-1 text-sm text-navy">{user?.email ?? "—"}</div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSummary;

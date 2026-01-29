"use client";

import { User, Mail, Shield, Bell } from "lucide-react";
import { useCurrentUser } from "@/app/hooks/useCurrentUser";
import { useGetUserQuery } from "@/app/pages/home/Home.api";
import { Button } from "@/components/ui/button";

export default function ProfilePage() {
  const { userId } = useCurrentUser();
  const { data, loading, error } = useGetUserQuery({
    variables: { id: userId ?? "" },
    skip: !userId,
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="dashboard-card p-8 animate-pulse h-48 bg-gray-100" />
        <div className="dashboard-card p-8 animate-pulse h-32 bg-gray-100" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-card p-8 text-center">
        <p className="text-red-600">Failed to load profile</p>
        <p className="text-sm text-gray-500 mt-2">Please try refreshing the page</p>
      </div>
    );
  }

  const user = data?.getUser;

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Profile Header */}
      <div className="dashboard-card p-8">
        <div className="flex items-center gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-highlight/10 flex items-center justify-center flex-shrink-0">
            <User className="h-10 w-10 text-highlight" />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl font-bold text-navy truncate">
              {user?.name ?? "User"}
            </h1>
            <p className="text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Account Details */}
      <div className="dashboard-card p-6">
        <h2 className="text-lg font-bold text-navy mb-4">Account Details</h2>

        <div className="space-y-4">
          {/* Name */}
          <div className="flex items-center gap-4 py-3 border-b border-gray-100">
            <User className="h-5 w-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Name</p>
              <p className="text-sm font-medium text-navy">{user?.name ?? "—"}</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-4 py-3 border-b border-gray-100">
            <Mail className="h-5 w-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Email</p>
              <p className="text-sm font-medium text-navy">{user?.email ?? "—"}</p>
            </div>
          </div>

          {/* Provider */}
          <div className="flex items-center gap-4 py-3">
            <Shield className="h-5 w-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wider">Sign-in Method</p>
              <p className="text-sm font-medium text-navy">Google Account</p>
            </div>
          </div>
        </div>
      </div>

      {/* Preferences (Placeholder) */}
      <div className="dashboard-card p-6">
        <h2 className="text-lg font-bold text-navy mb-4">Preferences</h2>

        <div className="space-y-4">
          {/* Notifications */}
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <Bell className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-navy">Email Notifications</p>
                <p className="text-xs text-gray-500">Receive updates about your planners</p>
              </div>
            </div>
            <Button variant="outline" size="sm" disabled className="rounded-lg">
              Coming Soon
            </Button>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="dashboard-card p-6 border-red-200">
        <h2 className="text-lg font-bold text-red-600 mb-4">Danger Zone</h2>
        <p className="text-sm text-gray-500 mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" disabled>
          Delete Account (Coming Soon)
        </Button>
      </div>
    </div>
  );
}

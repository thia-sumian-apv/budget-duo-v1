"use client";

import { Users, UserPlus } from "lucide-react";
import { AvatarCircle, type AvatarVariant } from "@/components/ui/avatar-circle";
import { getMemberName, getInitial } from "@/lib/utils/member";
import type { GetPlannerQuery } from "../../Planner.api";

type PlannerMember = NonNullable<
  GetPlannerQuery["getPlanner"]
>["members"][0];

const AVATAR_VARIANTS: AvatarVariant[] = ["highlight", "navy", "teal", "purple"];

const ROLE_STYLES: Record<string, string> = {
  OWNER: "bg-highlight/10 text-highlight",
  MEMBER: "bg-gray-200 text-navy/60",
};

interface MembersCardProps {
  members: PlannerMember[];
}

export const MembersCard = ({ members }: MembersCardProps) => {
  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-navy/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="h-5 w-5 text-highlight" />
          <h2 className="text-xl font-bold text-navy">Members</h2>
        </div>
        <span className="text-xs font-bold text-navy/60 bg-gray-200 px-2.5 py-1 rounded-full">
          {members.length} / 2 Active
        </span>
      </div>

      <div className="space-y-1">
        {members.map((member, index) => {
          const name = getMemberName(member, "Unknown");
          const initial = getInitial(name);
          const variant = AVATAR_VARIANTS[index % AVATAR_VARIANTS.length];
          const roleLabel = member.role === "OWNER" ? "Owner" : "Member";
          const roleStyle = ROLE_STYLES[member.role] ?? ROLE_STYLES.MEMBER;

          return (
            <div
              key={member.user.id}
              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <AvatarCircle
                  initial={initial}
                  variant={variant}
                  size="md"
                />
                <div>
                  <p className="font-bold text-navy">{name}</p>
                  <p className="text-xs text-navy/50">{member.user.email}</p>
                </div>
              </div>
              <span
                className={`text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full ${roleStyle}`}
              >
                {roleLabel}
              </span>
            </div>
          );
        })}
      </div>

      {members.length < 2 && (
        <button className="w-full mt-6 py-3 border-2 border-dashed border-navy/20 rounded-xl text-navy/60 font-semibold hover:border-highlight hover:text-highlight transition-all flex items-center justify-center gap-2">
          <UserPlus className="h-4 w-4" />
          Invite Member
        </button>
      )}
    </section>
  );
};

"use client";

import { useState } from "react";
import { Pencil, User } from "lucide-react";
import type { GetPlannerQuery } from "../Planner.api";
import MemberDataEditor from "../MemberDataEditor";
import { formatCurrency } from "@/lib/utils/budget";
import Image from "next/image";

type Planner = NonNullable<GetPlannerQuery["getPlanner"]>;
type Member = Planner["members"][number];

interface MembersCardProps {
  members: Member[];
  plannerId: string;
  currentUserId: string | null;
  onUpdate: () => void;
}

const MemberDisplay = ({
  member,
  isCurrentUser,
  plannerId,
  onUpdate,
}: {
  member: Member;
  isCurrentUser: boolean;
  plannerId: string;
  onUpdate: () => void;
}) => {
  const [editing, setEditing] = useState(false);

  const displayName = member.displayName || member.user.name || "Member";
  const cpf = member.cpfBreakdown;

  if (editing) {
    return (
      <MemberDataEditor
        plannerId={plannerId}
        member={member}
        onClose={() => setEditing(false)}
        onSuccess={() => {
          setEditing(false);
          onUpdate();
        }}
      />
    );
  }

  return (
    <div className="flex-1 rounded-lg border border-navy/10 bg-white/50 p-3">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {member.user.image ? (
            <Image
              src={member.user.image}
              alt={`${displayName} avatar`}
              width={32}
              height={32}
              sizes="32px"
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-navy/10 flex items-center justify-center">
              <User className="h-4 w-4 text-navy/50" />
            </div>
          )}
          <div>
            <div className="text-sm font-medium">
              {displayName}
              {isCurrentUser && (
                <span className="ml-1 text-xs text-navy/50">(You)</span>
              )}
            </div>
            {member.age && (
              <div className="text-xs text-navy/50">Age: {member.age}</div>
            )}
          </div>
        </div>
        {isCurrentUser && (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="text-navy/50 hover:text-navy/70 p-1"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {member.monthlyIncome ? (
        <div className="space-y-1 text-xs">
          <div className="flex justify-between text-navy/70">
            <span>Gross Income</span>
            <span>{formatCurrency(member.monthlyIncome)}</span>
          </div>
          {cpf && (
            <>
              <div className="flex justify-between text-navy/50">
                <span>CPF OA</span>
                <span>{formatCurrency(cpf.ordinaryAccount)}</span>
              </div>
              <div className="flex justify-between text-navy/50">
                <span>CPF SA</span>
                <span>{formatCurrency(cpf.specialAccount)}</span>
              </div>
              <div className="flex justify-between text-navy/50">
                <span>CPF MA</span>
                <span>{formatCurrency(cpf.medisaveAccount)}</span>
              </div>
              <div className="border-t border-navy/10 pt-1 mt-1 flex justify-between font-medium">
                <span>Take-home</span>
                <span className="text-highlight">
                  {formatCurrency(cpf.takeHomePay)}
                </span>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="text-xs text-navy/40 italic">
          {isCurrentUser ? "Add your income details" : "Income not set"}
        </div>
      )}
    </div>
  );
};

const MembersCard = ({
  members,
  plannerId,
  currentUserId,
  onUpdate,
}: MembersCardProps) => {
  return (
    <div className="rounded-xl border border-navy/10 bg-white/50 p-4">
      <h3 className="font-heading text-sm font-semibold mb-3 text-navy/80">
        Members & Income
      </h3>
      <div className="flex gap-3">
        {members.map((member) => (
          <MemberDisplay
            key={member.user.id}
            member={member}
            isCurrentUser={member.user.id === currentUserId}
            plannerId={plannerId}
            onUpdate={onUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default MembersCard;

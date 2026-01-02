"use client";

import { Badge } from "@/components/ui/badge";
import { Crown, User } from "lucide-react";
import type { MyPlannersQuery } from "./Planner.api";
import Image from "next/image";

type Member = MyPlannersQuery["myPlanners"][number]["members"][number];

interface MemberCardProps {
  member: Member;
  isCurrentUser: boolean;
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-SG", {
    style: "currency",
    currency: "SGD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);

const MemberCard = ({ member, isCurrentUser }: MemberCardProps) => {
  const displayName =
    member.displayName || member.user.name || member.user.email;
  const hasFinancialData = member.age && member.monthlyIncome;
  const cpf = member.cpfBreakdown;

  return (
    <div
      className={`rounded-lg border p-3 ${
        isCurrentUser
          ? "border-highlight/30 bg-highlight/5"
          : "border-navy/10 bg-white/50"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy/10">
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
              <User className="h-4 w-4 text-navy/50" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-navy">
                {displayName}
              </span>
              {isCurrentUser && (
                <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                  You
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-navy/50">
              {member.role === "OWNER" && (
                <Crown className="h-3 w-3 text-yellow-600" />
              )}
              <span>{member.role === "OWNER" ? "Owner" : "Member"}</span>
            </div>
          </div>
        </div>
      </div>

      {hasFinancialData ? (
        <div className="mt-3 space-y-2">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="rounded bg-navy/5 px-2 py-1.5">
              <div className="text-navy/50">Age</div>
              <div className="font-medium text-navy">{member.age}</div>
            </div>
            <div className="rounded bg-navy/5 px-2 py-1.5">
              <div className="text-navy/50">Monthly Income</div>
              <div className="font-medium text-navy">
                {formatCurrency(member.monthlyIncome!)}
              </div>
            </div>
          </div>

          {cpf && (
            <div className="rounded-lg border border-navy/10 bg-white/50 p-2">
              <div className="text-xs text-navy/50 mb-2">CPF Breakdown</div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <div className="text-navy/40">OA</div>
                  <div className="font-medium text-green-600">
                    {formatCurrency(cpf.ordinaryAccount)}
                  </div>
                </div>
                <div>
                  <div className="text-navy/40">SA</div>
                  <div className="font-medium text-blue-600">
                    {formatCurrency(cpf.specialAccount)}
                  </div>
                </div>
                <div>
                  <div className="text-navy/40">MA</div>
                  <div className="font-medium text-purple-600">
                    {formatCurrency(cpf.medisaveAccount)}
                  </div>
                </div>
              </div>
              <div className="mt-2 pt-2 border-t border-navy/10 flex justify-between text-xs">
                <span className="text-navy/50">Take-home Pay</span>
                <span className="font-medium text-navy">
                  {formatCurrency(cpf.takeHomePay)}
                </span>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="mt-3 text-xs text-navy/40 italic">
          {isCurrentUser
            ? "Click 'Edit My Info' to add your age and income"
            : "Financial info not set"}
        </div>
      )}
    </div>
  );
};

export default MemberCard;

"use client";

interface Member {
  id: string;
  name: string;
}

interface MemberAvatarsProps {
  members: Member[];
}

const getInitials = (name: string): string => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const avatarColors = [
  "bg-highlight",
  "bg-navy",
];

export const MemberAvatars = ({ members }: MemberAvatarsProps) => {
  return (
    <div className="flex -space-x-2">
      {members.map((member, index) => (
        <div
          key={member.id}
          className={`w-8 h-8 rounded-full ${avatarColors[index % avatarColors.length]} text-white flex items-center justify-center border-2 border-white text-xs font-bold ring-2 ring-transparent group-hover:ring-highlight/20 transition-all`}
          title={member.name}
        >
          {getInitials(member.name)}
        </div>
      ))}
    </div>
  );
};

/**
 * Member display utilities
 */

interface MemberLike {
  displayName?: string | null;
  user: {
    id: string;
    name?: string | null;
  };
}

/**
 * Find the current user and partner from a members array.
 */
export function splitMembers<T extends MemberLike>(
  members: T[],
  currentUserId: string | null,
): { currentMember: T | undefined; partnerMember: T | undefined } {
  return {
    currentMember: members.find((m) => m.user.id === currentUserId),
    partnerMember: members.find((m) => m.user.id !== currentUserId),
  };
}

/**
 * Get the display name for a member, with a fallback.
 */
export function getMemberName(
  member: MemberLike | null | undefined,
  fallback = "Unknown"
): string {
  if (!member) return fallback;
  return member.displayName || member.user.name || fallback;
}

/**
 * Get the initial(s) from a name string.
 */
export function getInitial(name: string, fallback = "?"): string {
  return name[0]?.toUpperCase() || fallback;
}

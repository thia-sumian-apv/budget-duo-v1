"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface GoalActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export const GoalActions = ({
  onEdit,
  onDelete,
  isDeleting,
}: GoalActionsProps) => {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <Button
        size="sm"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
      >
        <Pencil className="mr-1.5 h-3.5 w-3.5" />
        Edit
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        disabled={isDeleting}
        className="text-red-600 hover:text-red-700 hover:bg-red-50"
      >
        <Trash2 className="mr-1.5 h-3.5 w-3.5" />
        Remove
      </Button>
    </div>
  );
};

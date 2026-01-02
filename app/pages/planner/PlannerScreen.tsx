"use client";

import { useState } from "react";
import { useMyPlannersQuery } from "./Planner.api";
import PlannerList from "./PlannerList";
import PlannerView from "./PlannerView";
import CreatePlannerModal from "./CreatePlannerModal";
import JoinPlannerModal from "./JoinPlannerModal";
import type { ExpandedPlannerState } from "@/app/pages/home/homeTypes";

interface PlannerScreenProps {
  onExpandPlanner?: (planner: ExpandedPlannerState) => void;
}

const PlannerScreen = ({ onExpandPlanner }: PlannerScreenProps) => {
  const [selectedPlannerId, setSelectedPlannerId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const { data, loading, error, refetch } = useMyPlannersQuery();

  if (loading) {
    return (
      <div className="p-5 text-sm text-navy/70">Loading planners...</div>
    );
  }

  if (error) {
    return (
      <div className="p-5 text-sm text-red-600">Failed to load planners</div>
    );
  }

  const planners = data?.myPlanners ?? [];
  const selectedPlanner = planners.find((p) => p.id === selectedPlannerId);

  const handleSelectPlanner = (plannerId: string) => {
    const planner = planners.find((p) => p.id === plannerId);
    if (planner && onExpandPlanner) {
      // Use the new expanded planner view
      onExpandPlanner({
        plannerId: planner.id,
        plannerName: planner.name,
        plannerCode: planner.code,
      });
    } else {
      // Fallback to internal state
      setSelectedPlannerId(plannerId);
    }
  };

  return (
    <div className="p-5">
      {selectedPlanner && !onExpandPlanner ? (
        <PlannerView
          planner={selectedPlanner}
          onBack={() => setSelectedPlannerId(null)}
          onUpdate={() => refetch()}
        />
      ) : (
        <PlannerList
          planners={planners}
          onSelectPlanner={handleSelectPlanner}
          onCreateNew={() => setShowCreateModal(true)}
          onJoinExisting={() => setShowJoinModal(true)}
        />
      )}

      {showCreateModal && (
        <CreatePlannerModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={(plannerId) => {
            setShowCreateModal(false);
            refetch().then(() => setSelectedPlannerId(plannerId));
          }}
        />
      )}

      {showJoinModal && (
        <JoinPlannerModal
          onClose={() => setShowJoinModal(false)}
          onSuccess={(plannerId) => {
            setShowJoinModal(false);
            refetch().then(() => setSelectedPlannerId(plannerId));
          }}
        />
      )}
    </div>
  );
};

export default PlannerScreen;

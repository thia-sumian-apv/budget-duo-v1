"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Wallet } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCreatePlannerMutation } from "@/app/pages/planner/Planner.api";

export default function NewPlannerPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [createPlanner, { loading }] = useCreatePlannerMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Please enter a name for your planner");
      return;
    }

    const result = await createPlanner({
      variables: { input: { name: name.trim() } },
      refetchQueries: ["MyPlanners"],
    });

    if (result.data?.createPlanner.__typename === "CreatePlannerSuccessfulResponse") {
      const plannerId = result.data.createPlanner.planner.id;
      router.push(`/planner/${plannerId}`);
    } else if (result.data?.createPlanner.__typename === "ErrorResponse") {
      const errorField = result.data.createPlanner.fields?.[0];
      setError(errorField?.message ?? "Failed to create planner");
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Back link */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-navy mb-6 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Card */}
      <div className="dashboard-card p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-highlight/10 flex items-center justify-center">
            <Wallet className="h-7 w-7 text-highlight" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-navy">Create New Planner</h1>
            <p className="text-sm text-gray-500">
              Start a budget plan with your partner
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="planner-name"
              className="block text-sm font-medium text-navy mb-2"
            >
              Planner Name
            </label>
            <Input
              id="planner-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Our Budget 2025"
              className="rounded-xl border-gray-200 focus:border-highlight focus:ring-highlight"
              autoFocus
            />
            <p className="text-xs text-gray-400 mt-2">
              Choose a name that helps you identify this budget plan
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard")}
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 bg-highlight hover:bg-primary-dark text-white rounded-xl font-semibold"
            >
              {loading ? "Creating..." : "Create Planner"}
            </Button>
          </div>
        </form>

        {/* Info */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-navy mb-2">What happens next?</h3>
          <ul className="text-sm text-gray-500 space-y-2">
            <li className="flex items-start gap-2">
              <span className="text-highlight font-bold">1.</span>
              You&apos;ll get an invite code to share with your partner
            </li>
            <li className="flex items-start gap-2">
              <span className="text-highlight font-bold">2.</span>
              Set up your income and CPF details
            </li>
            <li className="flex items-start gap-2">
              <span className="text-highlight font-bold">3.</span>
              Add your financial goals together
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

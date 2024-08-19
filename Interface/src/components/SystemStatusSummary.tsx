import React from "react";
import { TagWithDetails } from "../api/factoryIO";
import { Alert } from "../hooks/useAlerts";

interface SystemStatusSummaryProps {
  tags: TagWithDetails[];
  alerts: Alert[];
  isSimulationPaused: boolean;
  manualFailures: string[];
}

const SystemStatusSummary: React.FC<SystemStatusSummaryProps> = ({
  tags,
  alerts,
  isSimulationPaused,
  manualFailures,
}) => {
  const activeAlerts = alerts.filter((alert) => {
    const tag = tags.find((t) => t.id === alert.tagId);
    if (!tag) return false;

    switch (alert.condition) {
      case "gt":
        return Number(tag.value) > alert.value;
      case "lt":
        return Number(tag.value) < alert.value;
      case "eq":
        return tag.value === alert.value;
      default:
        return false;
    }
  });

  let statusColor = "bg-green-500";
  let statusMessage = "System running normally";

  if (isSimulationPaused) {
    statusColor = "bg-red-500";
    statusMessage = "Simulation paused or stopped";
  } else if (manualFailures.length > 0) {
    statusColor = "bg-orange-500";
    statusMessage = `Manual failure injection applied to: ${manualFailures.join(
      ", "
    )}`;
  } else if (activeAlerts.length > 0) {
    statusColor = "bg-yellow-500";
    statusMessage = "Active alerts present";
  }

  return (
    <div className="bg-muted p-4 rounded-lg">
      <h2 className="text-xl font-semibold mb-2">System Status Summary</h2>
      <div className="flex items-center space-x-2">
        <div className={`w-4 h-4 rounded-full ${statusColor}`}></div>
        <span>{statusMessage}</span>
      </div>
      <div className="mt-2">
        <p>Total Tags Monitored: {tags.length}</p>
        <p>Active Alerts: {activeAlerts.length}</p>
        <p>Manual Failures: {manualFailures.length}</p>
      </div>
      {activeAlerts.length > 0 && (
        <div className="mt-2">
          <h3 className="font-semibold">Active Alerts:</h3>
          <ul className="list-disc list-inside">
            {activeAlerts.map((alert, index) => (
              <li key={index}>{alert.message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SystemStatusSummary;

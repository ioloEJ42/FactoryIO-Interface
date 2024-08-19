import React, { useState } from "react";
import { TagWithDetails } from "../api/factoryIO";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Scatter,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Maximize2, Minimize2 } from "lucide-react";

interface DataVisualizerProps {
  tags: TagWithDetails[];
  history: Record<
    string,
    { timestamp: number; value: number | boolean; isActive: boolean }[]
  >;
  timeRange: { start: Date; end: Date };
  layout: "single" | "double";
}

const DataVisualizer: React.FC<DataVisualizerProps> = ({
  tags,
  history,
  timeRange,
  layout,
}) => {
  const [fullscreenTag, setFullscreenTag] = useState<string | null>(null);

  const renderChart = (tag: TagWithDetails, isFullscreen: boolean = false) => (
    <div
      key={tag.id}
      className={`border p-4 rounded-lg ${
        isFullscreen ? "fixed inset-0 z-50 bg-background" : ""
      }`}
    >
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-lg font-semibold">{tag.name}</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setFullscreenTag(isFullscreen ? null : tag.id)}
        >
          {isFullscreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </Button>
      </div>
      <p>Description: {tag.description}</p>
      <p>Current Value: {String(tag.value)}</p>
      <p>Active: {tag.isActive ? "Yes" : "No"}</p>
      <ResponsiveContainer width="100%" height={isFullscreen ? 800 : 300}>
        <LineChart
          data={
            history[tag.id]?.filter(
              (entry) =>
                entry.timestamp >= timeRange.start.getTime() &&
                entry.timestamp <= timeRange.end.getTime()
            ) || []
          }
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="timestamp"
            domain={[timeRange.start.getTime(), timeRange.end.getTime()]}
            type="number"
            tickFormatter={(unixTime: number) =>
              new Date(unixTime).toLocaleTimeString()
            }
            allowDataOverflow={true}
          />
          <YAxis allowDataOverflow={true} />
          <Tooltip
            labelFormatter={(label: number) => new Date(label).toLocaleString()}
            formatter={(value: any) => [String(value), tag.name]}
          />
          <Line type="monotone" dataKey="value" stroke="#8884d8" dot={false} />
          <ReferenceLine
            y={0.5}
            stroke="green"
            strokeDasharray="3 3"
            label="Active Threshold"
          />
          <Scatter name="Active State" dataKey="isActive" fill="red" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  if (fullscreenTag) {
    const tag = tags.find((t) => t.id === fullscreenTag);
    if (tag) {
      return renderChart(tag, true);
    }
  }

  return (
    <div
      className={`grid gap-8 ${
        layout === "double" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
      }`}
    >
      {tags.map((tag) => renderChart(tag))}
    </div>
  );
};

export default DataVisualizer;

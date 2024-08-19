import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeRangeSelectorProps {
  range: { start: Date; end: Date };
  onChange: (newRange: { start: Date; end: Date }) => void;
}

const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
  range,
  onChange,
}) => {
  const handleChange = (value: string) => {
    const end = new Date();
    let start: Date;

    switch (value) {
      case "1h":
        start = new Date(end.getTime() - 60 * 60 * 1000);
        break;
      case "6h":
        start = new Date(end.getTime() - 6 * 60 * 60 * 1000);
        break;
      case "24h":
        start = new Date(end.getTime() - 24 * 60 * 60 * 1000);
        break;
      case "7d":
        start = new Date(end.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      default:
        start = new Date(end.getTime() - 60 * 60 * 1000); // Default to 1 hour
    }

    onChange({ start, end });
  };

  const getCurrentRange = (): string => {
    const diff = range.end.getTime() - range.start.getTime();
    const hours = diff / (1000 * 60 * 60);

    if (hours <= 1) return "1h";
    if (hours <= 6) return "6h";
    if (hours <= 24) return "24h";
    return "7d";
  };

  return (
    <div className="flex items-center space-x-2">
      <span>Time Range:</span>
      <Select onValueChange={handleChange} value={getCurrentRange()}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select time range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="1h">Last 1 hour</SelectItem>
          <SelectItem value="6h">Last 6 hours</SelectItem>
          <SelectItem value="24h">Last 24 hours</SelectItem>
          <SelectItem value="7d">Last 7 days</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default TimeRangeSelector;

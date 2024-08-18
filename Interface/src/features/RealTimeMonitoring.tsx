import React, { useState } from "react";
import { useQuery } from "react-query";
import { api, Tag } from "../api/factoryIO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const RealTimeMonitoring: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const { data: tags } = useQuery<Tag[], Error>("tags", () => api.getTags());

  const { data: monitoredTags } = useQuery<Tag[], Error>(
    ["monitoredTags", selectedTags],
    () => api.getTagValues(selectedTags),
    {
      enabled: selectedTags.length > 0,
      refetchInterval: 1000, // Refetch every second
    }
  );

  const handleAddTag = (tagId: string) => {
    setSelectedTags((prev) => [...prev, tagId]);
  };

  const handleRemoveTag = (tagId: string) => {
    setSelectedTags((prev) => prev.filter((id) => id !== tagId));
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Real-time Monitoring</h1>
      <Select onValueChange={handleAddTag}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Add tag to monitor" />
        </SelectTrigger>
        <SelectContent>
          {tags
            ?.filter((tag) => !selectedTags.includes(tag.id))
            .map((tag: Tag) => (
              <SelectItem key={tag.id} value={tag.id}>
                {tag.name}
              </SelectItem>
            ))}
        </SelectContent>
      </Select>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {monitoredTags?.map((tag: Tag) => (
          <Card key={tag.id}>
            <CardHeader>
              <CardTitle>{tag.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Value: {String(tag.value)}</p>
              <p>Type: {tag.type}</p>
              <p>Kind: {tag.kind}</p>
              <Button
                onClick={() => handleRemoveTag(tag.id)}
                variant="destructive"
                size="sm"
              >
                Remove
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RealTimeMonitoring;

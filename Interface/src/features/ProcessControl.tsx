import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { api, Tag } from "../api/factoryIO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

const ProcessControl: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const [newValue, setNewValue] = useState<string>("");
  const queryClient = useQueryClient();

  const { data: tags } = useQuery("tags", () =>
    api.getTags({ kind: "Output" })
  );

  const setValueMutation = useMutation(
    (tagValue: { id: string; value: boolean | number }) =>
      api.setTagValue(tagValue.id, tagValue.value),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("tags");
      },
    }
  );

  const handleSetValue = () => {
    if (selectedTag) {
      const value =
        selectedTag.type === "Bit" ? newValue === "true" : Number(newValue);
      setValueMutation.mutate({ id: selectedTag.id, value });
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Process Control</h1>
      <Select
        onValueChange={(value) =>
          setSelectedTag(tags?.find((t) => t.id === value) || null)
        }
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select a tag to control" />
        </SelectTrigger>
        <SelectContent>
          {tags?.map((tag) => (
            <SelectItem key={tag.id} value={tag.id}>
              {tag.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selectedTag && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedTag.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>Current Value: {String(selectedTag.value)}</p>
            <p>Type: {selectedTag.type}</p>
            {selectedTag.type === "Bit" ? (
              <Switch
                checked={selectedTag.value as boolean}
                onCheckedChange={(checked) => {
                  setValueMutation.mutate({
                    id: selectedTag.id,
                    value: checked,
                  });
                }}
              />
            ) : (
              <div className="flex space-x-2">
                <Input
                  type="number"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="New value"
                />
                <Button onClick={handleSetValue}>Set Value</Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProcessControl;

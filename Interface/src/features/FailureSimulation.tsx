import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { api, Tag } from "../api/factoryIO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const FailureSimulation: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);
  const queryClient = useQueryClient();

  const { data: tags } = useQuery<Tag[], Error>("tags", () => api.getTags());

  const setAlwaysOffMutation = useMutation(
    () => api.setTagAlwaysOff(selectedTag!.id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("tags");
      },
    }
  );

  const setAlwaysOnMutation = useMutation(
    () => api.setTagAlwaysOn(selectedTag!.id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("tags");
      },
    }
  );

  const releaseFailureMutation = useMutation(
    () => api.releaseTagForce(selectedTag!.id),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("tags");
      },
    }
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Failure Simulation</h1>
      <Select
        onValueChange={(value) =>
          setSelectedTag(tags?.find((t) => t.id === value) || null)
        }
      >
        <SelectTrigger className="w-[300px]">
          <SelectValue placeholder="Select a tag to simulate failure" />
        </SelectTrigger>
        <SelectContent>
          {tags?.map((tag: Tag) => (
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
            <p>Kind: {selectedTag.kind}</p>
            <div className="space-x-2">
              <Button
                onClick={() => setAlwaysOffMutation.mutate()}
                disabled={selectedTag.openCircuit}
              >
                Set Always Off
              </Button>
              <Button
                onClick={() => setAlwaysOnMutation.mutate()}
                disabled={selectedTag.shortCircuit}
              >
                Set Always On
              </Button>
              <Button
                onClick={() => releaseFailureMutation.mutate()}
                disabled={!selectedTag.openCircuit && !selectedTag.shortCircuit}
              >
                Release Failure
              </Button>
            </div>
            {(selectedTag.openCircuit || selectedTag.shortCircuit) && (
              <Alert>
                <AlertTitle>Failure Simulated</AlertTitle>
                <AlertDescription>
                  This tag is currently simulating a failure:{" "}
                  {selectedTag.openCircuit ? "Always Off" : "Always On"}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FailureSimulation;

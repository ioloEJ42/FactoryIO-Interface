import React, { useState } from "react";
import { useQuery } from "react-query";
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

interface TagGroup {
  name: string;
  tagIds: string[];
}

const TagGrouping: React.FC = () => {
  const [groups, setGroups] = useState<TagGroup[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<TagGroup | null>(null);
  const [newGroupName, setNewGroupName] = useState("");
  const [selectedTagId, setSelectedTagId] = useState<string | null>(null);

  const { data: tags } = useQuery<Tag[], Error>("tags", () => api.getTags());

  const { data: groupTags } = useQuery<Tag[], Error>(
    ["groupTags", selectedGroup?.tagIds],
    () => api.getTagValues(selectedGroup?.tagIds || []),
    { enabled: !!selectedGroup && selectedGroup.tagIds.length > 0 }
  );

  const createGroup = () => {
    if (newGroupName) {
      setGroups([...groups, { name: newGroupName, tagIds: [] }]);
      setNewGroupName("");
    }
  };

  const addTagToGroup = () => {
    if (selectedGroup && selectedTagId) {
      const updatedGroups = groups.map((group) =>
        group.name === selectedGroup.name
          ? { ...group, tagIds: [...group.tagIds, selectedTagId] }
          : group
      );
      setGroups(updatedGroups);
      setSelectedGroup({
        ...selectedGroup,
        tagIds: [...selectedGroup.tagIds, selectedTagId],
      });
      setSelectedTagId(null);
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Tag Grouping</h1>

      <div className="flex space-x-2">
        <Input
          placeholder="New group name"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
        />
        <Button onClick={createGroup}>Create Group</Button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              onValueChange={(value) =>
                setSelectedGroup(groups.find((g) => g.name === value) || null)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a group" />
              </SelectTrigger>
              <SelectContent>
                {groups.map((group) => (
                  <SelectItem key={group.name} value={group.name}>
                    {group.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add Tag to Group</CardTitle>
          </CardHeader>
          <CardContent>
            <Select onValueChange={setSelectedTagId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a tag" />
              </SelectTrigger>
              <SelectContent>
                {tags?.map((tag: Tag) => (
                  <SelectItem key={tag.id} value={tag.id}>
                    {tag.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              className="mt-2"
              onClick={addTagToGroup}
              disabled={!selectedGroup || !selectedTagId}
            >
              Add to Group
            </Button>
          </CardContent>
        </Card>
      </div>

      {selectedGroup && groupTags && (
        <Card>
          <CardHeader>
            <CardTitle>{selectedGroup.name} Tags</CardTitle>
          </CardHeader>
          <CardContent>
            <ul>
              {groupTags.map((tag: Tag) => (
                <li key={tag.id}>
                  {tag.name}: {String(tag.value)}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TagGrouping;

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tag } from '../api/factoryIO';

interface Group {
  id: string;
  name: string;
  tagIds: string[];
}

interface GroupManagerProps {
  groups: Group[];
  onCreateGroup: (name: string) => void;
  onDeleteGroup: (groupId: string) => void;
  onAddToGroup: (groupId: string, tagId: string) => void;
  onRemoveFromGroup: (groupId: string, tagId: string) => void;
  tags: Tag[];
}

const GroupManager: React.FC<GroupManagerProps> = ({ 
  groups, onCreateGroup, onDeleteGroup, onAddToGroup, onRemoveFromGroup, tags 
}) => {
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  const handleCreateGroup = () => {
    if (newGroupName) {
      onCreateGroup(newGroupName);
      setNewGroupName('');
    }
  };

  const handleAddToGroup = () => {
    if (selectedGroup && selectedTag) {
      onAddToGroup(selectedGroup, selectedTag);
      setSelectedTag(null);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Tag Groups</h2>
      <div className="flex space-x-2">
        <Input 
          type="text" 
          placeholder="New Group Name"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
        />
        <Button onClick={handleCreateGroup}>Create Group</Button>
      </div>
      <div className="flex space-x-2">
        <Select onValueChange={setSelectedGroup}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Group" />
          </SelectTrigger>
          <SelectContent>
            {groups.map((group) => (
              <SelectItem key={group.id} value={group.id}>{group.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={setSelectedTag}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Tag" />
          </SelectTrigger>
          <SelectContent>
            {tags.map((tag) => (
              <SelectItem key={tag.id} value={tag.id}>{tag.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={handleAddToGroup}>Add to Group</Button>
      </div>
      <div className="space-y-2">
        {groups.map((group) => (
          <div key={group.id} className="bg-muted p-2 rounded">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">{group.name}</h3>
              <Button variant="destructive" onClick={() => onDeleteGroup(group.id)}>Delete Group</Button>
            </div>
            <ul className="mt-2">
              {group.tagIds.map((tagId) => {
                const tag = tags.find(t => t.id === tagId);
                return tag ? (
                  <li key={tagId} className="flex justify-between items-center">
                    <span>{tag.name}</span>
                    <Button variant="ghost" onClick={() => onRemoveFromGroup(group.id, tagId)}>Remove</Button>
                  </li>
                ) : null;
              })}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GroupManager;
import React, { useState, useMemo } from "react";
import { Tag } from "../api/factoryIO";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface TagSelectorProps {
  allTags: Tag[];
  selectedTags: string[];
  onSelectionChange: (selected: string[]) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({
  allTags,
  selectedTags,
  onSelectionChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const sortedTags = useMemo(() => {
    return allTags.sort((a, b) => {
      if (selectedTags.includes(a.id) && !selectedTags.includes(b.id))
        return -1;
      if (!selectedTags.includes(a.id) && selectedTags.includes(b.id)) return 1;
      return a.name.localeCompare(b.name);
    });
  }, [allTags, selectedTags]);

  const filteredTags = sortedTags.filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTagToggle = (tagId: string) => {
    const newSelection = selectedTags.includes(tagId)
      ? selectedTags.filter((id) => id !== tagId)
      : [...selectedTags, tagId];
    onSelectionChange(newSelection);
  };

  return (
    <div className="space-y-2">
      <Input
        type="text"
        placeholder="Search tags..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <div className="max-h-60 overflow-y-auto">
        {filteredTags.map((tag) => (
          <div key={tag.id} className="flex items-center space-x-2">
            <Checkbox
              id={tag.id}
              checked={selectedTags.includes(tag.id)}
              onCheckedChange={() => handleTagToggle(tag.id)}
            />
            <label htmlFor={tag.id}>{tag.name}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagSelector;

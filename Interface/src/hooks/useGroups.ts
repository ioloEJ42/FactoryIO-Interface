import { useState, useCallback } from 'react';

interface Group {
  id: string;
  name: string;
  tagIds: string[];
}

export const useGroups = () => {
  const [groups, setGroups] = useState<Group[]>([]);

  const createGroup = useCallback((name: string) => {
    setGroups(prev => [...prev, { id: Date.now().toString(), name, tagIds: [] }]);
  }, []);

  const deleteGroup = useCallback((groupId: string) => {
    setGroups(prev => prev.filter(group => group.id !== groupId));
  }, []);

  const addToGroup = useCallback((groupId: string, tagId: string) => {
    setGroups(prev => prev.map(group => 
      group.id === groupId ? { ...group, tagIds: [...group.tagIds, tagId] } : group
    ));
  }, []);

  const removeFromGroup = useCallback((groupId: string, tagId: string) => {
    setGroups(prev => prev.map(group => 
      group.id === groupId ? { ...group, tagIds: group.tagIds.filter(id => id !== tagId) } : group
    ));
  }, []);

  return { groups, createGroup, deleteGroup, addToGroup, removeFromGroup };
};
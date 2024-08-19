import { useState, useCallback } from 'react';
import { TagWithDetails } from '../api/factoryIO';

export const useTagHistory = (selectedTags: string[]) => {
  const [tagHistory, setTagHistory] = useState<Record<string, { timestamp: number; value: number | boolean; isActive: boolean }[]>>({});

  const updateTagHistory = useCallback((tags: TagWithDetails[]) => {
    const now = Date.now();
    setTagHistory(prev => {
      const newHistory = { ...prev };
      tags.forEach(tag => {
        if (selectedTags.includes(tag.id)) {
          // Simulate an event every 5 seconds
          const isEvent = now % 5000 < 1000;
          newHistory[tag.id] = [
            ...(newHistory[tag.id] || []),
            { 
              timestamp: now, 
              value: isEvent ? (typeof tag.value === 'boolean' ? !tag.value : tag.value + 1) : tag.value,
              isActive: isEvent ? !tag.isActive : tag.isActive
            }
          ].slice(-100); // Keep last 100 entries
        }
      });
      return newHistory;
    });
  }, [selectedTags]);

  return { tagHistory, updateTagHistory };
};
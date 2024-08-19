import { useState, useCallback } from 'react';
import { Tag } from '../api/factoryIO';

export interface Alert {
  tagId: string;
  condition: 'gt' | 'lt' | 'eq';
  value: number;
  message: string;
}

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const checkAlerts = useCallback((tags: Tag[]) => {
    tags.forEach(tag => {
      alerts.forEach(alert => {
        if (alert.tagId === tag.id) {
          switch (alert.condition) {
            case 'gt':
              if (Number(tag.value) > alert.value) console.log(alert.message);
              break;
            case 'lt':
              if (Number(tag.value) < alert.value) console.log(alert.message);
              break;
            case 'eq':
              if (tag.value === alert.value) console.log(alert.message);
              break;
          }
        }
      });
    });
  }, [alerts]);

  return { alerts, setAlerts, checkAlerts };
};
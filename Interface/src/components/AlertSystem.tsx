import React, { useState } from 'react';
import { Alert } from '../hooks/useAlerts';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tag } from '../api/factoryIO';

interface AlertSystemProps {
  alerts: Alert[];
  onSetAlert: (alerts: Alert[]) => void;
  tags: Tag[];
}

const AlertSystem: React.FC<AlertSystemProps> = ({ alerts, onSetAlert, tags }) => {
  const [newAlert, setNewAlert] = useState<Partial<Alert>>({});

  const handleAddAlert = () => {
    if (newAlert.tagId && newAlert.condition && newAlert.value !== undefined && newAlert.message) {
      onSetAlert([...alerts, newAlert as Alert]);
      setNewAlert({});
    }
  };

  const handleRemoveAlert = (index: number) => {
    const updatedAlerts = alerts.filter((_, i) => i !== index);
    onSetAlert(updatedAlerts);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Alerts</h2>
      <div className="flex space-x-2">
        <Select onValueChange={(value) => setNewAlert({ ...newAlert, tagId: value })}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select Tag" />
          </SelectTrigger>
          <SelectContent>
            {tags.map((tag) => (
              <SelectItem key={tag.id} value={tag.id}>{tag.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => setNewAlert({ ...newAlert, condition: value as 'gt' | 'lt' | 'eq' })}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Condition" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gt">{'>'}</SelectItem>
            <SelectItem value="lt">{'<'}</SelectItem>
            <SelectItem value="eq">{'='}</SelectItem>
          </SelectContent>
        </Select>
        <Input 
          type="number" 
          placeholder="Value"
          onChange={(e) => setNewAlert({ ...newAlert, value: parseFloat(e.target.value) })}
          value={newAlert.value || ''}
        />
        <Input 
          type="text" 
          placeholder="Alert Message"
          onChange={(e) => setNewAlert({ ...newAlert, message: e.target.value })}
          value={newAlert.message || ''}
        />
        <Button onClick={handleAddAlert}>Add Alert</Button>
      </div>
      <div className="space-y-2">
        {alerts.map((alert, index) => (
          <div key={index} className="flex justify-between items-center bg-muted p-2 rounded">
            <span>
              {tags.find(t => t.id === alert.tagId)?.name} {alert.condition} {alert.value}: {alert.message}
            </span>
            <Button variant="destructive" onClick={() => handleRemoveAlert(index)}>Remove</Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertSystem;
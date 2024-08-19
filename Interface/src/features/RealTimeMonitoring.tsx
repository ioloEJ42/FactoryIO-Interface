import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import { api, TagWithDetails } from '../api/factoryIO';
import TagSelector from '../components/TagSelector';
import DataVisualizer from '../components/DataVisualizer';
import AlertSystem from '../components/AlertSystem';
import GroupManager from '../components/GroupManager';
import TimeRangeSelector from '../components/TimeRangeSelector';
import SystemStatusSummary from '../components/SystemStatusSummary';
import { useTagHistory } from '../hooks/useTagHistory';
import { useAlerts } from '../hooks/useAlerts';
import { useGroups } from '../hooks/useGroups';
import { Button } from "@/components/ui/button";

const RealTimeMonitoring: React.FC = () => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [timeRange, setTimeRange] = useState<{ start: Date; end: Date }>({
    start: new Date(Date.now() - 3600000), // Last hour
    end: new Date()
  });
  const [graphLayout, setGraphLayout] = useState<'single' | 'double'>('single');
  const [manualFailures, setManualFailures] = useState<string[]>([]);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);
  const [isSimulationPaused, setIsSimulationPaused] = useState(false);

  const { data: allTags } = useQuery<TagWithDetails[]>('tags', () => api.getTagsWithDetails());
  const { data: monitoredTags, isLoading, error } = useQuery<TagWithDetails[]>(
    ['monitoredTags', selectedTags],
    () => api.getTagValuesWithDetails(selectedTags),
    { 
      enabled: selectedTags.length > 0, 
      refetchInterval: 1000,
      onSuccess: () => {
        setLastUpdateTime(new Date());
        // If we get new data, the simulation is not paused
        setIsSimulationPaused(false);
      }
    }
  );

  const { tagHistory, updateTagHistory } = useTagHistory(selectedTags);
  const { alerts, setAlerts, checkAlerts } = useAlerts();
  const { groups, createGroup, deleteGroup, addToGroup, removeFromGroup } = useGroups();

  useEffect(() => {
    if (monitoredTags) {
      updateTagHistory(monitoredTags);
      checkAlerts(monitoredTags);
    }
  }, [monitoredTags, updateTagHistory, checkAlerts]);

  // Check if simulation is paused
  useEffect(() => {
    const timer = setInterval(() => {
      if (lastUpdateTime && new Date().getTime() - lastUpdateTime.getTime() > 5000) {
        setIsSimulationPaused(true);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lastUpdateTime]);

  const handleTagSelection = (tagIds: string[]) => {
    setSelectedTags(tagIds);
  };

  const handleTimeRangeChange = (newRange: { start: Date; end: Date }) => {
    setTimeRange(newRange);
  };

  const handleExportData = () => {
    if (!monitoredTags) return;

    const csvContent = [
      ['Tag Name', 'ID', 'Value', 'Active', 'Timestamp'].join(','),
      ...monitoredTags.map(tag => [
        tag.name,
        tag.id,
        tag.value,
        tag.isActive ? 'Yes' : 'No',
        new Date().toISOString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'tag_data_export.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const toggleManualFailure = (tagId: string) => {
    setManualFailures(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    );
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Real-time Monitoring</h1>
      
      <SystemStatusSummary 
        tags={monitoredTags || []} 
        alerts={alerts}
        isSimulationPaused={isSimulationPaused}
        manualFailures={manualFailures}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <TagSelector 
            allTags={allTags ?? []} 
            selectedTags={selectedTags}
            onSelectionChange={handleTagSelection}
          />
        </div>
        <div>
          <TimeRangeSelector range={timeRange} onChange={handleTimeRangeChange} />
        </div>
      </div>

      <AlertSystem 
        alerts={alerts}
        onSetAlert={setAlerts}
        tags={allTags ?? []}
      />

      <GroupManager 
        groups={groups}
        onCreateGroup={createGroup}
        onDeleteGroup={deleteGroup}
        onAddToGroup={addToGroup}
        onRemoveFromGroup={removeFromGroup}
        tags={allTags ?? []}
      />

      <div className="flex space-x-4">
        <Button onClick={handleExportData}>Export Data to CSV</Button>
        <Button onClick={() => setGraphLayout(graphLayout === 'single' ? 'double' : 'single')}>
          {graphLayout === 'single' ? 'Switch to Two Columns' : 'Switch to Single Column'}
        </Button>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Manual Failure Injection</h2>
        <div className="flex flex-wrap gap-2">
          {(monitoredTags || []).map(tag => (
            <Button 
              key={tag.id}
              onClick={() => toggleManualFailure(tag.id)}
              variant={manualFailures.includes(tag.id) ? "destructive" : "outline"}
            >
              {tag.name}
            </Button>
          ))}
        </div>
      </div>

      <DataVisualizer 
        tags={monitoredTags || []} 
        history={tagHistory}
        timeRange={timeRange}
        layout={graphLayout}
      />
    </div>
  );
};

export default RealTimeMonitoring;
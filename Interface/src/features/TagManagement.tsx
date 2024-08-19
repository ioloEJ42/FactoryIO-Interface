import React, { useState, useCallback, useMemo } from 'react';
import { useQuery } from 'react-query';
import { api, Tag } from '../api/factoryIO';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Star, Info } from 'lucide-react';
import debounce from 'lodash/debounce';
import { useFavorites } from '../hooks/useFavorites';

const InfoTooltip: React.FC<{ content: string }> = ({ content }) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger>
        <Info className="h-4 w-4 ml-1" />
      </TooltipTrigger>
      <TooltipContent>
        <p>{content}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

const TagManagement: React.FC = () => {
  const [nameFilter, setNameFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<'Bit' | 'Int' | 'Float' | 'all'>('all');
  const [kindFilter, setKindFilter] = useState<'Input' | 'Output' | 'all'>('all');
  const { favorites, toggleFavorite } = useFavorites();

  const { data: tags, isLoading, error } = useQuery<Tag[], Error>(['tags', nameFilter, typeFilter, kindFilter], 
    () => api.getTags({ 
      name: nameFilter, 
      type: typeFilter !== 'all' ? typeFilter : undefined, 
      kind: kindFilter !== 'all' ? kindFilter : undefined 
    }));

  const debouncedSetNameFilter = useCallback(
    debounce((value: string) => setNameFilter(value), 300),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetNameFilter(e.target.value);
  };

  const handleTypeChange = (value: 'Bit' | 'Int' | 'Float' | 'all') => {
    setTypeFilter(value);
  };

  const handleKindChange = (value: 'Input' | 'Output' | 'all') => {
    setKindFilter(value);
  };

  const handleClearFilters = () => {
    setNameFilter('');
    setTypeFilter('all');
    setKindFilter('all');
  };

  const sortedTags = useMemo(() => {
    if (!tags) return [];
    return [...tags].sort((a, b) => {
      if (favorites.includes(a.id) && !favorites.includes(b.id)) return -1;
      if (!favorites.includes(a.id) && favorites.includes(b.id)) return 1;
      return 0;
    });
  }, [tags, favorites]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Tag Management</h1>
      <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-4">
        <Input
          placeholder="Filter by name"
          onChange={handleInputChange}
          className="w-full md:w-auto"
        />
        <Select value={typeFilter} onValueChange={handleTypeChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Bit">Bit</SelectItem>
            <SelectItem value="Int">Int</SelectItem>
            <SelectItem value="Float">Float</SelectItem>
          </SelectContent>
        </Select>
        <Select value={kindFilter} onValueChange={handleKindChange}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Filter by kind" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Kinds</SelectItem>
            <SelectItem value="Input">Input</SelectItem>
            <SelectItem value="Output">Output</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleClearFilters} className="w-full md:w-auto">Clear Filters</Button>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Favorite</TableHead>
              <TableHead>Name <InfoTooltip content="Name for the tag." /></TableHead>
              <TableHead>ID <InfoTooltip content="Unique identifier for the tag." /></TableHead>
              <TableHead>Address <InfoTooltip content="Tag address." /></TableHead>
              <TableHead>Type <InfoTooltip content="Data type of the tag's value. Possible values are bit, int, float." /></TableHead>
              <TableHead>Kind <InfoTooltip content="Kind of tag from the controller point of view. Can be either input or output." /></TableHead>
              <TableHead>Value <InfoTooltip content="Tag value." /></TableHead>
              <TableHead>Open Circuit <InfoTooltip content="Whether the tag has an always off failure." /></TableHead>
              <TableHead>Short Circuit <InfoTooltip content="Whether the tag has an always on failure." /></TableHead>
              <TableHead>Is Forced <InfoTooltip content="Whether the tag is forced." /></TableHead>
              <TableHead>Forced Value <InfoTooltip content="Tag value when forced." /></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTags.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell>
                  <button onClick={() => toggleFavorite(tag.id)}>
                    <Star fill={favorites.includes(tag.id) ? "gold" : "none"} />
                  </button>
                </TableCell>
                <TableCell>{tag.name}</TableCell>
                <TableCell>{tag.id}</TableCell>
                <TableCell>{tag.address}</TableCell>
                <TableCell>{tag.type}</TableCell>
                <TableCell>{tag.kind}</TableCell>
                <TableCell>{String(tag.value)}</TableCell>
                <TableCell>{String(tag.openCircuit)}</TableCell>
                <TableCell>{String(tag.shortCircuit)}</TableCell>
                <TableCell>{String(tag.isForced)}</TableCell>
                <TableCell>{String(tag.forcedValue)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default TagManagement;
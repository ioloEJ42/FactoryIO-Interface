import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { api } from '../api/factoryIO';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const TagSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [kindFilter, setKindFilter] = useState<string | null>(null);

  const { data: tags, isLoading, error } = useQuery(['tags', searchTerm, typeFilter, kindFilter], 
    () => api.getTags({ name: searchTerm, type: typeFilter || undefined, kind: kindFilter || undefined }));

  const filteredTags = tags?.filter((tag) =>
    tag.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!typeFilter || tag.type === typeFilter) &&
    (!kindFilter || tag.kind === kindFilter)
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {(error as Error).message}</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Tag Search</h1>
      
      <div className="flex space-x-2">
        <Input
          placeholder="Search tags"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select onValueChange={(value) => setTypeFilter(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Types</SelectItem>
            <SelectItem value="Bit">Bit</SelectItem>
            <SelectItem value="Int">Int</SelectItem>
            <SelectItem value="Float">Float</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => setKindFilter(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by kind" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Kinds</SelectItem>
            <SelectItem value="Input">Input</SelectItem>
            <SelectItem value="Output">Output</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => { setSearchTerm(''); setTypeFilter(null); setKindFilter(null); }}>
          Clear Filters
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Kind</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredTags?.map((tag) => (
            <TableRow key={tag.id}>
              <TableCell>{tag.name}</TableCell>
              <TableCell>{tag.type}</TableCell>
              <TableCell>{tag.kind}</TableCell>
              <TableCell>{String(tag.value)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TagSearch;
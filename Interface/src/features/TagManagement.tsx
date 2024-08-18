import React, { useState, useCallback } from "react";
import { useQuery } from "react-query";
import { api, Tag } from "../api/factoryIO";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ResponsiveTable from "../components/ResponsiveTable";
import debounce from "lodash/debounce";

const TagManagement: React.FC = () => {
  const [nameFilter, setNameFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState<"Bit" | "Int" | "Float" | "all">(
    "all"
  );
  const [kindFilter, setKindFilter] = useState<"Input" | "Output" | "all">(
    "all"
  );

  const {
    data: tags,
    isLoading,
    error,
  } = useQuery<Tag[], Error>(["tags", nameFilter, typeFilter, kindFilter], () =>
    api.getTags({
      name: nameFilter,
      type: typeFilter !== "all" ? typeFilter : undefined,
      kind: kindFilter !== "all" ? kindFilter : undefined,
    })
  );

  const debouncedSetNameFilter = useCallback(
    debounce((value: string) => setNameFilter(value), 300),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSetNameFilter(e.target.value);
  };

  const handleTypeChange = (value: "Bit" | "Int" | "Float" | "all") => {
    setTypeFilter(value);
  };

  const handleKindChange = (value: "Input" | "Output" | "all") => {
    setKindFilter(value);
  };

  const handleClearFilters = () => {
    setNameFilter("");
    setTypeFilter("all");
    setKindFilter("all");
  };

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "ID", accessor: "id" },
    { header: "Address", accessor: "address" },
    { header: "Type", accessor: "type" },
    { header: "Kind", accessor: "kind" },
    { header: "Value", accessor: "value" },
  ];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

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
        <Button onClick={handleClearFilters} className="w-full md:w-auto">
          Clear Filters
        </Button>
      </div>
      <ResponsiveTable columns={columns} data={tags || []} />
    </div>
  );
};

export default TagManagement;

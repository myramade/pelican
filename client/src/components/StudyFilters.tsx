import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, LayoutGrid, Table } from "lucide-react";
import { SECTORS } from "@shared/constants";

interface StudyFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedClient: string;
  setSelectedClient: (client: string) => void;
  selectedSector: string;
  setSelectedSector: (sector: string) => void;
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  viewMode: "card" | "table";
  setViewMode: (mode: "card" | "table") => void;
  clients: string[];
}

/**
 * Study Filters Component
 * Provides search and filtering capabilities for the Dashboard
 */
export function StudyFilters({
  searchQuery,
  setSearchQuery,
  selectedClient,
  setSelectedClient,
  selectedSector,
  setSelectedSector,
  selectedStatus,
  setSelectedStatus,
  viewMode,
  setViewMode,
  clients,
}: StudyFiltersProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-sm font-medium">Filters</h3>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "card" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("card")}
            data-testid="button-view-card"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("table")}
            data-testid="button-view-table"
          >
            <Table className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search studies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
            data-testid="input-search"
          />
        </div>

        {/* Client Filter */}
        <Select value={selectedClient} onValueChange={setSelectedClient}>
          <SelectTrigger data-testid="select-client">
            <SelectValue placeholder="All Clients" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Clients</SelectItem>
            {clients.map((client) => (
              <SelectItem key={client} value={client}>
                {client}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sector Filter */}
        <Select value={selectedSector} onValueChange={setSelectedSector}>
          <SelectTrigger data-testid="select-sector">
            <SelectValue placeholder="All Sectors" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sectors</SelectItem>
            {SECTORS.map((sector) => (
              <SelectItem key={sector} value={sector}>
                {sector}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger data-testid="select-status">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="In Progress">In Progress</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { StudyReportCard } from "@/components/StudyReportCard";
import { PortfolioSummary } from "@/components/PortfolioSummary";
import { StudyFilters } from "@/components/StudyFilters";
import { Plus, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Study } from "@shared/schema";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

/**
 * Dashboard - Overview of All Impact Studies
 * Features: Filters, Card/Table toggle, Portfolio Summary (BirdsAI Vue)
 */
export default function Dashboard() {
  const { data: studies = [], isLoading } = useQuery<Study[]>({
    queryKey: ["/api/studies"],
  });

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState("all");
  const [selectedSector, setSelectedSector] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [viewMode, setViewMode] = useState<"card" | "table">("card");

  // Get unique clients for filter dropdown
  const clients = useMemo(() => {
    const uniqueClients = new Set(
      studies
        .filter(s => s.client)
        .map(s => s.client as string)
    );
    return Array.from(uniqueClients).sort();
  }, [studies]);

  // Filter studies based on search and filter criteria
  const filteredStudies = useMemo(() => {
    return studies.filter((study) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        searchQuery === "" ||
        study.programName.toLowerCase().includes(searchLower) ||
        study.impactStudyName.toLowerCase().includes(searchLower) ||
        (study.client && study.client.toLowerCase().includes(searchLower));

      // Client filter
      const matchesClient =
        selectedClient === "all" || study.client === selectedClient;

      // Sector filter
      const matchesSector =
        selectedSector === "all" || study.sector === selectedSector;

      // Status filter
      const matchesStatus =
        selectedStatus === "all" || study.status === selectedStatus;

      return matchesSearch && matchesClient && matchesSector && matchesStatus;
    });
  }, [studies, searchQuery, selectedClient, selectedSector, selectedStatus]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Portfolio-level analytics and impact study management
          </p>
        </div>
        <Button asChild data-testid="button-start-new-study">
          <Link href="/new-study">
            <Plus className="h-4 w-4 mr-2" />
            Start New Impact Study
          </Link>
        </Button>
      </div>

      {/* Portfolio Summary - BirdsAI Vue */}
      {studies.length > 0 && <PortfolioSummary studies={studies} />}

      {/* Filters */}
      {studies.length > 0 && (
        <StudyFilters
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedClient={selectedClient}
          setSelectedClient={setSelectedClient}
          selectedSector={selectedSector}
          setSelectedSector={setSelectedSector}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          viewMode={viewMode}
          setViewMode={setViewMode}
          clients={clients}
        />
      )}

      {/* Studies Display */}
      {studies.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">No studies yet. Start your first impact study!</p>
          <Button asChild>
            <Link href="/new-study">
              <Plus className="h-4 w-4 mr-2" />
              Start New Impact Study
            </Link>
          </Button>
        </div>
      ) : filteredStudies.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No studies match your filters.</p>
        </div>
      ) : viewMode === "card" ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredStudies.map((study) => (
            <StudyReportCard key={study.id} study={study} />
          ))}
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Program Name</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Sector</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Completion</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>IR Score</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudies.map((study) => (
                <TableRow key={study.id} data-testid={`table-row-study-${study.id}`}>
                  <TableCell className="font-medium">{study.programName}</TableCell>
                  <TableCell>{study.client || "-"}</TableCell>
                  <TableCell>{study.sector || "-"}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{study.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={study.completionPercentage || 0} className="h-2 w-20" />
                      <span className="text-xs">{study.completionPercentage || 0}%</span>
                    </div>
                  </TableCell>
                  <TableCell>{study.programStartDate}</TableCell>
                  <TableCell>
                    {study.irMetric !== null && study.irMetric !== undefined ? (
                      <span className="font-semibold text-primary">{study.irMetric}</span>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/study/${study.id}`}>View</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

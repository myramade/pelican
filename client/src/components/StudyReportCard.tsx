import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, Trash2, Calendar, Building2, Target } from "lucide-react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Study } from "@shared/schema";

interface StudyReportCardProps {
  study: Study;
}

/**
 * Enhanced Study Report Card
 * Displays program name, client, status, completion%, dates, IR metric, and snapshot insight
 */
export function StudyReportCard({ study }: StudyReportCardProps) {
  const { toast } = useToast();

  if (!study || !study.id) {
    console.error("StudyReportCard: Invalid study data", study);
    return null;
  }

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/studies/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/studies"] });
      toast({
        title: "Study deleted",
        description: "The impact study has been deleted successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete the study. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this study? This action cannot be undone.")) {
      deleteMutation.mutate(study.id);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-chart-3 text-white";
      case "in progress":
        return "bg-chart-2 text-sidebar-primary-foreground";
      case "draft":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const completionPercent = study.completionPercentage || 0;

  return (
    <Card className="hover-elevate transition-shadow" data-testid={`card-study-${study.id}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="rounded-md bg-primary/10 p-2">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base line-clamp-2" data-testid={`text-study-name-${study.id}`}>
              {study.programName}
            </h3>
            {study.client && (
              <div className="flex items-center gap-1 mt-1">
                <Building2 className="h-3 w-3 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{study.client}</p>
              </div>
            )}
          </div>
        </div>
        <Badge className={`${getStatusColor(study.status)} shrink-0`} data-testid={`badge-status-${study.id}`}>
          {study.status}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Completion Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Completion</span>
            <span className="font-medium" data-testid={`text-completion-${study.id}`}>{completionPercent}%</span>
          </div>
          <Progress value={completionPercent} className="h-2" />
        </div>

        {/* Dates */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{study.programStartDate}</span>
          {study.programEndDate && (
            <>
              <span>→</span>
              <span>{study.programEndDate}</span>
            </>
          )}
        </div>

        {/* IR Metric */}
        {study.irMetric !== null && study.irMetric !== undefined && (
          <div className="flex items-center justify-between p-2 bg-muted/50 rounded-md">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">IR Score</span>
            </div>
            <span className="text-lg font-bold text-primary" data-testid={`text-ir-${study.id}`}>
              {study.irMetric}
            </span>
          </div>
        )}

        {/* Snapshot Insight */}
        {study.insight && (
          <div className="p-2 bg-accent/10 border border-accent/20 rounded-md">
            <p className="text-xs text-accent-foreground line-clamp-2" data-testid={`text-insight-${study.id}`}>
              💡 {study.insight}
            </p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex gap-2">
        <Button asChild className="flex-1" data-testid={`button-view-study-${study.id}`}>
          <Link href={`/study/${study.id}`}>View Study</Link>
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          data-testid={`button-delete-study-${study.id}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}

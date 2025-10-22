import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Trash2 } from "lucide-react";
import { Link } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Study } from "@shared/schema";

interface StudyCardProps {
  study: Study;
}

/**
 * StudyCard Component
 * Displays a summary card for an impact study with delete functionality
 * @param {StudyCardProps} props - Component props containing the study data
 */
export function StudyCard({ study }: StudyCardProps) {
  const { toast } = useToast();

  // Guard clause for invalid study data
  if (!study || !study.id) {
    console.error("StudyCard: Invalid study data", study);
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

  const getStatus = () => {
    return study.surveyQuestions && Array.isArray(study.surveyQuestions) && study.surveyQuestions.length > 0
      ? "Completed"
      : "Draft";
  };

  const status = getStatus();
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return "bg-chart-3 text-white";
      case "draft":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="hover-elevate transition-shadow" data-testid={`card-study-${study.id}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="rounded-md bg-primary/10 p-2">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base line-clamp-2" data-testid={`text-study-name-${study.id}`}>
              {study.impactStudyName}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
              {study.programName}
            </p>
          </div>
        </div>
        <Badge className={`${getStatusColor(status)} shrink-0`} data-testid={`badge-status-${study.id}`}>
          {status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="text-sm">
            <span className="text-muted-foreground">Program Type: </span>
            <span className="font-medium">{study.programType}</span>
          </div>
          {study.programStartDate && (
            <div className="text-sm">
              <span className="text-muted-foreground">Start Date: </span>
              <span className="font-medium">{study.programStartDate}</span>
            </div>
          )}
        </div>
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

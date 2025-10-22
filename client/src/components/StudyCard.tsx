import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText } from "lucide-react";
import { Link } from "wouter";

interface StudyCardProps {
  id: string;
  programName: string;
  progress: number;
  status: string;
}

export function StudyCard({ id, programName, progress, status }: StudyCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "in progress":
        return "bg-chart-2 text-sidebar-primary-foreground";
      case "completed":
        return "bg-chart-3 text-white";
      case "draft":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="hover-elevate transition-shadow" data-testid={`card-study-${id}`}>
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="rounded-md bg-primary/10 p-2">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base line-clamp-2" data-testid={`text-study-name-${id}`}>
              {programName}
            </h3>
          </div>
        </div>
        <Badge className={`${getStatusColor(status)} shrink-0`} data-testid={`badge-status-${id}`}>
          {status}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium" data-testid={`text-progress-${id}`}>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full" data-testid={`button-view-study-${id}`}>
          <Link href={`/study/${id}`}>View Study</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

import { Button } from "@/components/ui/button";
import { StudyCard } from "@/components/StudyCard";
import { Plus, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Study } from "@shared/schema";

export default function Dashboard() {
  const { data: studies = [], isLoading } = useQuery<Study[]>({
    queryKey: ["/api/studies"],
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Impact Studies</h1>
          <p className="text-muted-foreground mt-1">
            Manage and track your program impact studies
          </p>
        </div>
        <Button asChild data-testid="button-start-new-study">
          <Link href="/new-study">
            <Plus className="h-4 w-4 mr-2" />
            Start New Impact Study
          </Link>
        </Button>
      </div>

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
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {studies.map((study) => (
            <StudyCard key={study.id} {...study} />
          ))}
        </div>
      )}
    </div>
  );
}

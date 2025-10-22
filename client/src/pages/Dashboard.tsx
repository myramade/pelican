import { Button } from "@/components/ui/button";
import { StudyCard } from "@/components/StudyCard";
import { Plus } from "lucide-react";
import { Link } from "wouter";
import { useEffect, useState } from "react";

// TODO: remove mock functionality
const MOCK_STUDIES = [
  {
    id: "1",
    impactStudyName: "Q1 2025 Leadership Impact Study",
    programName: "Leadership Training Program",
    userRole: "L&D Manager",
    programType: "Leadership",
    programStartDate: "2025-01-15",
    programReason: "Develop leadership capabilities across mid-level management to improve team performance and retention.",
    stakeholders: ["Trainees", "Trainee's Managers", "L&D Leadership"],
    uploadedFiles: [],
    progress: 50,
    status: "In Progress",
  },
  {
    id: "2",
    impactStudyName: "Sales Enablement Q4 2024",
    programName: "Sales Enablement Workshop",
    userRole: "Sales Training Lead",
    programType: "Sales",
    programStartDate: "2024-10-01",
    programReason: "Improve sales team closing rates and reduce sales cycle length through enhanced negotiation skills.",
    stakeholders: ["Trainees", "Instructors", "Executive Leadership"],
    uploadedFiles: [],
    progress: 85,
    status: "In Progress",
  },
  {
    id: "3",
    impactStudyName: "DEI Initiative 2024",
    programName: "DEI Initiative Study",
    userRole: "Head of DEI",
    programType: "DEI",
    programStartDate: "2024-03-01",
    programReason: "Create a more inclusive workplace culture and improve diverse talent retention.",
    stakeholders: ["Trainees", "Organizational Leadership", "Operations"],
    uploadedFiles: [],
    progress: 100,
    status: "Completed",
  },
];

export default function Dashboard() {
  const [studies, setStudies] = useState<typeof MOCK_STUDIES>([]);

  useEffect(() => {
    // TODO: remove mock functionality - Load from localStorage or API
    const savedStudies = localStorage.getItem("pelican_studies");
    if (savedStudies) {
      setStudies(JSON.parse(savedStudies));
    } else {
      setStudies(MOCK_STUDIES);
      localStorage.setItem("pelican_studies", JSON.stringify(MOCK_STUDIES));
    }
  }, []);

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

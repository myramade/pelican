import { StudyCard } from "@/components/StudyCard";
import { useEffect, useState } from "react";

export default function AllStudies() {
  const [studies, setStudies] = useState<any[]>([]);

  useEffect(() => {
    const savedStudies = localStorage.getItem("pelican_studies");
    if (savedStudies) {
      setStudies(JSON.parse(savedStudies));
    }
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">All Studies</h1>
        <p className="text-muted-foreground mt-1">
          View and manage all your impact studies
        </p>
      </div>

      {studies.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground">No studies found</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {studies.map((study) => (
            <StudyCard
              key={study.id}
              id={study.id}
              programName={study.programName}
              progress={study.progress}
              status={study.status}
            />
          ))}
        </div>
      )}
    </div>
  );
}

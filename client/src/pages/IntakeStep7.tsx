import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StepIndicator } from "@/components/StepIndicator";
import { FileUploadZone } from "@/components/FileUploadZone";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { Link } from "wouter";

const INTAKE_STEPS = [
  { number: 1, label: "Program Basics" },
  { number: 2, label: "Success Definition" },
  { number: 3, label: "Expectations" },
  { number: 4, label: "Measurement" },
  { number: 5, label: "Target Audience" },
  { number: 6, label: "Stakeholders" },
  { number: 7, label: "Documentation" },
  { number: 8, label: "Interviews" },
  { number: 9, label: "Surveys" },
  { number: 10, label: "Summary" },
];

export default function IntakeStep7() {
  const [, setLocation] = useLocation();
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("pelican_intake_step7");
    if (saved) {
      setUploadedFiles(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("pelican_intake_step7", JSON.stringify(uploadedFiles));
    setLocation("/intake/step8");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild data-testid="button-back">
          <Link href="/intake/step6">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">New Impact Study</h1>
          <p className="text-muted-foreground text-sm">Step 7 of 10: Supporting Documentation</p>
        </div>
      </div>

      <StepIndicator currentStep={7} steps={INTAKE_STEPS} />

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Supporting Documentation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground">
              Upload any relevant documents that will help us understand your program better.
            </p>
            <FileUploadZone onFilesChange={setUploadedFiles} />

            <div className="flex justify-between pt-4">
              <Button variant="outline" asChild data-testid="button-back-step">
                <Link href="/intake/step6">Back</Link>
              </Button>
              <Button type="submit" data-testid="button-continue">
                Continue
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StepIndicator } from "@/components/StepIndicator";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { ChevronLeft, Sparkles, CheckCircle2 } from "lucide-react";
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

export default function IntakeStep10() {
  const [, setLocation] = useLocation();
  const [studyData, setStudyData] = useState<any>({});
  const [aiInsights, setAiInsights] = useState<string>("");

  useEffect(() => {
    // Collect all form data
    const step1 = JSON.parse(localStorage.getItem("pelican_intake_step1") || "{}");
    const step2 = JSON.parse(localStorage.getItem("pelican_intake_step2") || "{}");
    const step3 = JSON.parse(localStorage.getItem("pelican_intake_step3") || "{}");
    const step4 = JSON.parse(localStorage.getItem("pelican_intake_step4") || "{}");
    const step5 = JSON.parse(localStorage.getItem("pelican_intake_step5") || "{}");
    const step6 = JSON.parse(localStorage.getItem("pelican_intake_step6") || "{}");
    const step7 = JSON.parse(localStorage.getItem("pelican_intake_step7") || "[]");
    const step8 = JSON.parse(localStorage.getItem("pelican_intake_step8") || "{}");
    const step9 = JSON.parse(localStorage.getItem("pelican_intake_step9") || "[]");

    const data = {
      ...step1,
      ...step2,
      ...step3,
      ...step4,
      ...step5,
      stakeholdersList: step6,
      uploadedFiles: step7,
      ...step8,
      surveyQuestions: step9,
    };

    setStudyData(data);

    // TODO: remove mock functionality - AI insights
    const mockInsights = `Based on your program details, we've identified several key focus areas:

1. **Data Gap**: You'll want to establish baseline metrics before the program starts to measure improvement effectively.

2. **Stakeholder Engagement**: With ${data.interviewees?.length || 0} planned interviews, ensure you're capturing diverse perspectives across all organizational levels.

3. **Success Metrics**: Your organization goals align well with Kirkpatrick Level 4 outcomes. Consider tracking both leading and lagging indicators.

4. **Measurement Strategy**: The combination of surveys, interviews, and ${data.dataCollectionMethods?.length || 0} data collection methods will provide comprehensive insights.`;

    setAiInsights(mockInsights);
  }, []);

  const handleComplete = () => {
    // Create new study
    const newStudy = {
      id: Date.now().toString(),
      programName: studyData.programName || "Untitled Study",
      progress: 10,
      status: "In Progress",
      ...studyData,
      aiInsights,
    };

    // Add to studies list
    const studies = JSON.parse(localStorage.getItem("pelican_studies") || "[]");
    studies.push(newStudy);
    localStorage.setItem("pelican_studies", JSON.stringify(studies));

    // Clear intake data
    for (let i = 1; i <= 10; i++) {
      localStorage.removeItem(`pelican_intake_step${i}`);
    }

    setLocation("/");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild data-testid="button-back">
          <Link href="/intake/step9">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">New Impact Study</h1>
          <p className="text-muted-foreground text-sm">Step 10 of 10: Study Summary</p>
        </div>
      </div>

      <StepIndicator currentStep={10} steps={INTAKE_STEPS} />

      <div className="space-y-6">
        <Card className="border-primary/50">
          <CardHeader>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-primary" />
              <CardTitle>Intake Complete</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Program Name</p>
                <p className="font-medium" data-testid="text-program-name">{studyData.programName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Program Type</p>
                <Badge variant="secondary" data-testid="badge-program-type">{studyData.programType}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Target Audience</p>
                <p className="font-medium">{studyData.targetAudience}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Group Size</p>
                <p className="font-medium" data-testid="text-group-size">{studyData.groupSize} participants</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Interviews Scheduled</p>
                <p className="font-medium">{studyData.interviewees?.length || 0} people</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Survey Questions</p>
                <p className="font-medium">{studyData.surveyQuestions?.length || 0} questions</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-primary" />
              <CardTitle>AI-Generated Insights</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none" data-testid="text-ai-insights">
              {aiInsights.split('\n\n').map((paragraph, i) => (
                <p key={i} className="text-sm mb-3 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" asChild data-testid="button-back-step">
            <Link href="/intake/step9">Back</Link>
          </Button>
          <Button onClick={handleComplete} data-testid="button-complete-intake">
            Complete & Start Study
          </Button>
        </div>
      </div>
    </div>
  );
}

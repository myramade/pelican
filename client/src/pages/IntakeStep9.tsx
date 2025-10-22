import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StepIndicator } from "@/components/StepIndicator";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { ChevronLeft, Sparkles, Edit2 } from "lucide-react";
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

interface SurveyQuestion {
  level: string;
  question: string;
  audienceType: "participant" | "manager";
}

// TODO: remove mock functionality - AI generated questions
const MOCK_SURVEY_QUESTIONS: SurveyQuestion[] = [
  {
    level: "Level 1: Reaction",
    question: "How would you rate your overall satisfaction with this program?",
    audienceType: "participant",
  },
  {
    level: "Level 1: Reaction",
    question: "How relevant was the content to your role?",
    audienceType: "participant",
  },
  {
    level: "Level 2: Learning",
    question: "What new skills or knowledge did you gain from this program?",
    audienceType: "participant",
  },
  {
    level: "Level 3: Behavior",
    question: "Have you applied what you learned in your daily work?",
    audienceType: "participant",
  },
  {
    level: "Level 3: Behavior",
    question: "Have you noticed behavioral changes in your team member since completing the program?",
    audienceType: "manager",
  },
  {
    level: "Level 4: Results",
    question: "Have you observed improved performance metrics in your team since the program?",
    audienceType: "manager",
  },
];

export default function IntakeStep9() {
  const [, setLocation] = useLocation();
  const [surveyQuestions, setSurveyQuestions] = useState<SurveyQuestion[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("pelican_intake_step9");
    if (saved) {
      setSurveyQuestions(JSON.parse(saved));
    } else {
      // TODO: remove mock functionality
      setSurveyQuestions(MOCK_SURVEY_QUESTIONS);
    }
  }, []);

  const updateQuestion = (index: number, question: string) => {
    const updated = [...surveyQuestions];
    updated[index].question = question;
    setSurveyQuestions(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("pelican_intake_step9", JSON.stringify(surveyQuestions));
    setLocation("/intake/step10");
  };

  const participantQuestions = surveyQuestions.filter((q) => q.audienceType === "participant");
  const managerQuestions = surveyQuestions.filter((q) => q.audienceType === "manager");

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild data-testid="button-back">
          <Link href="/intake/step8">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">New Impact Study</h1>
          <p className="text-muted-foreground text-sm">Step 9 of 10: Survey Generation</p>
        </div>
      </div>

      <StepIndicator currentStep={9} steps={INTAKE_STEPS} />

      <div className="rounded-lg bg-primary/10 border border-primary/20 p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <p className="font-medium text-sm">AI-Generated Survey Questions</p>
            <p className="text-sm text-muted-foreground mt-1">
              Based on the Kirkpatrick model, we've generated survey questions tailored to your program. You can edit any question below.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Participant Survey Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {participantQuestions.map((q, index) => {
              const globalIndex = surveyQuestions.indexOf(q);
              return (
                <div key={globalIndex} className="space-y-2" data-testid={`question-participant-${index}`}>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{q.level}</Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingIndex(editingIndex === globalIndex ? null : globalIndex)}
                      data-testid={`button-edit-participant-${index}`}
                    >
                      <Edit2 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                  {editingIndex === globalIndex ? (
                    <Textarea
                      value={q.question}
                      onChange={(e) => updateQuestion(globalIndex, e.target.value)}
                      rows={2}
                      data-testid={`textarea-participant-${index}`}
                    />
                  ) : (
                    <p className="text-sm">{q.question}</p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Manager Survey Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {managerQuestions.map((q, index) => {
              const globalIndex = surveyQuestions.indexOf(q);
              return (
                <div key={globalIndex} className="space-y-2" data-testid={`question-manager-${index}`}>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{q.level}</Badge>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingIndex(editingIndex === globalIndex ? null : globalIndex)}
                      data-testid={`button-edit-manager-${index}`}
                    >
                      <Edit2 className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                  {editingIndex === globalIndex ? (
                    <Textarea
                      value={q.question}
                      onChange={(e) => updateQuestion(globalIndex, e.target.value)}
                      rows={2}
                      data-testid={`textarea-manager-${index}`}
                    />
                  ) : (
                    <p className="text-sm">{q.question}</p>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" asChild data-testid="button-back-step">
            <Link href="/intake/step8">Back</Link>
          </Button>
          <Button type="submit" data-testid="button-continue">
            Continue
          </Button>
        </div>
      </form>
    </div>
  );
}

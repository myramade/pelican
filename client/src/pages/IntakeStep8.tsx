import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StepIndicator } from "@/components/StepIndicator";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { ChevronLeft, Plus, X, Sparkles } from "lucide-react";
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

interface Interviewee {
  name: string;
  email: string;
  role: string;
}

export default function IntakeStep8() {
  const [, setLocation] = useLocation();
  const [recommendedSize, setRecommendedSize] = useState<number | null>(null);
  const [interviewees, setInterviewees] = useState<Interviewee[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("pelican_intake_step8");
    if (saved) {
      const data = JSON.parse(saved);
      setInterviewees(data.interviewees || []);
      setRecommendedSize(data.recommendedSize || null);
    }

    // TODO: remove mock functionality - AI recommendation
    const step5Data = localStorage.getItem("pelican_intake_step5");
    if (step5Data) {
      const { groupSize } = JSON.parse(step5Data);
      const size = parseInt(groupSize);
      if (size) {
        const recommended = Math.min(Math.max(Math.ceil(size * 0.15), 5), 30);
        setRecommendedSize(recommended);
      }
    }
  }, []);

  const addInterviewee = () => {
    setInterviewees([...interviewees, { name: "", email: "", role: "" }]);
  };

  const updateInterviewee = (index: number, field: keyof Interviewee, value: string) => {
    const updated = [...interviewees];
    updated[index][field] = value;
    setInterviewees(updated);
  };

  const removeInterviewee = (index: number) => {
    setInterviewees(interviewees.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("pelican_intake_step8", JSON.stringify({ interviewees, recommendedSize }));
    setLocation("/intake/step9");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild data-testid="button-back">
          <Link href="/intake/step7">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">New Impact Study</h1>
          <p className="text-muted-foreground text-sm">Step 8 of 10: Interview Selection</p>
        </div>
      </div>

      <StepIndicator currentStep={8} steps={INTAKE_STEPS} />

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Interview Selection</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {recommendedSize && (
              <div className="rounded-lg bg-primary/10 border border-primary/20 p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">AI Recommendation</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Based on your group size, we recommend interviewing{" "}
                      <Badge variant="secondary" className="mx-1" data-testid="text-recommended-size">
                        {recommendedSize} participants
                      </Badge>
                      to achieve statistically significant insights.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Interviewees</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addInterviewee}
                  data-testid="button-add-interviewee"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Interviewee
                </Button>
              </div>

              {interviewees.map((interviewee, index) => (
                <Card key={index} className="p-4" data-testid={`card-interviewee-${index}`}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Interviewee {index + 1}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeInterviewee(index)}
                        data-testid={`button-remove-interviewee-${index}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor={`name-${index}`} className="text-xs">
                          Name
                        </Label>
                        <Input
                          id={`name-${index}`}
                          value={interviewee.name}
                          onChange={(e) => updateInterviewee(index, "name", e.target.value)}
                          placeholder="Full name"
                          required
                          data-testid={`input-interviewee-name-${index}`}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`email-${index}`} className="text-xs">
                          Email
                        </Label>
                        <Input
                          id={`email-${index}`}
                          type="email"
                          value={interviewee.email}
                          onChange={(e) => updateInterviewee(index, "email", e.target.value)}
                          placeholder="email@example.com"
                          required
                          data-testid={`input-interviewee-email-${index}`}
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor={`role-${index}`} className="text-xs">
                          Role
                        </Label>
                        <Input
                          id={`role-${index}`}
                          value={interviewee.role}
                          onChange={(e) => updateInterviewee(index, "role", e.target.value)}
                          placeholder="Job title"
                          required
                          data-testid={`input-interviewee-role-${index}`}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {interviewees.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No interviewees added yet. Click "Add Interviewee" to get started.
                </div>
              )}
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" asChild data-testid="button-back-step">
                <Link href="/intake/step7">Back</Link>
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

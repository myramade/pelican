import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StepIndicator } from "@/components/StepIndicator";
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

export default function IntakeStep2() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    orgGoals: "",
    participantGoals: "",
    goodLookLike: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("pelican_intake_step2");
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("pelican_intake_step2", JSON.stringify(formData));
    setLocation("/intake/step3");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild data-testid="button-back">
          <Link href="/intake/step1">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">New Impact Study</h1>
          <p className="text-muted-foreground text-sm">Step 2 of 10: Success Definition</p>
        </div>
      </div>

      <StepIndicator currentStep={2} steps={INTAKE_STEPS} />

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Success Definition</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="orgGoals">Goals for Organization</Label>
              <Textarea
                id="orgGoals"
                value={formData.orgGoals}
                onChange={(e) => setFormData({ ...formData, orgGoals: e.target.value })}
                placeholder="Describe desired impact, ROI, improvements (e.g., increased productivity, better retention, cost savings)"
                rows={4}
                required
                data-testid="textarea-org-goals"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="participantGoals">Goals for Participants</Label>
              <Textarea
                id="participantGoals"
                value={formData.participantGoals}
                onChange={(e) => setFormData({ ...formData, participantGoals: e.target.value })}
                placeholder="Describe desired skills, knowledge, or behavior changes for participants"
                rows={4}
                required
                data-testid="textarea-participant-goals"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goodLookLike">What would good look like?</Label>
              <Textarea
                id="goodLookLike"
                value={formData.goodLookLike}
                onChange={(e) => setFormData({ ...formData, goodLookLike: e.target.value })}
                placeholder="Paint a picture of success - what observable changes would indicate the program is working?"
                rows={4}
                required
                data-testid="textarea-good-look-like"
              />
            </div>

            <div className="flex justify-between">
              <Button variant="outline" asChild data-testid="button-back-step">
                <Link href="/intake/step1">Back</Link>
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

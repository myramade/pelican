import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

export default function IntakeStep5() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    targetAudience: "",
    groupSize: "",
    audienceNeeds: "",
    audienceSuccess: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("pelican_intake_step5");
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("pelican_intake_step5", JSON.stringify(formData));
    setLocation("/intake/step6");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild data-testid="button-back">
          <Link href="/intake/step4">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">New Impact Study</h1>
          <p className="text-muted-foreground text-sm">Step 5 of 10: Target Audience</p>
        </div>
      </div>

      <StepIndicator currentStep={5} steps={INTAKE_STEPS} />

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Target Audience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="targetAudience">Audience Description</Label>
              <Input
                id="targetAudience"
                value={formData.targetAudience}
                onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                placeholder="e.g., Mid-level managers in Sales department"
                required
                data-testid="input-target-audience"
              />
              <p className="text-xs text-muted-foreground">Describe the role, level, and department</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="groupSize">Group Size</Label>
              <Input
                id="groupSize"
                type="number"
                min="1"
                value={formData.groupSize}
                onChange={(e) => setFormData({ ...formData, groupSize: e.target.value })}
                placeholder="e.g., 50"
                required
                data-testid="input-group-size"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audienceNeeds">Needs, Challenges, Motivators & Barriers</Label>
              <Textarea
                id="audienceNeeds"
                value={formData.audienceNeeds}
                onChange={(e) => setFormData({ ...formData, audienceNeeds: e.target.value })}
                placeholder="What are the needs, challenges, motivators, and barriers for this audience?"
                rows={4}
                required
                data-testid="textarea-audience-needs"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="audienceSuccess">Success Definition for Audience</Label>
              <Textarea
                id="audienceSuccess"
                value={formData.audienceSuccess}
                onChange={(e) => setFormData({ ...formData, audienceSuccess: e.target.value })}
                placeholder="What does success look like from the participant's perspective?"
                rows={4}
                required
                data-testid="textarea-audience-success"
              />
            </div>

            <div className="flex justify-between">
              <Button variant="outline" asChild data-testid="button-back-step">
                <Link href="/intake/step4">Back</Link>
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

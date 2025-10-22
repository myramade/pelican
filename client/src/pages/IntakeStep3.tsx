import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
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

export default function IntakeStep3() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    leaderExpectations: "",
    programDuration: "",
    fundingJustification: 5,
  });

  useEffect(() => {
    const saved = localStorage.getItem("pelican_intake_step3");
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("pelican_intake_step3", JSON.stringify(formData));
    setLocation("/intake/step4");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild data-testid="button-back">
          <Link href="/intake/step2">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">New Impact Study</h1>
          <p className="text-muted-foreground text-sm">Step 3 of 10: Expectations & Program Lifespan</p>
        </div>
      </div>

      <StepIndicator currentStep={3} steps={INTAKE_STEPS} />

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Expectations & Program Lifespan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="leaderExpectations">What were the expectations of leaders for the program?</Label>
              <Textarea
                id="leaderExpectations"
                value={formData.leaderExpectations}
                onChange={(e) => setFormData({ ...formData, leaderExpectations: e.target.value })}
                placeholder="Describe what organizational leaders expected from this program"
                rows={4}
                required
                data-testid="textarea-leader-expectations"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="programDuration">Program Duration</Label>
              <Select
                value={formData.programDuration}
                onValueChange={(value) => setFormData({ ...formData, programDuration: value })}
                required
              >
                <SelectTrigger id="programDuration" data-testid="select-program-duration">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short-term">Short-term (less than 6 months)</SelectItem>
                  <SelectItem value="ongoing">Ongoing (6+ months)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label>Need for funding justification (1-10 scale)</Label>
              <div className="space-y-3">
                <Slider
                  value={[formData.fundingJustification]}
                  onValueChange={(value) => setFormData({ ...formData, fundingJustification: value[0] })}
                  min={1}
                  max={10}
                  step={1}
                  data-testid="slider-funding-justification"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Low Need (1)</span>
                  <span className="font-medium text-foreground">{formData.fundingJustification}</span>
                  <span>High Need (10)</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" asChild data-testid="button-back-step">
                <Link href="/intake/step2">Back</Link>
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

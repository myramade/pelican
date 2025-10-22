import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StepIndicator } from "@/components/StepIndicator";
import { useLocation } from "wouter";
import { useState, useEffect } from "react";
import { ChevronLeft, Plus, X } from "lucide-react";
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

const STAKEHOLDER_CATEGORIES = [
  "Designers",
  "Peers of the target audience",
  "Supervisors",
  "Direct Reports",
  "Executives",
  "Other",
];

export default function IntakeStep6() {
  const [, setLocation] = useLocation();
  const [stakeholders, setStakeholders] = useState<Record<string, string[]>>({
    Designers: [],
    "Peers of the target audience": [],
    Supervisors: [],
    "Direct Reports": [],
    Executives: [],
    Other: [],
  });

  useEffect(() => {
    const saved = localStorage.getItem("pelican_intake_step6");
    if (saved) {
      setStakeholders(JSON.parse(saved));
    }
  }, []);

  const addStakeholder = (category: string) => {
    setStakeholders({
      ...stakeholders,
      [category]: [...stakeholders[category], ""],
    });
  };

  const updateStakeholder = (category: string, index: number, value: string) => {
    const updated = { ...stakeholders };
    updated[category][index] = value;
    setStakeholders(updated);
  };

  const removeStakeholder = (category: string, index: number) => {
    const updated = { ...stakeholders };
    updated[category] = updated[category].filter((_, i) => i !== index);
    setStakeholders(updated);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("pelican_intake_step6", JSON.stringify(stakeholders));
    setLocation("/intake/step7");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild data-testid="button-back">
          <Link href="/intake/step5">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">New Impact Study</h1>
          <p className="text-muted-foreground text-sm">Step 6 of 10: Stakeholders</p>
        </div>
      </div>

      <StepIndicator currentStep={6} steps={INTAKE_STEPS} />

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Stakeholder List</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {STAKEHOLDER_CATEGORIES.map((category) => (
              <div key={category} className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>{category}</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addStakeholder(category)}
                    data-testid={`button-add-${category.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                </div>
                {stakeholders[category].map((name, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={name}
                      onChange={(e) => updateStakeholder(category, index, e.target.value)}
                      placeholder={`${category} name`}
                      data-testid={`input-stakeholder-${category.toLowerCase().replace(/\s+/g, '-')}-${index}`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeStakeholder(category, index)}
                      data-testid={`button-remove-${category.toLowerCase().replace(/\s+/g, '-')}-${index}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ))}

            <div className="flex justify-between pt-4">
              <Button variant="outline" asChild data-testid="button-back-step">
                <Link href="/intake/step5">Back</Link>
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

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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

const DATA_COLLECTION_METHODS = [
  "Surveys",
  "Assessments",
  "Observations",
  "Focus Groups",
  "KPIs",
  "HR Data",
  "Manager Feedback",
  "System Data",
  "Other",
];

export default function IntakeStep4() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    dataCollectionMethods: [] as string[],
    currentMetrics: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("pelican_intake_step4");
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  const toggleMethod = (method: string) => {
    setFormData({
      ...formData,
      dataCollectionMethods: formData.dataCollectionMethods.includes(method)
        ? formData.dataCollectionMethods.filter((m) => m !== method)
        : [...formData.dataCollectionMethods, method],
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.dataCollectionMethods.length === 0) {
      alert("Please select at least one data collection method");
      return;
    }
    localStorage.setItem("pelican_intake_step4", JSON.stringify(formData));
    setLocation("/intake/step5");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild data-testid="button-back">
          <Link href="/intake/step3">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">New Impact Study</h1>
          <p className="text-muted-foreground text-sm">Step 4 of 10: Current Measurement Practices</p>
        </div>
      </div>

      <StepIndicator currentStep={4} steps={INTAKE_STEPS} />

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Current Measurement Practices</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>Data Collection Methods</Label>
              <div className="grid grid-cols-2 gap-4">
                {DATA_COLLECTION_METHODS.map((method) => (
                  <div key={method} className="flex items-center space-x-2">
                    <Checkbox
                      id={method}
                      checked={formData.dataCollectionMethods.includes(method)}
                      onCheckedChange={() => toggleMethod(method)}
                      data-testid={`checkbox-${method.toLowerCase().replace(' ', '-')}`}
                    />
                    <label
                      htmlFor={method}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {method}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentMetrics">Current Metrics Tracked</Label>
              <Textarea
                id="currentMetrics"
                value={formData.currentMetrics}
                onChange={(e) => setFormData({ ...formData, currentMetrics: e.target.value })}
                placeholder="List any metrics currently being tracked for this program"
                rows={4}
                required
                data-testid="textarea-current-metrics"
              />
            </div>

            <div className="flex justify-between">
              <Button variant="outline" asChild data-testid="button-back-step">
                <Link href="/intake/step3">Back</Link>
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

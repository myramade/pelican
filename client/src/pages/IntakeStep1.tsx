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

const PROGRAM_TYPES = [
  "Leadership",
  "Compliance",
  "Sales",
  "Onboarding",
  "Technical",
  "DEI",
  "Safety",
  "Coaching",
  "Professional Skills",
  "Other",
];

export default function IntakeStep1() {
  const [, setLocation] = useLocation();
  const [formData, setFormData] = useState({
    programName: "",
    userRole: "",
    programType: "",
    programStartDate: "",
    programReason: "",
    stakeholders: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("pelican_intake_step1");
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("pelican_intake_step1", JSON.stringify(formData));
    setLocation("/intake/step2");
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild data-testid="button-back">
          <Link href="/">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">New Impact Study</h1>
          <p className="text-muted-foreground text-sm">Step 1 of 10: Program Basics</p>
        </div>
      </div>

      <StepIndicator currentStep={1} steps={INTAKE_STEPS} />

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Program Basics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="programName">Program Name</Label>
              <Input
                id="programName"
                value={formData.programName}
                onChange={(e) => setFormData({ ...formData, programName: e.target.value })}
                placeholder="e.g., Leadership Development Initiative"
                required
                data-testid="input-program-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="userRole">Your Role with the Program</Label>
              <Input
                id="userRole"
                value={formData.userRole}
                onChange={(e) => setFormData({ ...formData, userRole: e.target.value })}
                placeholder="e.g., Program Manager, L&D Lead"
                required
                data-testid="input-user-role"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="programType">Program Type</Label>
              <Select
                value={formData.programType}
                onValueChange={(value) => setFormData({ ...formData, programType: value })}
                required
              >
                <SelectTrigger id="programType" data-testid="select-program-type">
                  <SelectValue placeholder="Select program type" />
                </SelectTrigger>
                <SelectContent>
                  {PROGRAM_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="programStartDate">Program Start Date</Label>
              <Input
                id="programStartDate"
                type="date"
                value={formData.programStartDate}
                onChange={(e) => setFormData({ ...formData, programStartDate: e.target.value })}
                required
                data-testid="input-program-start-date"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="programReason">Why was the Program Created?</Label>
              <Textarea
                id="programReason"
                value={formData.programReason}
                onChange={(e) => setFormData({ ...formData, programReason: e.target.value })}
                placeholder="Describe the business need, problem, or opportunity this program addresses"
                rows={4}
                required
                data-testid="textarea-program-reason"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="stakeholders">Program Stakeholders</Label>
              <Textarea
                id="stakeholders"
                value={formData.stakeholders}
                onChange={(e) => setFormData({ ...formData, stakeholders: e.target.value })}
                placeholder="List stakeholders (e.g., trainees, instructors, managers, L&D leadership, executives)"
                rows={4}
                required
                data-testid="textarea-stakeholders"
              />
            </div>

            <div className="flex justify-end">
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

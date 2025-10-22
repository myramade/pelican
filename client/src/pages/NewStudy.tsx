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
import { FileUploadZone } from "@/components/FileUploadZone";
import { useLocation } from "wouter";
import { useState } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Link } from "wouter";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

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

const STAKEHOLDER_OPTIONS = [
  "Trainees",
  "Instructors",
  "Trainee's Managers",
  "L&D Leadership",
  "Organizational Leadership",
  "Operations",
  "Marketing",
  "Executive Leadership",
];

export default function NewStudy() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isGenerating, setIsGenerating] = useState(false);
  const [formData, setFormData] = useState({
    impactStudyName: "",
    programName: "",
    userRole: "",
    programType: "",
    programStartDate: "",
    programReason: "",
    stakeholders: [] as string[],
  });
  const [uploadedFiles, setUploadedFiles] = useState<any[]>([]);

  const toggleStakeholder = (stakeholder: string) => {
    setFormData({
      ...formData,
      stakeholders: formData.stakeholders.includes(stakeholder)
        ? formData.stakeholders.filter((s) => s !== stakeholder)
        : [...formData.stakeholders, stakeholder],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.stakeholders.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select at least one stakeholder",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      // Step 1: Create the study in the database
      const studyData = {
        impactStudyName: formData.impactStudyName,
        programName: formData.programName,
        userRole: formData.userRole,
        programType: formData.programType,
        programStartDate: formData.programStartDate,
        programReason: formData.programReason,
        stakeholders: formData.stakeholders,
        uploadedFiles: uploadedFiles,
      };

      const createResponse = await apiRequest("POST", "/api/studies", studyData);
      const createdStudy = await createResponse.json();

      // Step 2: Generate AI survey recommendations
      const surveyResponse = await fetch("/api/generate-survey", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          programName: formData.programName,
          programType: formData.programType,
          programReason: formData.programReason,
          stakeholders: formData.stakeholders,
          uploadedFiles,
        }),
      });

      if (!surveyResponse.ok) {
        const errorData = await surveyResponse.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to generate survey");
      }

      const surveyData = await surveyResponse.json();

      // Step 3: Update the study with AI-generated data
      await apiRequest("PUT", `/api/studies/${createdStudy.id}`, {
        surveyQuestions: surveyData.questions || [],
        sampleSize: surveyData.sampleSize || null,
      });

      // Invalidate and refetch studies
      queryClient.invalidateQueries({ queryKey: ["/api/studies"] });

      toast({
        title: "Impact Study Created",
        description: "AI-generated survey recommendations are ready to review",
      });

      setLocation(`/study/${createdStudy.id}`);
    } catch (error) {
      console.error("Error creating study:", error);
      toast({
        title: "Error Creating Study",
        description: error instanceof Error ? error.message : "Failed to create impact study. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
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
          <h1 className="text-2xl font-semibold">Start New Impact Study</h1>
          <p className="text-muted-foreground text-sm">Complete the form below to create your impact study</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Impact Study Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="impactStudyName">Impact Study Name</Label>
              <Input
                id="impactStudyName"
                value={formData.impactStudyName}
                onChange={(e) => setFormData({ ...formData, impactStudyName: e.target.value })}
                placeholder="e.g., Q1 2025 Leadership Impact Study"
                required
                data-testid="input-impact-study-name"
              />
            </div>

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

            <div className="space-y-3">
              <Label>Stakeholders Impacted by the Training or Solution</Label>
              <div className="grid grid-cols-2 gap-3">
                {STAKEHOLDER_OPTIONS.map((stakeholder) => (
                  <div key={stakeholder} className="flex items-center space-x-2">
                    <Checkbox
                      id={stakeholder}
                      checked={formData.stakeholders.includes(stakeholder)}
                      onCheckedChange={() => toggleStakeholder(stakeholder)}
                      data-testid={`checkbox-${stakeholder.toLowerCase().replace(/['\s]/g, '-')}`}
                    />
                    <label
                      htmlFor={stakeholder}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {stakeholder}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Supporting Documents</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Upload learning data, survey results, smile sheets, performance reports, or other relevant documents
              </p>
              <FileUploadZone onFilesChange={setUploadedFiles} />
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isGenerating} data-testid="button-submit">
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating AI Survey...
                  </>
                ) : (
                  "Create Impact Study"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}

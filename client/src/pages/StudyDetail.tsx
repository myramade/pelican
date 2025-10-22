import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Lightbulb, AlertCircle, TrendingUp, CheckCircle2, Loader2 } from "lucide-react";
import { Link, useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import type { Study } from "@shared/schema";
import { SurveyInvitationManager } from "@/components/SurveyInvitationManager";

export default function StudyDetail() {
  const { id } = useParams();
  
  const { data: study, isLoading } = useQuery<Study>({
    queryKey: ["/api/studies", id],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!study) {
    return (
      <div className="text-center py-16">
        <p className="text-muted-foreground">Study not found</p>
        <Button asChild className="mt-4">
          <Link href="/">Back to Dashboard</Link>
        </Button>
      </div>
    );
  }

  // TODO: remove mock functionality
  const recommendations = [
    {
      type: "Quick Win",
      icon: TrendingUp,
      title: "Baseline Measurement",
      description: "Establish baseline metrics now to measure program impact effectively.",
      color: "text-chart-3",
    },
    {
      type: "Needs Attention",
      icon: AlertCircle,
      title: "Data Collection Timeline",
      description: "Schedule follow-up surveys 30-60 days post-program for behavior change assessment.",
      color: "text-chart-5",
    },
    {
      type: "Long Bet",
      icon: Lightbulb,
      title: "ROI Tracking",
      description: "Set up systems to track long-term business metrics aligned with program goals.",
      color: "text-chart-2",
    },
  ];

  const gapAnalysis = [
    { metric: "Pre-program baseline", status: "Missing", priority: "High" },
    { metric: "Post-program assessment", status: "Planned", priority: "Medium" },
    { metric: "Manager feedback process", status: "In Progress", priority: "High" },
    { metric: "Business impact metrics", status: "Defined", priority: "Medium" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild data-testid="button-back">
          <Link href="/">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-semibold" data-testid="text-study-name">{study.programName}</h1>
          <p className="text-muted-foreground">{study.programType}</p>
        </div>
        <Badge className="bg-chart-2 text-sidebar-primary-foreground">{study.status}</Badge>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Study Progress</span>
              <span className="text-2xl font-semibold" data-testid="text-progress">{study.progress}%</span>
            </div>
            <Progress value={study.progress} className="h-3" />
            <p className="text-xs text-muted-foreground">
              Your impact study is underway. We'll notify you as new insights and data become available.
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList data-testid="tabs-study-detail">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="survey">Survey</TabsTrigger>
          <TabsTrigger value="data">Data</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recommendations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendations.map((rec, index) => (
                <Card key={index} className="border-l-4" style={{ borderLeftColor: `hsl(var(--chart-${index + 1}))` }}>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <rec.icon className={`h-5 w-5 ${rec.color} mt-0.5`} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">{rec.title}</p>
                          <Badge variant="secondary" className="text-xs">{rec.type}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{rec.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gap Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {gapAnalysis.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-md bg-muted/30"
                  >
                    <span className="text-sm font-medium">{item.metric}</span>
                    <div className="flex items-center gap-3">
                      <Badge
                        variant={
                          item.status === "Missing"
                            ? "destructive"
                            : item.status === "In Progress"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {item.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {item.priority}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="survey" className="space-y-6">
          {study.surveyQuestions && Array.isArray(study.surveyQuestions) && study.surveyQuestions.length > 0 ? (
            <SurveyInvitationManager studyId={study.id} />
          ) : (
            <Card>
              <CardContent className="pt-6 text-center py-16">
                <p className="text-muted-foreground mb-4">
                  Survey questions have not been generated yet.
                </p>
                <p className="text-sm text-muted-foreground">
                  The AI survey generation must be completed before you can invite stakeholders.
                </p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Program Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Impact Study Name</p>
                <p className="text-sm text-muted-foreground">{study.impactStudyName || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Your Role</p>
                <p className="text-sm text-muted-foreground">{study.userRole || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Program Start Date</p>
                <p className="text-sm text-muted-foreground">{study.programStartDate || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Why was the Program Created?</p>
                <p className="text-sm text-muted-foreground">{study.programReason || "Not specified"}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Stakeholders</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {study.stakeholders?.map((stakeholder: string, i: number) => (
                    <Badge key={i} variant="secondary">{stakeholder}</Badge>
                  )) || <span className="text-sm text-muted-foreground">None specified</span>}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Uploaded Documents</p>
                <p className="text-sm text-muted-foreground">{Array.isArray(study.uploadedFiles) ? study.uploadedFiles.length : 0} files uploaded</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {study.surveyQuestions && Array.isArray(study.surveyQuestions) && study.surveyQuestions.length > 0 ? (
            <>
              {study.sampleSize && typeof study.sampleSize === 'object' && 'recommended' in study.sampleSize && (
                <Card className="border-primary/50">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-primary" />
                      <CardTitle>Sample Size Recommendation</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-primary">
                          {(study.sampleSize as any).recommended}
                        </span>
                        <span className="text-muted-foreground">participants recommended</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {(study.sampleSize as any).explanation}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>AI-Generated Survey Questions</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Based on the Kirkpatrick Four-Level Training Evaluation Model
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {["Level 1: Reaction", "Level 2: Learning", "Level 3: Behavior", "Level 4: Results"].map((level) => {
                    const questionsForLevel = (study.surveyQuestions as any[]).filter(
                      (q: any) => q.level === level
                    );
                    
                    if (questionsForLevel.length === 0) return null;

                    return (
                      <div key={level} className="space-y-3">
                        <h3 className="font-semibold text-base">{level}</h3>
                        <div className="space-y-3">
                          {questionsForLevel.map((q: any, idx: number) => (
                            <Card key={idx} className="bg-muted/30">
                              <CardContent className="p-4">
                                <div className="space-y-2">
                                  <div className="flex items-start justify-between gap-3">
                                    <p className="text-sm flex-1">{q.question}</p>
                                    <div className="flex gap-2 shrink-0">
                                      <Badge variant="outline" className="text-xs">
                                        {q.audience}
                                      </Badge>
                                      <Badge variant="secondary" className="text-xs">
                                        {q.type}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="py-12">
                <div className="text-center space-y-3">
                  <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <Lightbulb className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">AI Survey Generation Pending</h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Survey questions and recommendations will appear here once generated. If you just created this study, the AI may still be processing your request.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Lightbulb, AlertCircle, TrendingUp } from "lucide-react";
import { Link, useParams } from "wouter";
import { useEffect, useState } from "react";

export default function StudyDetail() {
  const { id } = useParams();
  const [study, setStudy] = useState<any>(null);

  useEffect(() => {
    const studies = JSON.parse(localStorage.getItem("pelican_studies") || "[]");
    const found = studies.find((s: any) => s.id === id);
    setStudy(found);
  }, [id]);

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
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-2xl font-semibold" data-testid="text-progress">{study.progress}%</span>
            </div>
            <Progress value={study.progress} className="h-3" />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList data-testid="tabs-study-detail">
          <TabsTrigger value="overview">Overview</TabsTrigger>
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

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Program Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-1">Organizational Goals</p>
                <p className="text-sm text-muted-foreground">{study.orgGoals}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Participant Goals</p>
                <p className="text-sm text-muted-foreground">{study.participantGoals}</p>
              </div>
              <div>
                <p className="text-sm font-medium mb-1">Success Definition</p>
                <p className="text-sm text-muted-foreground">{study.goodLookLike}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                {study.aiInsights?.split('\n\n').map((paragraph: string, i: number) => (
                  <p key={i} className="text-sm mb-3 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, CheckCircle2 } from "lucide-react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface SurveyQuestion {
  level: string;
  question: string;
  audience: string;
  type: string;
}

interface SurveyData {
  id: string;
  programName: string;
  surveyQuestions: SurveyQuestion[];
}

/**
 * Public Survey Page
 * Allows external stakeholders to complete surveys via shareable link
 */
export default function PublicSurvey() {
  const { token } = useParams();
  const [responses, setResponses] = useState<Record<number, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const { data: survey, isLoading } = useQuery<SurveyData>({
    queryKey: ["/api/survey", token],
    enabled: !!token,
  });

  const submitMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/survey/${token}/submit`, {
        responseData: responses,
      });
    },
    onSuccess: () => {
      setSubmitted(true);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if all questions are answered
    const totalQuestions = survey?.surveyQuestions?.length || 0;
    const answeredQuestions = Object.keys(responses).length;
    
    if (answeredQuestions < totalQuestions) {
      alert("Please answer all questions before submitting.");
      return;
    }

    submitMutation.mutate();
  };

  const handleResponseChange = (questionIndex: number, value: string) => {
    setResponses(prev => ({
      ...prev,
      [questionIndex]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center py-16">
            <p className="text-muted-foreground">Survey not found or link is invalid.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="pt-6 text-center py-16">
            <CheckCircle2 className="h-16 w-16 text-chart-3 mx-auto mb-4" />
            <h1 className="text-2xl font-semibold mb-2">Thank You!</h1>
            <p className="text-muted-foreground">
              Your survey response has been submitted successfully.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 py-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Impact Survey</CardTitle>
            <p className="text-muted-foreground">{survey.programName}</p>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Your feedback is valuable in assessing the impact of this training program. 
              Please answer all questions honestly and to the best of your ability.
            </p>
          </CardContent>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {survey.surveyQuestions?.map((question, index) => (
            <Card key={index} data-testid={`question-card-${index}`}>
              <CardHeader>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                      {question.level}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {question.audience}
                    </span>
                  </div>
                  <Label className="text-base font-medium leading-relaxed">
                    {index + 1}. {question.question}
                  </Label>
                </div>
              </CardHeader>
              <CardContent>
                {question.type === "Rating Scale" ? (
                  <RadioGroup
                    value={responses[index] || ""}
                    onValueChange={(value) => handleResponseChange(index, value)}
                    className="space-y-2"
                  >
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <div key={rating} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={rating.toString()}
                          id={`q${index}-${rating}`}
                          data-testid={`radio-q${index}-${rating}`}
                        />
                        <Label
                          htmlFor={`q${index}-${rating}`}
                          className="cursor-pointer font-normal"
                        >
                          {rating} - {
                            rating === 1 ? "Strongly Disagree" :
                            rating === 2 ? "Disagree" :
                            rating === 3 ? "Neutral" :
                            rating === 4 ? "Agree" :
                            "Strongly Agree"
                          }
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : question.type === "Multiple Choice" ? (
                  <RadioGroup
                    value={responses[index] || ""}
                    onValueChange={(value) => handleResponseChange(index, value)}
                    className="space-y-2"
                  >
                    {["Option A", "Option B", "Option C", "Option D"].map((option) => (
                      <div key={option} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={option}
                          id={`q${index}-${option}`}
                          data-testid={`radio-q${index}-${option}`}
                        />
                        <Label
                          htmlFor={`q${index}-${option}`}
                          className="cursor-pointer font-normal"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                ) : (
                  <Textarea
                    value={responses[index] || ""}
                    onChange={(e) => handleResponseChange(index, e.target.value)}
                    placeholder="Please provide your response..."
                    rows={4}
                    data-testid={`textarea-q${index}`}
                  />
                )}
              </CardContent>
            </Card>
          ))}

          <Card>
            <CardContent className="pt-6 flex justify-end">
              <Button
                type="submit"
                disabled={submitMutation.isPending}
                size="lg"
                data-testid="button-submit-survey"
              >
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Survey"
                )}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}

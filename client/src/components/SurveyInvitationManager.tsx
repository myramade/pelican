import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Share2, Copy, Mail, Check, Loader2, Users, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { SurveyInvitation } from "@shared/schema";

interface SurveyInvitationManagerProps {
  studyId: string;
}

/**
 * Survey Invitation Manager Component
 * Allows users to add stakeholders, generate shareable links, and track responses
 */
export function SurveyInvitationManager({ studyId }: SurveyInvitationManagerProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [stakeholderName, setStakeholderName] = useState("");
  const [stakeholderEmail, setStakeholderEmail] = useState("");
  const [shareToken, setShareToken] = useState("");
  const [copied, setCopied] = useState(false);

  // Fetch survey invitations
  const { data: invitations = [] } = useQuery<SurveyInvitation[]>({
    queryKey: ["/api/studies", studyId, "invitations"],
  });

  // Fetch response count
  const { data: responseData } = useQuery<{ count: number }>({
    queryKey: ["/api/studies", studyId, "responses"],
  });

  const responseCount = responseData?.count || 0;

  // Generate share token mutation
  const generateTokenMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/studies/${studyId}/share`);
      return response.json();
    },
    onSuccess: (data) => {
      setShareToken(data.shareToken);
      toast({
        title: "Share Link Generated",
        description: "You can now share this survey link with stakeholders.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to generate share link. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Create invitation mutation
  const createInvitationMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", `/api/studies/${studyId}/invitations`, {
        stakeholderName,
        stakeholderEmail,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/studies", studyId, "invitations"] });
      setStakeholderName("");
      setStakeholderEmail("");
      toast({
        title: "Stakeholder Added",
        description: `${stakeholderName} has been added to the invitation list.`,
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add stakeholder. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleGenerateLink = () => {
    generateTokenMutation.mutate();
  };

  const handleAddStakeholder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stakeholderName || !stakeholderEmail) {
      toast({
        title: "Missing Information",
        description: "Please provide both name and email.",
        variant: "destructive",
      });
      return;
    }
    createInvitationMutation.mutate();
  };

  const handleCopyLink = async () => {
    const surveyUrl = `${window.location.origin}/survey/${shareToken}`;
    await navigator.clipboard.writeText(surveyUrl);
    setCopied(true);
    toast({
      title: "Link Copied",
      description: "Survey link copied to clipboard.",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Response Progress Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Survey Response Tracking</CardTitle>
          <Users className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-4">
            <div>
              <p className="text-3xl font-bold text-primary" data-testid="text-response-count">{responseCount}</p>
              <p className="text-sm text-muted-foreground">Responses Received</p>
            </div>
            <div>
              <p className="text-3xl font-bold">{invitations.length}</p>
              <p className="text-sm text-muted-foreground">Invitations Sent</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generate Share Link */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Survey Share Link
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Generate a shareable link that allows stakeholders to complete the survey without logging in.
          </p>
          {!shareToken ? (
            <Button
              onClick={handleGenerateLink}
              disabled={generateTokenMutation.isPending}
              data-testid="button-generate-link"
            >
              {generateTokenMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Share2 className="h-4 w-4 mr-2" />
                  Generate Share Link
                </>
              )}
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="flex gap-2">
                <Input
                  value={`${window.location.origin}/survey/${shareToken}`}
                  readOnly
                  className="font-mono text-sm"
                  data-testid="input-share-link"
                />
                <Button
                  onClick={handleCopyLink}
                  variant="outline"
                  data-testid="button-copy-link"
                >
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Share this link with stakeholders via email or other communication channels.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Stakeholder Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Add Stakeholder
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddStakeholder} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stakeholder-name">Name</Label>
                <Input
                  id="stakeholder-name"
                  value={stakeholderName}
                  onChange={(e) => setStakeholderName(e.target.value)}
                  placeholder="e.g., John Doe"
                  data-testid="input-stakeholder-name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stakeholder-email">Email</Label>
                <Input
                  id="stakeholder-email"
                  type="email"
                  value={stakeholderEmail}
                  onChange={(e) => setStakeholderEmail(e.target.value)}
                  placeholder="e.g., john@example.com"
                  data-testid="input-stakeholder-email"
                />
              </div>
            </div>
            <Button
              type="submit"
              disabled={createInvitationMutation.isPending}
              data-testid="button-add-stakeholder"
            >
              {createInvitationMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Add Stakeholder
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Stakeholder List */}
      {invitations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Invited Stakeholders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {invitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className="flex items-center justify-between p-3 rounded-md bg-muted/30"
                  data-testid={`invitation-${invitation.id}`}
                >
                  <div>
                    <p className="text-sm font-medium">{invitation.stakeholderName}</p>
                    <p className="text-xs text-muted-foreground">{invitation.stakeholderEmail}</p>
                  </div>
                  <Badge variant={invitation.completedAt ? "default" : "secondary"}>
                    {invitation.completedAt ? "Completed" : "Pending"}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

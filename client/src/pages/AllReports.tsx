import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function AllReports() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold">All Reports</h1>
        <p className="text-muted-foreground mt-1">
          Access generated reports and analytics
        </p>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-lg font-medium mb-2">No Reports Yet</p>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Reports will be generated automatically as your studies progress and data is collected.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

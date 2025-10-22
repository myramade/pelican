import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Target, Lightbulb } from "lucide-react";
import type { Study } from "@shared/schema";

interface PortfolioSummaryProps {
  studies: Study[];
}

/**
 * BirdsAI Vue - Portfolio Summary Component
 * Displays aggregate metrics, performance trends, and emerging themes
 */
export function PortfolioSummary({ studies }: PortfolioSummaryProps) {
  // Calculate aggregate IR metrics
  const studiesWithIR = studies.filter(s => s.irMetric !== null && s.irMetric !== undefined);
  const irMetrics = studiesWithIR.map(s => s.irMetric as number);
  
  const avgIR = irMetrics.length > 0 
    ? (irMetrics.reduce((sum, val) => sum + val, 0) / irMetrics.length).toFixed(1)
    : "N/A";
  
  const medianIR = irMetrics.length > 0
    ? (() => {
        const sorted = [...irMetrics].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 === 0
          ? ((sorted[mid - 1] + sorted[mid]) / 2).toFixed(1)
          : sorted[mid].toFixed(1);
      })()
    : "N/A";
  
  const rangeIR = irMetrics.length > 0
    ? `${Math.min(...irMetrics)} - ${Math.max(...irMetrics)}`
    : "N/A";

  // Calculate completion statistics
  const avgCompletion = studies.length > 0
    ? (studies.reduce((sum, s) => sum + (s.completionPercentage || 0), 0) / studies.length).toFixed(0)
    : "0";

  // Extract top 3 emerging themes (from insights)
  const themes = studies
    .filter(s => s.insight)
    .map(s => s.insight as string)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">BirdsAI Vue</h2>
        <p className="text-sm text-muted-foreground">Portfolio Analytics</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Aggregate IR Metrics */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Impact Rating (IR)</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-muted-foreground">Average:</span>
                <span className="text-2xl font-bold">{avgIR}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-muted-foreground">Median:</span>
                <span className="text-lg font-semibold">{medianIR}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-muted-foreground">Range:</span>
                <span className="text-sm">{rangeIR}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Performance */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Performance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-muted-foreground">Total Studies:</span>
                <span className="text-2xl font-bold">{studies.length}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-muted-foreground">Avg Completion:</span>
                <span className="text-lg font-semibold">{avgCompletion}%</span>
              </div>
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-muted-foreground">With IR Data:</span>
                <span className="text-sm">{studiesWithIR.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Emerging Themes */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Emerging Themes</CardTitle>
            <Lightbulb className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {themes.length > 0 ? (
                themes.map((theme, idx) => (
                  <div key={idx} className="text-xs">
                    <span className="font-medium text-primary">{idx + 1}.</span>{" "}
                    <span className="text-muted-foreground line-clamp-2">{theme}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-muted-foreground">No insights available yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

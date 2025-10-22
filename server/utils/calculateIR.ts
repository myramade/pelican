import type { SurveyResponse } from "@shared/schema";

/**
 * Calculate Impact Rating (IR) from aggregated survey responses
 * 
 * IR is calculated as a weighted average of responses across Kirkpatrick levels:
 * - Level 1 (Reaction): 20% weight
 * - Level 2 (Learning): 25% weight
 * - Level 3 (Behavior): 30% weight
 * - Level 4 (Results): 25% weight
 * 
 * @param responses - Array of survey responses
 * @param surveyQuestions - Array of survey questions with level info
 * @returns IR metric (1-10 scale) or null if insufficient data
 */
export function calculateIR(
  responses: SurveyResponse[],
  surveyQuestions: any[]
): number | null {
  if (responses.length === 0 || !surveyQuestions || surveyQuestions.length === 0) {
    return null;
  }

  // Weights for each Kirkpatrick level
  const levelWeights = {
    "Level 1": 0.20,  // Reaction
    "Level 2": 0.25,  // Learning
    "Level 3": 0.30,  // Behavior
    "Level 4": 0.25,  // Results
  };

  // Group questions by Kirkpatrick level
  const questionsByLevel: Record<string, number[]> = {};
  surveyQuestions.forEach((q: any, index: number) => {
    const level = q.level.split(":")[0].trim(); // Extract "Level 1" from "Level 1: Reaction"
    if (!questionsByLevel[level]) {
      questionsByLevel[level] = [];
    }
    questionsByLevel[level].push(index);
  });

  // Calculate average score for each level across all responses
  const levelScores: Record<string, number> = {};

  for (const [level, questionIndices] of Object.entries(questionsByLevel)) {
    const scores: number[] = [];

    responses.forEach((response) => {
      const responseData = response.responseData as Record<number, string>;
      
      questionIndices.forEach((qIndex) => {
        const answer = responseData[qIndex];
        if (answer) {
          // Try to extract numeric value from the answer
          const numericValue = extractNumericValue(answer);
          if (numericValue !== null) {
            scores.push(numericValue);
          }
        }
      });
    });

    if (scores.length > 0) {
      levelScores[level] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
    }
  }

  // Calculate weighted IR score
  let weightedSum = 0;
  let totalWeight = 0;

  for (const [level, weight] of Object.entries(levelWeights)) {
    if (levelScores[level] !== undefined) {
      // Normalize the score to 0-1 range (assuming 5-point scale)
      const normalizedScore = (levelScores[level] - 1) / 4; // Convert 1-5 to 0-1
      weightedSum += normalizedScore * weight;
      totalWeight += weight;
    }
  }

  if (totalWeight === 0) {
    return null;
  }

  // Convert to 1-10 scale and round to 1 decimal
  const irScore = ((weightedSum / totalWeight) * 9) + 1; // Scale to 1-10
  return Math.round(irScore * 10) / 10;
}

/**
 * Extract numeric value from survey answer
 * Handles various answer formats:
 * - Direct numbers: "5", "3"
 * - Rating scale responses: "5 - Strongly Agree"
 * - For text responses, returns null
 */
function extractNumericValue(answer: string): number | null {
  if (!answer) return null;

  // Try to parse as direct number
  const directNum = parseFloat(answer);
  if (!isNaN(directNum) && directNum >= 1 && directNum <= 5) {
    return directNum;
  }

  // Try to extract number from beginning of string (e.g., "5 - Strongly Agree")
  const match = answer.match(/^(\d+)/);
  if (match) {
    const num = parseInt(match[1], 10);
    if (num >= 1 && num <= 5) {
      return num;
    }
  }

  // For open-ended responses or non-numeric, return null
  return null;
}

/**
 * Generate insight based on IR score
 */
export function generateIRInsight(irScore: number): string {
  if (irScore >= 8.5) {
    return "Exceptional impact: Program shows outstanding results across all Kirkpatrick levels.";
  } else if (irScore >= 7.0) {
    return "Strong impact: Program demonstrates significant positive outcomes.";
  } else if (irScore >= 5.5) {
    return "Moderate impact: Program shows measurable benefits with room for improvement.";
  } else if (irScore >= 4.0) {
    return "Limited impact: Program needs refinement to achieve desired outcomes.";
  } else {
    return "Low impact: Significant improvements needed to meet program objectives.";
  }
}

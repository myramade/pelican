import { Check } from "lucide-react";

interface Step {
  number: number;
  label: string;
}

interface StepIndicatorProps {
  currentStep: number;
  steps: Step[];
}

export function StepIndicator({ currentStep, steps }: StepIndicatorProps) {
  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <div className="relative">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const isCompleted = step.number < currentStep;
            const isCurrent = step.number === currentStep;
            const isUpcoming = step.number > currentStep;

            return (
              <div key={step.number} className="flex flex-col items-center flex-1">
                <div className="relative flex items-center justify-center w-full">
                  {index > 0 && (
                    <div
                      className={`absolute right-1/2 top-1/2 -translate-y-1/2 h-0.5 w-full ${
                        isCompleted ? "bg-primary" : "bg-border"
                      }`}
                      style={{ zIndex: 0 }}
                    />
                  )}
                  {index < steps.length - 1 && (
                    <div
                      className={`absolute left-1/2 top-1/2 -translate-y-1/2 h-0.5 w-full ${
                        isCompleted ? "bg-primary" : "bg-border"
                      }`}
                      style={{ zIndex: 0 }}
                    />
                  )}
                  <div
                    className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 font-medium transition-colors ${
                      isCompleted
                        ? "bg-primary border-primary text-primary-foreground"
                        : isCurrent
                        ? "bg-background border-primary text-primary"
                        : "bg-background border-border text-muted-foreground"
                    }`}
                    data-testid={`step-indicator-${step.number}`}
                  >
                    {isCompleted ? <Check className="h-5 w-5" /> : step.number}
                  </div>
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={`text-xs font-medium ${
                      isCurrent ? "text-foreground" : "text-muted-foreground"
                    } hidden sm:block`}
                  >
                    {step.label}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

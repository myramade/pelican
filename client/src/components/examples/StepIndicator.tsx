import { StepIndicator } from '../StepIndicator';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function StepIndicatorExample() {
  const [currentStep, setCurrentStep] = useState(3);
  
  const steps = [
    { number: 1, label: "Program Basics" },
    { number: 2, label: "Success Definition" },
    { number: 3, label: "Expectations" },
    { number: 4, label: "Measurement" },
    { number: 5, label: "Target Audience" },
  ];

  return (
    <div className="p-6 space-y-6">
      <StepIndicator currentStep={currentStep} steps={steps} />
      <div className="flex gap-2 justify-center">
        <Button onClick={() => setCurrentStep(Math.max(1, currentStep - 1))} variant="outline">
          Previous
        </Button>
        <Button onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}>
          Next
        </Button>
      </div>
    </div>
  );
}
